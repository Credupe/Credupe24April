import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { LoanApplicationsModule } from '../loan-applications/loan-applications.module';

@Module({
  imports: [LoanApplicationsModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
