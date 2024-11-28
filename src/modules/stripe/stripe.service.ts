import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
import fetch from 'node-fetch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
=======
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
>>>>>>> ea0230e5583beb3c36acd510af79be9213fb0345
import { Payment } from './payment.entity';

@Injectable()
export class StripeService {
<<<<<<< HEAD
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}
=======
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }
>>>>>>> ea0230e5583beb3c36acd510af79be9213fb0345

  async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    userName: string,
    planId: string,
    planName: string,
<<<<<<< HEAD
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
=======
    cardholderName: string,
    paymentDate: string,
  ) {
    try {
      const metadata = {
        planId: planId.toString(),
        planName: planName.toString(),
        userId: userId.toString(),
        userName: userName.toString(),
        cardholderName: cardholderName.toString(),
        paymentDate: paymentDate.toString(),
      };

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: metadata,
      });

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
        cardholderName,
        paymentDate: new Date(paymentDate),
      });

      await this.paymentRepository.save(payment);

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error);
      throw new Error(`Error en StripeService: ${error.message}`);
    }
>>>>>>> ea0230e5583beb3c36acd510af79be9213fb0345
  }
}
