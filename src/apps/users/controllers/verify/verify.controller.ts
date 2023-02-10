import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'apps/auth';
import { SendEmailInput } from 'apps/users/dtos/verify/send-email.input.dto';
import { VerifyInput } from 'apps/users/dtos/verify/verify.input.dto';
import { VerifyService } from 'apps/users/services';
import { ModuleName } from 'utils';

@ApiTags(ModuleName.VERIFY)
@Controller(ModuleName.VERIFY.toLowerCase())
export class VerifyController {
  constructor(private verifyService: VerifyService) {}

  @Public()
  @Post()
  async verify(@Body() input: VerifyInput) {
    return await this.verifyService.verify(input.code);
  }

  @Public()
  @Post('generate-code')
  async generateCode(@Body() input: SendEmailInput) {
    return await this.verifyService.sendEmail(input.email);
  }
}
