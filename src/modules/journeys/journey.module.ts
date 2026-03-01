import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JourneyDefinition } from './journey-definition.entity';
import { JourneyService } from './services/journey.service';

@Module({
  imports: [TypeOrmModule.forFeature([JourneyDefinition])],
  providers: [JourneyService],
  exports: [JourneyService],
})
export class JourneyModule {}
