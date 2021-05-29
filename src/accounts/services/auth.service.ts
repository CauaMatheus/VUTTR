import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { ILoginUserDTO } from '../dtos/ILoginUserDTO';
import { User } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AuthService {
  api: AxiosInstance;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.api = axios.create({
      headers: { Accept: 'application/json' },
    });
  }

  async login({ email, password }: ILoginUserDTO) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new HttpException('Email or password is incorrect!', 400);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Email or password is incorrect!', 400);
    }

    const authToken = sign({}, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      subject: user.id,
    });

    return {
      token: authToken,
    };
  }

  async getUserData(access_token: string) {
    const { name, avatar_url } = (
      await this.api
        .get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
        .catch(() => {
          throw new HttpException('Unauthorized request!', 401);
        })
    ).data;

    return {
      name,
      avatar_url,
    };
  }

  async getAccessToken(code: string) {
    const response = await this.api
      .post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      })
      .catch(() => {
        throw new HttpException('Request unauthorized!', 403);
      });

    return response.data.access_token;
  }
}
