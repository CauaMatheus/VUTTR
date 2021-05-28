import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToolsModule } from './tools/tools.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [DatabaseModule, ToolsModule, AccountsModule],
})
export class AppModule {}
