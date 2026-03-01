import { IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class IngestEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tenantSlug!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  customerId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventName!: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;

  @IsDateString()
  occurredAt!: string;
}
