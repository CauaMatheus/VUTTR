import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateToolDTO } from '../dtos/ICreateToolDTO';
import { Tool } from '../entities/tool.entity';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tool)
    private toolsRepository: Repository<Tool>,
  ) {}

  async create({
    title,
    link,
    description,
    tags = [],
  }: ICreateToolDTO): Promise<Tool> {
    const toolAlreadyExist = await this.toolsRepository.findOne({ title });
    if (toolAlreadyExist) {
      throw new HttpException('Tool already Exist', HttpStatus.BAD_REQUEST);
    }

    const tool = this.toolsRepository.create({
      title,
      link,
      description,
      tags,
    });

    const savedTool = await this.toolsRepository.save(tool);
    if (!savedTool) {
      throw new InternalServerErrorException(
        'Internal server error when trying to create this tool',
      );
    }
    return savedTool;
  }
}
