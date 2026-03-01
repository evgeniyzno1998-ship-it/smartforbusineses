import { Module } from '@nestjs/common';

import { WidgetThemeService } from './services/widget-theme.service';

@Module({
  providers: [WidgetThemeService],
  exports: [WidgetThemeService],
})
export class WidgetModule {}
