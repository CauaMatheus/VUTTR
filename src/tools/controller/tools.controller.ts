import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ICreateToolDTO } from '../dtos/ICreateToolDTO';
import { IDeleteToolDTO } from '../dtos/IDeleteToolDTO';
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

  @Delete(':id')
  async delete(@Param() { id }: IDeleteToolDTO) {
    return await this.toolsService.delete(id);
  }
}
