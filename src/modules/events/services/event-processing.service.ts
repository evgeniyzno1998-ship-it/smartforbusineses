import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { XpService } from '../../gamification/services/xp.service';
import { JourneyService } from '../../journeys/services/journey.service';
import { RuleEvaluatorService } from '../../rules/services/rule-evaluator.service';
import { SegmentRule } from '../../rules/segment-rule.entity';
import { IngestedEvent } from '../ingested-event.entity';

@Injectable()
export class EventProcessingService {
  constructor(
    @InjectRepository(IngestedEvent)
    private readonly eventRepository: Repository<IngestedEvent>,
    @InjectRepository(SegmentRule)
    private readonly ruleRepository: Repository<SegmentRule>,
    private readonly ruleEvaluator: RuleEvaluatorService,
    private readonly xpService: XpService,
    private readonly journeyService: JourneyService,
  ) {}

  async processEvent(eventId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      return;
    }

    const rules = await this.ruleRepository.find({
      where: { tenantId: event.tenantId, isActive: true },
    });

    const context = {
      customerId: event.customerId,
      eventName: event.eventName,
      properties: event.properties,
      occurredAt: event.occurredAt.toISOString(),
    };

    const matchingRules = rules.filter((rule) =>
      this.ruleEvaluator.evaluate(rule.definition, context),
    );

    const xpReward = this.xpService.resolveXpReward(event.eventName);
    await this.xpService.applyXp(event.tenantId, event.customerId, xpReward);

    await this.journeyService.execute(event, matchingRules);
  }
}
