import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecureService } from './secure.service';

@Controller('secure')
export class SecureController {
  constructor(private readonly secureService: SecureService) {}

  @Post()
  create() {
    return this.secureService.create();
  }

  @Get()
  findAll() {
    return this.secureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.secureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.secureService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.secureService.remove(+id);
  }
}
