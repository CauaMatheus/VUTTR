import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create User', () => {
    it('should be able to create an user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);

      const savedUser = await service.create(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should not be able to create an existing user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(user);

      await service.create(user).catch((exception) => {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.response).toBe('User already exists!');
        expect(exception.status).toBe(400);
      });

      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).not.toBeCalled();
      expect(mockRepository.save).not.toBeCalled();
    });

    it('should return an exception if user was not created', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(null);

      await service.create(user).catch((exception) => {
        expect(exception).toBeInstanceOf(InternalServerErrorException);
        expect(exception.message).toBe(
          'Internal server error when trying to create this user',
        );
      });

      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
