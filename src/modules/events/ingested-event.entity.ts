import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/database/base.entity';
import { Tenant } from '../tenancy/tenant.entity';

@Entity('events')
@Index(['tenantId', 'customerId', 'eventName', 'occurredAt'])
export class IngestedEvent extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.events)
  tenant!: Tenant;

  @Column({ type: 'varchar', length: 120 })
  customerId!: string;

  @Column({ type: 'varchar', length: 100 })
  eventName!: string;

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>;

  @Column({ type: 'timestamptz' })
  occurredAt!: Date;
}
