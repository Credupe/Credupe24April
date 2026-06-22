import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { LoanProductsModule } from '../loan-products/loan-products.module';
import { LoanApplicationsModule } from '../loan-applications/loan-applications.module';

@Module({
  imports: [LoanProductsModule, LoanApplicationsModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
