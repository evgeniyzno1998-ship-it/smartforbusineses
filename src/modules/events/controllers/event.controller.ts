import { Body, Controller, Post } from '@nestjs/common';

import { IngestEventDto } from '../dto/ingest-event.dto';
import { EventIngestionService } from '../services/event-ingestion.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventIngestionService: EventIngestionService) {}

  @Post('ingest')
  ingest(@Body() body: IngestEventDto): Promise<{ eventId: string; status: string }> {
    return this.eventIngestionService.ingest(body);
  }
}
