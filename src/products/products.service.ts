import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KnexService } from 'src/service/knex.service';
import { TProduct } from 'src/types/Product';

@Injectable()
export class ProductsService {
  constructor(
    public knex: KnexService,
    public jwt: JwtService,
  ) {}

  async createNewProduct(item: TProduct & { user_id: any }) {
    try {
      const user = await this.knex
        .getKnex()
        .table('_users')
        .where({ id: item.user_id })
        .first()
        .select(['status', 'role']);

      if (user) {
        if (user.status === 'active') {
          console.log('from service', user);
          const result = await this.knex
            .getKnex()
            .table('_products')
            .insert(item)
            .returning('*');
          return result;
        } else {
          throw new UnauthorizedException(
            'Your account is inactive, please contact with admin.',
          );
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async getAllProducts(token: string | undefined) {
    try {
      const query = this.knex.getKnex().table('_products').select('*');

      if (token) {
        const user = await this.jwt.decode(token);

        if (user && user.id) {
          query.whereNot({ user_id: user.id });
        } else {
          throw new BadRequestException('Invalid token: User ID is missing.');
        }
      }

      return await query.where({ status: 'available' });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'An error occurred while fetching products.',
      );
    }
  }
  async getAProduct(id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table('_products')
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
        .table('_products as p')
        .where('p.user_id', id);
    
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
        .table('_products')
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
  async updateMyProduct(updatedData: Partial<TProduct>, id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table('_products')
        .where({ id })
        .update(updatedData);
      if (result === 0) {
        throw new NotFoundException(` product ${id} not found`);
      }
      const updatedProduct = await this.knex
        .getKnex()
        .table('_products')
        .where({ id })
        .first();

      return updatedProduct;
    } catch (error) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
}
