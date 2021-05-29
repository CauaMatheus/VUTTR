import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
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

  @Get('github')
  @Redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URL}`,
    307,
  )
  async githubSignIn() {} // eslint-disable-line

  @Get('github/callback')
  async githubSignInCallback(@Query('code') code: string) {
    const access_token = await this.authServices.getAccessToken(code);
    return await this.authServices.getUserData(access_token);
  }
}
