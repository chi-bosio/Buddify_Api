import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'modules/activities/activity.entity';
import { ActivityStatus } from 'modules/activities/enums/activity-status.enum';
import { MailService } from 'modules/mail/mail.service';
import { Payment } from 'modules/stripe/payment.entity';
import { StripeService } from 'modules/stripe/stripe.service';
import { Users } from 'modules/users/users.entity';
import moment from 'moment';
import { LessThan, Repository } from 'typeorm';

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
    const now = moment(); 

    const payments = await this.paymentRepository.find({
      where: { status: 'active' },
    });

    for (const payment of payments) {
      const expirationDate = moment(payment.startDate).add(30, 'days');
      const daysToExpire = expirationDate.diff(now, 'days');

      
      if (daysToExpire === 7) {
        const user = await this.userRepository.findOne({ where: { id: payment.userId } });
        if (user) {
          await this.mailService.sendEndPlan(user.email, user.name);
        }
      }

      if (daysToExpire < 0) {
        const user = await this.userRepository.findOne({ where: { id: payment.userId } });
        if (user && user.isPremium) {
          user.isPremium = false; 
          await this.userRepository.save(user); 
        }
        payment.status = 'expired';
        await this.paymentRepository.save(payment);
      }
    }
  }

  @Cron('0 0 * * *') // Ejecución diaria a medianoche
async checkPaymentsStatus() {
  const payments = await this.paymentRepository.find({
    where: { status: 'pending' },
  });

  for (const payment of payments) {
    await this.stripeService.updatePaymentStatus(payment.id);
  }
}

}
