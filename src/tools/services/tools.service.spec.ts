import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { Tool } from '../entities/tool.entity';
import { ToolsService } from './tools.service';

describe('ToolsService', () => {
  let service: ToolsService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolsService,
        {
          provide: getRepositoryToken(Tool),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  beforeEach(() => {
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Tool', () => {
    it('should be able to create a new tool', async () => {
      const tool = TestUtil.getValidTool();
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.create.mockReturnValue(tool);
      mockRepository.save.mockReturnValue(tool);

      const savedTool = await service.create(tool);
      expect(savedTool).toMatchObject(tool);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should not be able to create a new tool if tool already exists', async () => {
      const tool = TestUtil.getValidTool();
      mockRepository.findOne.mockReturnValue(tool);

      await service.create(tool).catch((exception) => {
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception).toMatchObject({
          status: 400,
          response: 'Tool already Exist',
        });
      });
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).not.toBeCalled();
      expect(mockRepository.save).not.toBeCalled();
    });

    it('should return exception when tool was not created', async () => {
      const tool = TestUtil.getValidTool();
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.create.mockReturnValue(tool);
      mockRepository.save.mockReturnValue(null);

      await service.create(tool).catch((exception) => {
        expect(exception).toBeInstanceOf(InternalServerErrorException);
        expect(exception).toMatchObject({
          message: 'Internal server error when trying to create this tool',
        });
      });
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
