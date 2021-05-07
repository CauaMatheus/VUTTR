import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ICreateToolDTO } from '../dtos/ICreateToolDTO';
import { ToolsService } from '../services/tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Post()
  async create(@Body() { title, link, description, tags }: ICreateToolDTO) {
    return await this.toolsService.create({ title, link, description, tags });
  }

  @Get()
  async list(@Query('tag') tag: string) {
    return await this.toolsService.list({ tag });
  }
}
