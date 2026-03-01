import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserProfile } from '../user-profile.entity';

@Injectable()
export class XpService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async applyXp(
    tenantId: string,
    customerId: string,
    xpToAdd: number,
  ): Promise<UserProfile> {
    const profile =
      (await this.profileRepository.findOne({
        where: { tenantId, customerId },
      })) ??
      this.profileRepository.create({ tenantId, customerId, xp: 0, level: 1 });

    profile.xp += xpToAdd;
    profile.level = this.resolveLevel(profile.xp);

    return this.profileRepository.save(profile);
  }

  resolveLevel(totalXp: number): number {
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
  }

  resolveXpReward(eventName: string): number {
    const map: Record<string, number> = {
      page_view: 1,
      signup: 20,
      purchase: 50,
      referral: 75,
    };

    return map[eventName] ?? 2;
  }
}
