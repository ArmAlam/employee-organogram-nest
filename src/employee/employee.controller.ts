import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id/subordinates')
  getSubordinates(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getSubordinates(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/subordinates/authenticated')
  getAuthenticatedSubordinates(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getSubordinates(id);
  }
}
