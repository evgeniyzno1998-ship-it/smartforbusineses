import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/database/base.entity';
import { Tenant } from '../tenancy/tenant.entity';

@Entity('user_profiles')
@Index(['tenantId', 'customerId'], { unique: true })
export class UserProfile extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.profiles)
  tenant!: Tenant;

  @Column({ type: 'varchar', length: 120 })
  customerId!: string;

  @Column({ type: 'int', default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ type: 'jsonb', default: {} })
  traits!: Record<string, unknown>;
}
