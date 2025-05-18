import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getSubordinatesRecursive(employee: Employee): Promise<any> {
    const fullEmployee = (await this.employeeRepository.findOne({
      where: { id: employee.id },
      relations: ['subordinates'],
    })) as Employee;

    const subordinates = await Promise.all(
      (fullEmployee?.subordinates || []).map((sub) =>
        this.getSubordinatesRecursive(sub),
      ),
    );

    return {
      id: fullEmployee.id,
      name: fullEmployee.name,
      position: fullEmployee.position,
      subordinates,
    };
  }

  async getSubordinates(managerId: number) {
    this.logger.log(`Fetching managers for id ${managerId}`);

    const manager = await this.employeeRepository.findOne({
      where: { id: managerId },
    });

    if (!manager) {
      this.logger.error(`Employee not found for id: ${managerId}`);

      throw new NotFoundException('Manager not found');
    }

    const data = await this.getSubordinatesRecursive(manager);

    return {
      managerId: data.id,
      managerName: data.name,
      managerPosition: data.position,
      subordinates: data.subordinates,
    };
  }
}
