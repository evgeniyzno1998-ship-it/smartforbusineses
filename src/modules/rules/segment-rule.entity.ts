import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/database/base.entity';
import { Tenant } from '../tenancy/tenant.entity';
import { RuleNode } from './types/rule.types';

@Entity('segment_rules')
export class SegmentRule extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.rules)
  tenant!: Tenant;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb' })
  definition!: RuleNode;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;
}
