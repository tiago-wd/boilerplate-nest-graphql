import { Module } from '@nestjs/common';
import { redisCon } from '../providers/redis.provider';
import { SessionManager } from './session.manager';

@Module({
  providers: [
    SessionManager,
    redisCon
  ],
  exports: [SessionManager]
})
export class SessionManagerModule { }
