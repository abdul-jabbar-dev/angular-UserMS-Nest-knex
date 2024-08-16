import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { KnexService } from "src/service/knex.service";
import { TProduct, TProductResponse } from "src/types/Product";

@Injectable()
export class ProductsService {
  constructor(
    public knex: KnexService,
    public jwt: JwtService
  ) {}

  async createNewProduct(item: TProduct & { user_id: any }) {
    try {
      const user = await this.knex
        .getKnex()
        .table("_users")
        .where({ id: item.user_id })
        .first()
        .select(["status", "role"]);

      if (user) {
        if (user.status === "active") {
          console.log("from service", user);
          const result = await this.knex
            .getKnex()
            .table("_products")
            .insert(item)
            .returning("*");
          return result;
        } else {
          throw new UnauthorizedException(
            "Your account is inactive, please contact with admin."
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

  async getAllProducts(
    token: string | undefined,
    searchQuery: string | undefined
  ) {
    try {
      const query = this.knex
        .getKnex()
        .table("_products")
        .where({ status: "available" });

      if (token) {
        const user = await this.jwt.decode(token);
        if (user && user.id) {
          query.whereNot({ user_id: user.id });
        } else {
          throw new BadRequestException("Invalid token: User ID is missing.");
        }
      }

      if (searchQuery) {
        let [SF, SV] = searchQuery.split(":");
        query
          .whereRaw(`LOWER(${SF}) LIKE ?`, [`${SV.toLowerCase()}%`])
          .select("id", "title");
      }

      return await query;
    } catch (error) {
      if (error?.message) {
        let [SF] = searchQuery?.split(":") || undefined;
        if (SF && error.message.includes(`column "${SF}" does not exist`)) {
          return [];
        }
      }
      throw new BadRequestException(
        error.message || "An error occurred while fetching products."
      );
    }
  }

  async getAllProductsAdmin(
    pageSize: string | Number | undefined,
    page: string | undefined | Number
  ) {
    const offset = (Number(page) - 1) * Number(pageSize);
 
    try {
      const expectResult = this.knex
        .getKnex()
        .table<TProductResponse>("_products")
        .orderBy("created_at", "desc")
        .limit(Number(pageSize))
        .offset(offset);

      const result = await expectResult;
console.log(result)
      const totalQuery = this.knex
        .getKnex()
        .table<TProductResponse>("_products");

      const [total] = await totalQuery.count();
      return {
        data: result,
        total: total,
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      console.log(error)
      throw new BadRequestException("Could not fetch products");
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
        .table("_products as p")
        .where("p.user_id", id);

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
  async updateMyProduct(updatedData: Partial<TProduct>, id: string) {
    try {
      const result = await this.knex
        .getKnex()
        .table("_products")
        .where({ id })
        .update(updatedData);
      if (result === 0) {
        throw new NotFoundException(` product ${id} not found`);
      }
      const updatedProduct = await this.knex
        .getKnex()
        .table("_products")
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
