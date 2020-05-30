import { User } from './../user/user.entity';
import jwt from 'jsonwebtoken';
import { Injectable, Inject } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-core';
import { SessionManager } from '../common/session/session.manager';

@Injectable()
export class AuthService {

  private readonly _whitelist = [
    'login',
    'register'
  ]

  constructor(@Inject('SessionManager') private readonly session: SessionManager) { }

  async createToken(user: User) {
    const secretOrKey = 'secret';
    const expiresIn = '2 days';
    const token = jwt.sign({ user }, secretOrKey, { expiresIn });
    this.setAuthUser(user);
    return { expiresIn, token };
  }

  public async isValidPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async validateUser(token: string, operationName: string) {
    if (this._whitelist.some(item => item === operationName)) {
      return true;
    }

    if (!token) {
      throw new AuthenticationError('Unauthenticated');
    }
    if (token.slice(0, 6) === 'Bearer') {
      token = token.slice(7);
    } else {
      throw new AuthenticationError('Invalid token');
    }

    try {
      const decodedToken = <{ user: User }>jwt.verify(token, 'secret');
      this.setUserSession(decodedToken.user.id);
      return decodedToken ? true : false;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('The authorization code is incorrect');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('The authorization code has expired');
      }
    }

    return true;
  }

  async setUserSession(user_id: number): Promise<void> {
    const session_name: string = `user_${user_id}`;
    this.session.setSession = session_name;
  }

  async setAuthUser(user: User): Promise<void> {
    this.setUserSession(user.id);
    await this.session.set('user', JSON.stringify(user));
  }

  async getAuthUser(): Promise<User> {
    return JSON.parse(await this.session.get('user'));
  }

}
