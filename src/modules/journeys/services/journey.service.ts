import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SegmentRule } from '../../rules/segment-rule.entity';
import { IngestedEvent } from '../../events/ingested-event.entity';
import { JourneyDefinition } from '../journey-definition.entity';

@Injectable()
export class JourneyService {
  private readonly logger = new Logger(JourneyService.name);

  constructor(
    @InjectRepository(JourneyDefinition)
    private readonly journeyRepository: Repository<JourneyDefinition>,
  ) {}

  async execute(event: IngestedEvent, matchingRules: SegmentRule[]): Promise<void> {
    const journeys = await this.journeyRepository.find({
      where: { tenantId: event.tenantId, isActive: true },
    });

    for (const journey of journeys) {
      const matchingSteps = journey.steps.filter(
        (step) =>
          step.triggerEvent === event.eventName &&
          (!step.conditionRuleId ||
            matchingRules.some((rule) => rule.id === step.conditionRuleId)),
      );

      for (const step of matchingSteps) {
        this.logger.log(
          `Executing ${step.action.type} for tenant=${event.tenantId} customer=${event.customerId}`,
        );
      }
    }
  }
}
