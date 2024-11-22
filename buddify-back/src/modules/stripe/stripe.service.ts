import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  async createPaymentIntent(amount: number, currency: string) {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency,
        'payment_method_types[]': 'card',
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API returned error: ${response.statusText}`);
    }

    return await response.json();
  }
}
