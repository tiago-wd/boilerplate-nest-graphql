import { SessionManagerModule } from './../common/session/session-manager.module';
import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { User } from '../user/user.entity';
import { BillResolver } from './bill.resolver';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, User]),
    UserModule,
    SessionManagerModule
  ],
  providers: [BillService, BillResolver, AuthService],
  exports: [BillService]
})
export class BillModule { }
