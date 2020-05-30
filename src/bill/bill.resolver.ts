import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { BillService } from './bill.service';
import { BillInput } from './bill.interface';
import { Response } from '../common/response.interface';
import { __ as t } from 'i18n';

@Resolver('Bill')

export class BillResolver {
  constructor(private readonly billService: BillService) { }

  @Query()
  async getBill(@Args('id') id: number): Promise<Response> {
    const data = await this.billService.get(id);
    return { code: 200, data };
  }

  @Query()
  async getAllMonthBills(): Promise<Response> {
    const data = await this.billService.getAllMonth();
    return { code: 200, data };
  }

  @Query()
  async getAllDayBills(): Promise<Response> {
    const data = await this.billService.getAllDay();
    return { code: 200, data };
  }

  @Mutation()
  async createBill(@Args('createBillInput') createBillInput: BillInput): Promise<Response> {
    const data = await this.billService.create(createBillInput);
    return { code: 200, message: t('created_bill'), data };
  }

  @Mutation()
  async updateBill(@Args('updateBillInput') updateBillInput: BillInput) {
    await this.billService.update(updateBillInput);
    return { code: 200, message: t('updated_bill') };
  }

  @Mutation()
  async deleteBill(@Args('id') id: number) {
    await this.billService.delete(id);
    return { code: 200, message: t('deleted_bill') };
  }
}
