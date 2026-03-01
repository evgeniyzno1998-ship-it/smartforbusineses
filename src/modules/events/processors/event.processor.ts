import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { EventProcessingService } from '../services/event-processing.service';

@Processor('event-processing')
export class EventProcessor extends WorkerHost {
  constructor(private readonly eventProcessingService: EventProcessingService) {
    super();
  }

  async process(job: Job<{ eventId: string; tenantId: string }>): Promise<void> {
    if (job.name !== 'process-ingested-event') {
      return;
    }

    await this.eventProcessingService.processEvent(job.data.eventId);
  }
}
