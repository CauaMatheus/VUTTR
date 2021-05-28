import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ILoginUserDTO } from '../dtos/ILoginUserDTO';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async create(@Body() loginUserDTO: ILoginUserDTO) {
    return await this.authServices.login(loginUserDTO);
  }
}
