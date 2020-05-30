import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { Repository } from 'typeorm';
import { BillInput } from './bill.interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BillService {

  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  async get(id: number): Promise<Bill> {
    return await this.billRepository.findOne(id, {
      relations: ['user']
    });

  }

  async getAllMonth(): Promise<any> {
    const user = await this.authService.getAuthUser();

    const list = await this.billRepository.find(
      {
        where: { 'user': { id: user.id } },
        relations: ['user'],
        order: { mes: "ASC" }

      }
    );

    const total = list.reduce((a, b) => a + (parseInt(b.valor) || 0), 0);

    return { total, list };
  }

  async getAllDay(): Promise<any> {
    const user = await this.authService.getAuthUser();
    const day = new Date();

    const list = await this.billRepository.find(
      {
        where: {
          'user': { id: user.id },
          'mes': day.getDate().toString().padStart(2, '0')
        },
        relations: ['user'],
        order: { mes: "ASC" }
      }
    );

    const total = list.reduce((a, b) => a + (parseInt(b.valor) || 0), 0);

    return { total, list };
  }

  async create(createBillInput: BillInput): Promise<Bill> {
    const user = await this.authService.getAuthUser();
    return await this.billRepository.save(this.billRepository.create({ ...createBillInput, user }));
  }

  async update(updateBillInput: BillInput): Promise<void> {
    await this.billRepository.save(await this.billRepository.preload(updateBillInput));
  }

  async delete(id: number): Promise<void> {
    await this.billRepository.delete(id);
  }

}
