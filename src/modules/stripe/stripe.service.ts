import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from './payment.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    userName: string,
    planId: string,
    planName: string,
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
  }
}
