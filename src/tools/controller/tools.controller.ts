import { Body, Controller, Post } from '@nestjs/common';
import { ICreateToolDTO } from '../dtos/ICreateToolDTO';
import { ToolsService } from '../services/tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Post()
  async create(@Body() { title, link, description, tags }: ICreateToolDTO) {
    return await this.toolsService.create({ title, link, description, tags });
  }
}
