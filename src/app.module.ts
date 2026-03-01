import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventModule } from './modules/events/event.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { JourneyModule } from './modules/journeys/journey.module';
import { RuleModule } from './modules/rules/rule.module';
import { TenantModule } from './modules/tenancy/tenant.module';
import { SdkModule } from './modules/sdk/sdk.module';
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
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<string>('REDIS_PORT', '6379')),
        },
      }),
    }),
    TenantModule,
    RuleModule,
    GamificationModule,
    JourneyModule,
    EventModule,
    SdkModule,
    WidgetModule,
  ],
})
export class AppModule {}
