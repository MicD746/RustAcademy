import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorProfileModule } from './users/tutor-profile.module';
import { SubmissionModule } from './submissions/submission.module';
import { RewardsModule } from './rewards/rewards.module';
import { BadgesModule } from './badges/badges.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [TutorProfileModule, SubmissionModule, RewardsModule, BadgesModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
