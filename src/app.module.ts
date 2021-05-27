import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToolsModule } from './tools/tools.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, ToolsModule, UsersModule],
})
export class AppModule {}
