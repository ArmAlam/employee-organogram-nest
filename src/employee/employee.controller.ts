import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id/subordinates')
  getSubordinates(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getSubordinates(id);
  }
}
