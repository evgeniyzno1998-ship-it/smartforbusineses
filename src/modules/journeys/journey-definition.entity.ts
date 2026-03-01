import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/database/base.entity';
import { Tenant } from '../tenancy/tenant.entity';
import { JourneyStep } from './types/journey.types';

@Entity('journeys')
export class JourneyDefinition extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.journeys)
  tenant!: Tenant;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb' })
  steps!: JourneyStep[];
}
