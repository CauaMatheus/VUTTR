import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controller/users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class AccountsModule {}
