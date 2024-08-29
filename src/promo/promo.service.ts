import { KnexService } from "./../service/knex.service";
import { TPromocode, TPromocodeResponce } from "./../types/Promo";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class PromoService {
  constructor(protected knex: KnexService) {}

  async create(user_id: string, createPromo: TPromocode) {
    try {
      const [result] = await this.knex
        .getKnex()
        .table("_promocode")
        .insert({
          ...createPromo,
          is_active: false,
          author_id: user_id,
          code: createPromo.code.toUpperCase(),
        })
        .returning("*");

      return result;
    } catch (error) {
      if (error.constraint === "_promocode_code_unique") {
        throw new HttpException(
          { message: "Promo code already exists" },
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        { message: "An error occurred while creating the promocode" },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(
    pageSize: string | Number | undefined,
    page: string | undefined | Number
  ) {
    const offset = (Number(page) - 1) * Number(pageSize);
    try { 
      const result: TPromocodeResponce[] = await this.knex
        .getKnex()
        .table("_promocode")
        .select("*")
        .orderBy("created_at", "desc")
        .limit(Number(pageSize))
        .offset(offset);
 
      const currentDate = new Date();
      const processedResult = result.map((promo) => ({
        ...promo,
        is_expire: new Date(promo.valid_to) < currentDate,
      })); 
      const totalQuery = this.knex
        .getKnex()
        .table<TPromocodeResponce>("_promocode");
      const [{ count: total }] = await totalQuery.count("*");

      return {
        data: processedResult,
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
      };
    } catch (error) {
      throw new HttpException(
        { message: "An error occurred while retrieving promocodes" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async for_users() {
    try {
      const currentDate = new Date();

      const result: TPromocodeResponce[] = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ is_active: true, visible: "public" })
        .andWhere("valid_to", ">=", currentDate)
        .select("*");

      return result;
    } catch (error) {
      throw new HttpException(
        { message: "An error occurred while retrieving promocodes" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

   async verifyCode(code: string) {
    try {
      const promocode = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ code })
        .first();
      if (!promocode) {
        throw new HttpException(
          { message: "Invalid promocode" },
          HttpStatus.BAD_REQUEST
        );
      }
      if (!promocode.is_active) {
        throw new HttpException(
          { message: "Inactive promocode" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (promocode.usage_limit <= promocode.times_used) {
        throw new HttpException(
          { message: "Promocode usage limit reached" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (new Date(promocode.valid_to) < new Date()) {
        throw new HttpException(
          { message: "Promocode expired" },
          HttpStatus.BAD_REQUEST
        );
      }
      return promocode;
    } catch (error) { 
      if (error.message) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<TPromocodeResponce> {
    try {
      const promocode = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .select("*")
        .first();

      if (!promocode) {
        throw new HttpException(
          { message: "Promocode does not exist" },
          HttpStatus.NOT_FOUND
        );
      }

      return promocode;
    } catch (error) {
      throw new HttpException(
        "An error occurred while retrieving the promocode",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updatePromoDto: TPromocode) {
    try {
      const [updated] = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .update(updatePromoDto)
        .returning("*"); // Use returning to get updated data

      if (!updated) {
        throw new HttpException(
          "Promocode does not exist",
          HttpStatus.NOT_FOUND
        );
      }

      return updated;
    } catch (error) {
      throw new HttpException(
        "An error occurred while updating the promocode",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async toggleState(id: number) {
    try {
      const promocode = await this.findOne(id);

      const updatedPromocode = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .update({ is_active: !promocode.is_active })
        .returning("*");

      return updatedPromocode;
    } catch (error) {
      throw new HttpException(
        { message: "An error occurred while toggling the promocode state" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async toggleVisibility(id: number) {
    try {
      const promocode = await this.findOne(id);

      const updatedPromocode = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .update({
          visible: promocode.visible === "public" ? "private" : "public",
        })
        .returning("*");

      return updatedPromocode;
    } catch (error) {
      throw new HttpException(
        { message: "An error occurred while toggling the promocode state" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async usePromocode(id: number): Promise<TPromocodeResponce> {
    try {
      const promocode = await this.findOne(id);

      if (!promocode.is_active) {
        throw new HttpException(
          { message: "Inactive promocode" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (promocode.usage_limit <= promocode.times_used) {
        throw new HttpException(
          { message: "Promocode usage limit reached" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (new Date(promocode.valid_to) < new Date()) {
        throw new HttpException(
          { message: "Promocode expired" },
          HttpStatus.BAD_REQUEST
        );
      }
 
      return await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .increment("times_used", 1)
        .returning("*")[0];
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const deletedCount = await this.knex
        .getKnex()
        .table("_promocode")
        .where({ id })
        .del();

      if (!deletedCount) {
        throw new HttpException(
          "Promocode does not exist",
          HttpStatus.NOT_FOUND
        );
      }

      return { message: "Promocode removed successfully" };
    } catch (error) {
      throw new HttpException(
        "An error occurred while removing the promocode",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
