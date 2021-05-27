import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({ username, email, password, avatar }: ICreateUserDTO) {
    const userAlreadyExists = await this.usersRepository.findOne({ email });
    if (userAlreadyExists) {
      throw new HttpException('User already exists!', 400);
    }

    const hashedPassword = await hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    const savedUser = await this.usersRepository.save(user);
    if (!savedUser) {
      throw new InternalServerErrorException(
        'Internal server error when trying to create this user',
      );
    }

    savedUser.password = undefined;
    return savedUser;
  }

  async getByID(id: string) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new HttpException('User not found!', 404);
    }

    user.password = undefined;
    return user;
  }
}
