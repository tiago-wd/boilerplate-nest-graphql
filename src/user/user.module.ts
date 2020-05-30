import { AuthService } from '../auth/auth.service';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { SessionManagerModule } from '../common/session/session-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SessionManagerModule
  ],
  providers: [UserService, UserResolver, AuthService],
  exports: [UserService]
})

export class UserModule { }
