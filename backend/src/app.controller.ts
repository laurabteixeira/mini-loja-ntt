import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponseDto } from './swagger/dto/health-response.dto';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API, database and Redis connectivity' })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiTooManyRequestsResponse({ description: 'Rate limit exceeded' })
  async getHealth() {
    return this.appService.getHealth();
  }
}
