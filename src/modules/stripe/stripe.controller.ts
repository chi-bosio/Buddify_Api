import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Role } from 'utils/roles';
import { Roles } from 'decorators/roles.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: any) {
    const {
      planId,
      planName,
      planPrice,
      currency,
      userId,
      userName,
      cardholderName,
      paymentDate,
    } = body;

    if (
      !planId ||
      !planName ||
      !planPrice ||
      !currency ||
      !userId ||
      !userName ||
      !cardholderName ||
      !paymentDate
    ) {
      throw new HttpException(
        'Faltan parámetros necesarios para crear el PaymentIntent',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof planPrice !== 'number' || planPrice <= 0) {
      throw new HttpException(
        'El precio del plan debe ser un número positivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (currency !== 'usd') {
      throw new HttpException(
        'Moneda no soportada, solo se acepta USD',
        HttpStatus.BAD_REQUEST,
      );
    }

    const amount = Math.round(planPrice * 100);

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        userId,
        userName,
        planId,
        planName,
        cardholderName,
        paymentDate,
      );

      if (!paymentIntent.clientSecret) {
        throw new HttpException(
          'No se ha generado el clientSecret para el PaymentIntent',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { clientSecret: paymentIntent.clientSecret };
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error);
      throw new HttpException(
        `Error al crear el PaymentIntent: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Admin)
  @Get('earnings')
  async getMonthlyEarnings() {
    return this.stripeService.getMonthlyEarnings();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('total-earnings') 
  async getTotalEarnings() {
    return await this.stripeService.getTotalEarnings();
  }
}
