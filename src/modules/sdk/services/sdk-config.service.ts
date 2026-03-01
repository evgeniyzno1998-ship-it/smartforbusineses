import { Injectable } from '@nestjs/common';

@Injectable()
export class SdkConfigService {
  getBootstrapConfig(tenantSlug: string): Record<string, unknown> {
    return {
      tenantSlug,
      ingestionUrl: '/api/v1/events/ingest',
      flushIntervalMs: 3000,
      maxBatchSize: 20,
    };
  }
}
