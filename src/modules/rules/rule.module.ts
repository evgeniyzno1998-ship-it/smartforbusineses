import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SegmentRule } from './segment-rule.entity';
import { RuleEvaluatorService } from './services/rule-evaluator.service';

@Module({
  imports: [TypeOrmModule.forFeature([SegmentRule])],
  providers: [RuleEvaluatorService],
  exports: [RuleEvaluatorService, TypeOrmModule],
})
export class RuleModule {}
