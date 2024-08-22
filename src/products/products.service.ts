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
      if (error?.message && searchQuery?.split(":").length) {
        let [SF] = searchQuery?.split(":");
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
      console.log(result);
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
      console.log(error);
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
  async getMyProducts(userId: string, query) {
    try {
      let result = this.knex
        .getKnex()
        .table("_products as p")
        .leftJoin("_shippingOrder as s", "p.id", "s.product_id")
        .leftJoin("_users as u", "s.user_id", "u.id")
        .select(
          "p.*",
          "s.order_number",
          "u.id as order_user_id",
          "u.username as order_user_name"
        )
        .where("p.user_id", userId);

      const filter: string[] = JSON?.parse(query?.filter) as string[];
      let all: any[] = await result;

      const groupCount = all.reduce(
        (
          acc: { [x: string]: number },
          current: { [x: string]: string | number }
        ) => {
          if (!acc[current["status"]]) {
            acc[current["status"]] = 0;
          }
          acc[current["status"]]++;
          return acc;
        },
        {}
      );

      if (filter.length > 0) {
        all = all.filter((item) => filter.includes(item.status));
      }

      return { data: all, group: groupCount };
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
