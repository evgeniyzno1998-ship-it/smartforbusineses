import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

import { TenantService } from '../../tenancy/services/tenant.service';
import { IngestEventDto } from '../dto/ingest-event.dto';
import { IngestedEvent } from '../ingested-event.entity';

@Injectable()
export class EventIngestionService {
  constructor(
    @InjectRepository(IngestedEvent)
    private readonly eventRepository: Repository<IngestedEvent>,
    private readonly tenantService: TenantService,
    @InjectQueue('event-processing')
    private readonly eventQueue: Queue,
  ) {}

  async ingest(dto: IngestEventDto): Promise<{ eventId: string; status: string }> {
    const tenant = await this.tenantService.getBySlugOrFail(dto.tenantSlug);

    const event = this.eventRepository.create({
      tenantId: tenant.id,
      customerId: dto.customerId,
      eventName: dto.eventName,
      properties: dto.properties ?? {},
      occurredAt: new Date(dto.occurredAt),
    });

    const saved = await this.eventRepository.save(event);

    await this.eventQueue.add(
      'process-ingested-event',
      {
        eventId: saved.id,
        tenantId: saved.tenantId,
      },
      {
        removeOnComplete: true,
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    return { eventId: saved.id, status: 'queued' };
  }
}
