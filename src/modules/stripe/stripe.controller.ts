import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: any) {
    console.log('Body recibido:', body); // Log para ver lo que llega

    const { planId, planName, planPrice, currency, userId, userName } = body;

    if (!planId || !planName || !planPrice || !currency) {
      throw new Error(
        'Faltan parámetros necesarios para crear el PaymentIntent',
      );
    }

    const amount = Math.round(planPrice * 100);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      userId,
      userName,
      planId,
      planName,
    );

    if (!paymentIntent.clientSecret) {
      throw new Error(
        'No se ha generado el clientSecret para el PaymentIntent',
      );
    }

    return { clientSecret: paymentIntent.clientSecret };
  }
}
