import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';
import { ActivityStatus } from 'modules/activities/enums/activity-status.enum';
import { MailService } from 'modules/mail/mail.service';
import { Payment } from 'modules/stripe/payment.entity';
import { StripeService } from 'modules/stripe/stripe.service';
import { Users } from 'modules/users/users.entity';
import * as moment from 'moment';
import { In, LessThan, Not, Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Activity) private readonly ActivitiesRepository:Repository<Activity>,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        private readonly mailService: MailService,
        private readonly stripeService:StripeService,
    ){}
  @Cron('* * * * *')
  async handleCron() {
    await this.changePendingToCancell();
    await this.changeComfirmedToSuccess();
  }

  async changePendingToCancell() {
    const now = moment().toDate();
    await this.ActivitiesRepository.update(
        { status: ActivityStatus.PENDING, date: LessThan(now) },
        { status: ActivityStatus.CANCELLED },
      );
  }

  async changeComfirmedToSuccess() {
    const now = moment().toDate(); 
    await this.ActivitiesRepository.update(
    { status: ActivityStatus.CONFIRMED, date: LessThan(now) },
    { status: ActivityStatus.SUCCESS },
    )
  }

  @Cron('0 0 * * *') 
  async handlePremiumPlans() {
    const now = moment().startOf('day');

    const payments = await this.paymentRepository.find({
      where: {  status: 'succeeded', },
    });
    for (const payment of payments) {
      const expirationDate = moment(payment.paymentDate).startOf('day').add(30, 'days');
      const daysToExpire = expirationDate.diff(now, 'days');
      if (daysToExpire === 7) {
        const user = await this.userRepository.findOne({ where: { id: payment.userId } });
        if (user) {
          await this.mailService.sendWanringEndPlan(user.email, user.name);
          await this.paymentRepository.save(payment);
        }
      } else if (daysToExpire < 0) {
        const user = await this.userRepository.findOne({ where: { id: payment.userId } });
        if (user && user.isPremium) {
          user.isPremium = false;
          await this.userRepository.save(user);
        }
        payment.status = 'expired';
        await this.paymentRepository.save(payment);
        await this.mailService.sendExpiredPlanNotification(user.email, user.name);
      }

      
    }
  }

  @Cron('0 0 * * *') 
  async checkPaymentsStatus() {
    const payments = await this.paymentRepository.find({
      where: {  status: Not(In(['succeeded', 'expired'])),},
    });

    for (const payment of payments) {
      await this.stripeService.updatePaymentStatus(payment.id);
    }
  }

}
