import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { ToolsService } from './services/tools.service';
import { ToolsController } from './controller/tools.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tool])],
  providers: [ToolsService],
  controllers: [ToolsController],
})
export class ToolsModule {}
