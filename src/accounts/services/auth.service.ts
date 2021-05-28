import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { ILoginUserDTO } from '../dtos/ILoginUserDTO';
import { User } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
}
