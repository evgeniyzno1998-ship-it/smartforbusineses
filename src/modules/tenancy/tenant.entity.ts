import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/database/base.entity';
import { UserProfile } from '../gamification/user-profile.entity';
import { IngestedEvent } from '../events/ingested-event.entity';
import { SegmentRule } from '../rules/segment-rule.entity';
import { JourneyDefinition } from '../journeys/journey-definition.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'jsonb', default: {} })
  settings!: Record<string, unknown>;

  @OneToMany(() => UserProfile, (profile) => profile.tenant)
  profiles!: UserProfile[];

  @OneToMany(() => IngestedEvent, (event) => event.tenant)
  events!: IngestedEvent[];

  @OneToMany(() => SegmentRule, (rule) => rule.tenant)
  rules!: SegmentRule[];

  @OneToMany(() => JourneyDefinition, (journey) => journey.tenant)
  journeys!: JourneyDefinition[];
}
