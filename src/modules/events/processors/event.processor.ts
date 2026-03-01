import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { EVENT_PROCESSING_QUEUE, PROCESS_EVENT_JOB } from '../events.queues';
import { EventProcessingService } from '../services/event-processing.service';

@Processor(EVENT_PROCESSING_QUEUE)
export class EventProcessor extends WorkerHost {
  constructor(private readonly eventProcessingService: EventProcessingService) {
    super();
  }

  async process(job: Job<{ eventId: string; tenantId: string }>): Promise<void> {
    if (job.name !== PROCESS_EVENT_JOB) {
      return;
    }

    await this.eventProcessingService.processEvent(job.data.eventId);
  }
}
