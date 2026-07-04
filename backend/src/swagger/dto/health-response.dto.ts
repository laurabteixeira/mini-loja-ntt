import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'mini-loja-api' })
  service: string;

  @ApiProperty({ example: true })
  databaseConnected: boolean;

  @ApiProperty({ example: true })
  redisConnected: boolean;

  @ApiProperty({ example: true })
  databaseUrlConfigured: boolean;

  @ApiProperty({ example: true })
  redisUrlConfigured: boolean;
}
