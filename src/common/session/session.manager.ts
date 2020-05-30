import { Tedis } from 'tedis';
import { Inject } from "@nestjs/common";

export class SessionManager {
  constructor(@Inject('REDIS') private readonly redis: Tedis) { }

  private _session: string;

  get session(): string {
    return this._session;
  }

  set setSession(value: string) {
    this._session = value;
  }

  async set(key: string, value: string) {
    await this.redis.hset(this.session, key, value);
  }

  async get(key: string) {
    return await this.redis.hget(this.session, key)
  }

}