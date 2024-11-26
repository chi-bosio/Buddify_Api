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
}
