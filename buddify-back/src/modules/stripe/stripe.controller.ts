import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string },
  ) {
    const { amount, currency } = body;
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
    );
    if (!paymentIntent.client_secret) {
      throw new Error(
        'No se ha generado el client_secret para el PaymentIntent',
      );
    }

    return { clientSecret: paymentIntent.client_secret };
  }
}
