import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GamificationModule } from '../gamification/gamification.module';
import { JourneyModule } from '../journeys/journey.module';
import { RuleModule } from '../rules/rule.module';
import { SegmentRule } from '../rules/segment-rule.entity';
import { TenantModule } from '../tenancy/tenant.module';
import { EventController } from './controllers/event.controller';
import { EVENT_DLQ_QUEUE, EVENT_PROCESSING_QUEUE } from './events.queues';
import { IngestedEvent } from './ingested-event.entity';
import { EventProcessor } from './processors/event.processor';
import { EventIngestionService } from './services/event-ingestion.service';
import { EventProcessingService } from './services/event-processing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestedEvent, SegmentRule]),
    BullModule.registerQueue(
      { name: EVENT_PROCESSING_QUEUE },
      { name: EVENT_DLQ_QUEUE },
    ),
    TenantModule,
    RuleModule,
    GamificationModule,
    JourneyModule,
  ],
  controllers: [EventController],
  providers: [EventIngestionService, EventProcessingService, EventProcessor],
})
export class EventModule {}
