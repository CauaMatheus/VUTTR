import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToolsModule } from './tools/tools.module';

@Module({
  imports: [DatabaseModule, ToolsModule],
})
export class AppModule {}
