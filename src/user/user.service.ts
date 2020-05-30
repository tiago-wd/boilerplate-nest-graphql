import { Geography } from 'geojson';
import { AuthService } from '../auth/auth.service';
import { HttpException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserInput } from './user.interface';
import { LoginInput } from './../auth/auth.interface';
import { __ as t } from 'i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  async get(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async me(): Promise<User> {
    const usuario = await this.authService.getAuthUser();
    return await this.userRepository.createQueryBuilder('users')
      .where("users.id = :id", { id: usuario.id })
      .getOne();
  }

  async create(createUserInput: UserInput) {
    if (createUserInput.email && await this.userRepository.findOne({ where: { email: createUserInput.email } })) {
      throw new HttpException(t('unique_email_required'), 409);
    }
    const user = await this.userRepository.save(this.userRepository.create({ ...createUserInput }));

    const token = await this.authService.createToken(user);
    return { ...token, user };

  }

  async update(updateUserInput: UserInput): Promise<void> {
    const user = await this.authService.getAuthUser();
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      if (await this.userRepository.findOne({ where: { email: updateUserInput.email } })) {
        throw new HttpException(t('unique_email_required'), 409);
      }
    }
    await this.userRepository.save(await this.userRepository.preload({ ...updateUserInput, id: user.id }));
  }

  async login(auth: LoginInput) {
    const { email, password } = auth;
    if (!email || !password) {
      throw new HttpException(t('email_required'), 422);
    }

    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException(t('user_not_found'), 401);
    }
    if (!(await this.authService.isValidPassword(user, password))) {
      throw new HttpException(t('invalid_password'), 401);
    }

    if (auth.device_id) {
      await this.userRepository.update(user.id, { "device_id": auth.device_id });
      user.device_id = auth.device_id;
    }

    const token = await this.authService.createToken(user);
    return { ...token, user };
  }
}
