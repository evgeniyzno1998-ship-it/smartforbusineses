import { Module } from '@nestjs/common';

import { SdkConfigService } from './services/sdk-config.service';

@Module({
  providers: [SdkConfigService],
  exports: [SdkConfigService],
})
export class SdkModule {}
