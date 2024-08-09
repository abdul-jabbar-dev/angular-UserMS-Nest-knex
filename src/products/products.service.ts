import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { KnexService } from "src/service/knex.service";
import { TProduct } from "src/types/Product";

@Injectable()
export class ProductsService {
  constructor(public knex: KnexService) {}
  async createNewProduct(item: TProduct) {
    try {
      const result = await this.knex
        .getKnex()
        .table("_products")
        .insert(item)
        .returning("*");
      return result;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async getAllProducts() {
    try {
      const result = await this.knex.getKnex().table("_products").select("*");
      return result;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async getAProduct(id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table("_products")
        .where({ id })
        .first();

      return result;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async getMyProducts(id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table("_products")
        .where({ user_id: id });

      return result;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async deleteAProduct(id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table("_products")
        .where({ id })
        .del();

      if (result === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      } else return result;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
}
