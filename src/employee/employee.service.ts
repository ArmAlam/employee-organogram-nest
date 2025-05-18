import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
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
    const manager = await this.employeeRepository.findOne({
      where: { id: managerId },
    });

    if (!manager) {
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
