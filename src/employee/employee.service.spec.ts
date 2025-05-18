import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: jest.Mocked<Repository<Employee>>;

  const mockRepo = () => ({
    findOne: jest.fn(),
  });
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useFactory: mockRepo,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repository = module.get(getRepositoryToken(Employee));
  });

  it('should return nested subordinates', async () => {
    const engineer: Employee = {
      id: 3,
      name: 'Engineer',
      position: 'Engineer',
      manager: null,
      subordinates: [],
    };

    const senior: Employee = {
      id: 2,
      name: 'Senior',
      position: 'Senior Engineer',
      manager: null,
      subordinates: [engineer],
    };

    const cto: Employee = {
      id: 1,
      name: 'CTO',
      position: 'CTO',
      manager: null,
      subordinates: [senior],
    };

    repository.findOne.mockImplementation(async (options) => {
      const where = options.where;
      if (!Array.isArray(where) && where?.id) {
        switch (where.id) {
          case 1:
            return cto;
          case 2:
            return senior;
          case 3:
            return engineer;
        }
      }
      return null;
    });

    const result = await service.getSubordinates(1);
    expect(result).toEqual({
      managerId: 1,
      managerName: 'CTO',
      managerPosition: 'CTO',
      subordinates: [
        {
          id: 2,
          name: 'Senior',
          position: 'Senior Engineer',
          subordinates: [
            {
              id: 3,
              name: 'Engineer',
              position: 'Engineer',
              subordinates: [],
            },
          ],
        },
      ],
    });
  });

  it('should throw NotFoundException if manager not found', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.getSubordinates(99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return empty subordinates array if manager has no subordinates', async () => {
    const soloManager: Employee = {
      id: 5,
      name: 'Manager',
      position: 'Lead',
      manager: null,
      subordinates: [],
    };

    repository.findOne.mockResolvedValue(soloManager);

    const result = await service.getSubordinates(5);
    expect(result.subordinates).toEqual([]);
  });

  it('should return only direct subordinates if they have no nested subordinates', async () => {
    const directSub1: Employee = {
      id: 6,
      name: 'Dev1',
      position: 'Engineer',
      manager: null,
      subordinates: [],
    };

    const directSub2: Employee = {
      id: 7,
      name: 'Dev2',
      position: 'Engineer',
      manager: null,
      subordinates: [],
    };

    const midManager: Employee = {
      id: 4,
      name: 'Team Lead',
      position: 'Senior Engineer',
      manager: null,
      subordinates: [directSub1, directSub2],
    };

    repository.findOne.mockImplementation(async (options) => {
      const id = !Array.isArray(options.where) && options.where?.id;
      switch (id) {
        case 4:
          return midManager;
        case 6:
          return directSub1;
        case 7:
          return directSub2;
        default:
          return null;
      }
    });

    const result = await service.getSubordinates(4);
    expect(result.subordinates.length).toBe(2);
    expect(result.subordinates[0].subordinates).toEqual([]);
    expect(result.subordinates[1].subordinates).toEqual([]);
  });

  it('should handle deep hierarchy (more than 3 levels)', async () => {
    const dev: Employee = {
      id: 10,
      name: 'Dev',
      position: 'Engineer',
      manager: null,
      subordinates: [],
    };

    const lead: Employee = {
      id: 9,
      name: 'Lead',
      position: 'Senior Engineer',
      manager: null,
      subordinates: [dev],
    };

    const director: Employee = {
      id: 8,
      name: 'Director',
      position: 'CTO',
      manager: null,
      subordinates: [lead],
    };

    repository.findOne.mockImplementation(async (options) => {
      const id = !Array.isArray(options.where) && options.where?.id;
      switch (id) {
        case 8:
          return director;
        case 9:
          return lead;
        case 10:
          return dev;
        default:
          return null;
      }
    });

    const result = await service.getSubordinates(8);
    expect(result.subordinates[0].subordinates[0].name).toBe('Dev');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
});
