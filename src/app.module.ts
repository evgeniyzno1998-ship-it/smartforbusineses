import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { EventModule } from './modules/events/event.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { JourneyModule } from './modules/journeys/journey.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { RuleModule } from './modules/rules/rule.module';
import { SegmentsModule } from './modules/segments/segments.module';
import { SdkModule } from './modules/sdk/sdk.module';
import { TenantModule } from './modules/tenancy/tenant.module';
import { UsersModule } from './modules/users/users.module';
import { WidgetModule } from './modules/widgets/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5432')),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'retentionos'),
        autoLoadEntities: true,
        synchronize: false,
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<string>('REDIS_PORT', '6379')),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: Number(config.get<string>('REDIS_DB', '0')),
        },
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      }),
    }),
    AuthModule,
    TenantModule,
    UsersModule,
    EventModule,
    RuleModule,
    SegmentsModule,
    GamificationModule,
    JourneyModule,
    RewardsModule,
    BillingModule,
    SdkModule,
    WidgetModule,
  ],
})
export class AppModule {}
