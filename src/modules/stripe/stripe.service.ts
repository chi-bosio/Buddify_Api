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
      //expira el plan anterior si es que esta activo
      const existingPayment = await this.paymentRepository.findOne({
        where: {
          status: 'succeeded', 
          userId: userId,
          planId: planId,
        },
      });
  
      if (existingPayment) {
        existingPayment.status = 'expired';
        await this.paymentRepository.save(existingPayment);
      }
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: metadata,
        automatic_payment_methods: { enabled: true },
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
        status: paymentIntent.status,
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

  async updatePaymentStatus(paymentId: string) {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

    if (!payment) {
      throw new Error('Pago no encontrado');
    }

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
    switch (paymentIntent.status) {
      case 'succeeded':
        payment.status = 'succeeded';
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
        payment.status = 'unknown'; 
        break;
    }

    await this.paymentRepository.save(payment);
  }

  async getMonthlyEarnings(): Promise<{ month: string; total: number }[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .select("TO_CHAR(payment.paymentDate, 'YYYY-MM')", 'month') 
      .addSelect('SUM(payment.amount) / 1000', 'total') 
      .where("payment.status = 'succeeded'") 
      .groupBy("TO_CHAR(payment.paymentDate, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTotalEarnings(): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total') 
      .where("payment.status = 'succeeded'")  
      .getRawOne();

    return result?.total ? result.total / 1000 : 0; 
  }
  
}
