import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDTO: ICreateUserDTO) {
    return await this.usersService.create(createUserDTO);
  }

  @Get(':id')
  async getByID(@Param('id') id: string) {
    return await this.usersService.getByID(id);
  }
}
