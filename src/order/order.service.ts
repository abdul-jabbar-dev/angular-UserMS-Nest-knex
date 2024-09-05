import { Injectable } from "@nestjs/common";
import { KnexService } from "src/service/knex.service";
@Injectable()
export class OrderService {
  constructor(protected knex: KnexService) {}

  async create(createOrderDto) {
    try {
       
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return `This action returns all order`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
