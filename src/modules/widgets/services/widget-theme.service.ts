import { Injectable } from '@nestjs/common';

@Injectable()
export class WidgetThemeService {
  resolveTheme(tenantSettings: Record<string, unknown>): Record<string, unknown> {
    return {
      mode: tenantSettings.themeMode ?? 'light',
      primaryColor: tenantSettings.primaryColor ?? '#4f46e5',
      borderRadius: tenantSettings.borderRadius ?? 12,
      logoUrl: tenantSettings.logoUrl ?? null,
    };
  }
}
