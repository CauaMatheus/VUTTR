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
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    where: jest.fn(),
    getMany: jest.fn(),
    delete: jest.fn(),
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
    mockRepository.find.mockReset();
    mockRepository.createQueryBuilder.mockReset();
    mockRepository.where.mockReset();
    mockRepository.getMany.mockReset();
    mockRepository.delete.mockReset();
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

  describe('List Tool', () => {
    it('should be able to list all tools', async () => {
      const tool = TestUtil.getValidTool();
      mockRepository.find.mockReturnValue([tool, tool]);

      const listedTools = await service.list({ tag: undefined });

      expect(listedTools.length).toBe(2);
      expect(mockRepository.find).toBeCalledTimes(1);
      expect(mockRepository.getMany).not.toBeCalled();
    });

    it('should be able to list tools filtered by tags', async () => {
      const tool = TestUtil.getValidTool();
      mockRepository.getMany.mockReturnValue([tool]);
      mockRepository.find.mockReturnValue([tool, tool]);

      mockRepository.where.mockReturnValue({ getMany: mockRepository.getMany });
      mockRepository.createQueryBuilder.mockReturnValue({
        where: mockRepository.where,
      });

      const listedTools = await service.list({ tag: 'Example' });
      expect(listedTools.length).toBe(1);
      expect(mockRepository.getMany).toBeCalledTimes(1);
      expect(mockRepository.find).not.toBeCalled();
    });
  });

  describe('Delete tool', () => {
    it('should be able to delete a tool', async () => {
      mockRepository.delete.mockReturnValue(true);

      const result = await service.delete('Example ID');
      expect(result).not.toBeDefined();
    });

    it('should return exception when tool was not deleted', async () => {
      mockRepository.delete.mockReturnValue(false);
      await service.delete('Example ID').catch((err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err).toMatchObject({
          message: 'Internal server error when trying to delete this tool',
        });
      });
    });
  });
});
