import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInput } from './user.interface';
import { LoginInput } from './../auth/auth.interface';
import { Inject } from '@nestjs/common';
import { User } from './user.entity';
import { __ as t } from 'i18n';

@Resolver('User')
export class UserResolver {
  constructor(@Inject('UserService') private readonly userService: UserService) { }

  @Query()
  async me(): Promise<User> {
    return await this.userService.me();
  }

  @Mutation()
  async register(@Args('registerInput') registerInput: UserInput) {
    return await this.userService.create(registerInput);
    // return { code: 200, message: t('created_user'), data };
  }

  @Mutation()
  async updateUser(@Args('updateUserInput') updateUserInput: UserInput) {
    await this.userService.update(updateUserInput);
    return { code: 200, message: t('updated_user') };
  }

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('device_id') device_id: string,
  ) {
    const auth: LoginInput = { email, password, device_id };
    return await this.userService.login(auth);
  }
}
