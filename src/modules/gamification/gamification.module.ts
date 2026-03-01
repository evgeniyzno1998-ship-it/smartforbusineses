import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProfile } from './user-profile.entity';
import { XpService } from './services/xp.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  providers: [XpService],
  exports: [XpService],
})
export class GamificationModule {}
