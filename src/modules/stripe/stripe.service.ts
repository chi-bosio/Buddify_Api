import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class StripeService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    userName: string,
    planId: string,
    planName: string,
  ) {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: currency,
        'payment_method_types[]': 'card',
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API returned error: ${response.statusText}`);
    }

    const paymentIntent = await response.json();

    if (!paymentIntent.client_secret) {
      throw new Error(
        'No se ha generado el client_secret para el PaymentIntent',
      );
    }

    const payment = this.paymentRepository.create({
      userId,
      userName,
      planId,
      planName,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: 'pending',
    });

    await this.paymentRepository.save(payment);

    return { clientSecret: paymentIntent.client_secret };
  }

  async updatePaymentStatus(paymentId: string) {
    // Buscar el pago en tu base de datos
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    // Llamada a la API de Stripe para obtener el estado actual del PaymentIntent
    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${payment.stripePaymentIntentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el PaymentIntent desde Stripe: ${response.statusText}`);
    }

    const paymentIntent = await response.json();

    // Verifica el estado del PaymentIntent y actualiza el estado del pago en tu base de datos
    switch (paymentIntent.status) {
      case 'succeeded':
        payment.status = 'completed'; // O 'success', según tu lógica
        break;
      case 'pending':
        payment.status = 'pending';
        break;
      case 'failed':
        payment.status = 'failed';
        break;
      case 'canceled':
        payment.status = 'canceled';
        break;
      default:
        payment.status = 'unknown'; // Si no coincide con ningún estado, marca como desconocido
        break;
    }

    // Guardar los cambios en la base de datos
    await this.paymentRepository.save(payment);
  }
}
