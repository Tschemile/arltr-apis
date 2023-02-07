import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'apps/auth';
import { VerifyService } from 'apps/users/services';
import { TableName } from 'utils';

@ApiTags(TableName.VERIFY)
@Controller(TableName.VERIFY.toLowerCase())
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  @Public()
  @Post()
  async verify(@Body() code: string) {
    return await this.verifyService.verify(code);
  }

  @Public()
  @Post('generate-code')
  async generateCode(@Body() email: string) {
    return await this.verifyService.sendEmail(email);
  }
}
