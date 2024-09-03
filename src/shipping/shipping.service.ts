import { PromoService } from "./../promo/promo.service";
import { KnexService } from "src/service/knex.service";
import { TOrder } from "./../types/Shipping";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
type Order = {
  user_id: number;
  product_id: number;
  shipping_email: string;
  shipping_phone: string;
  shipping_zone: string;
  shipping_cost: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  product_price: number;
  country: string;
  zip: string;
  order_status: string;
  promocode_id?: number;
};

@Injectable()
export class ShippingService {
  constructor(
    private readonly knexService: KnexService,
    protected promoService: PromoService
  ) {}

  async addPromo(id: number, promoId: { promocode_id: string }) {
    try {
      const promo = await this.promoService.verifyCode(promoId.promocode_id);
      const result = await this.knexService
        .getKnex()
        .table("_shippingOrder")
        .where({ id })
        .update({ promocode_id: promo.id })
        .returning("*");

      if (result.length > 0) {
        await this.promoService.usePromocode(promo.id);
        return result[0];
      } else {
        throw new Error("No rows were updated");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createShipping: TOrder) {
    try {
      const exist = await this.knexService
        .getKnex()
        .table("_shippingOrder")
        .where({
          product_id: createShipping.product.id,
          user_id: createShipping.user_id,
        })
        .first();

      if (exist) {
        return exist;
      } else {
        const data: Order = {
          user_id: createShipping.user_id,
          product_id: Number(createShipping.product.id),
          shipping_cost: Number(createShipping.bill.cost),
          shipping_zone: createShipping.bill.spot,
          shipping_email: createShipping.address.email,
          shipping_phone: createShipping.address.phone,
          city: createShipping.address.city,
          address_line1: createShipping.address.addressLine1,
          country: createShipping.address.country,
          product_price: createShipping.product.price,
          state: createShipping.address.state,
          zip: createShipping.address.zip,
          address_line2: createShipping.address.addressLine2,
          order_status: "pending",
        };
        if (createShipping.promocode_id) {
          const promo = await this.promoService.verifyCode(
            createShipping.promocode_id
          );

          if (promo) {
            data["promocode_id"] = promo.id;
          }
        }
        const orderId = await this.knexService
          .getKnex()
          .table("_shippingOrder")
          .insert(data)
          .returning("*");
        if (!orderId) {
          throw new UnprocessableEntityException("Shopping Order failed");
        } else {
          if (data.promocode_id) {
            await this.promoService.usePromocode(data.promocode_id);
          }
          return orderId;
        }
      }
    } catch (error) {
      if (error.message) {
        throw new UnprocessableEntityException(error.message);
      } else {
        throw new UnprocessableEntityException(error);
      }
    }
  }

  async confirmPayment(createShipping: any) {
    try {
      const knex = this.knexService.getKnex();

      await knex.transaction(async (trx) => {
        const product = await trx("_shippingOrder")
          .where({ order_number: createShipping.orderNumber })
          .first();

        await trx("_shippingOrder")
          .where({
            order_number: createShipping.orderNumber,
            user_id: createShipping.user_id,
          })
          .update({
            order_status: "paid",
          });

        await trx("_products").where({ id: product.product_id }).update({
          status: "sold",
        });
      });

      return "Product Placed Successfully";
    } catch (error) {
      console.error("Error updating tables:", error);
    }
  }

  async findAll(user_id: string) {
    try {
      const result = await this.knexService
        .getKnex()
        .select(
          "_shippingOrder.*",
          "_promocode.*",
          "_products.*",
          "_shippingOrder.created_at as shipping_order_created_at"
        )
        .from("_shippingOrder")
        .leftJoin("_promocode", "_shippingOrder.promocode_id", "_promocode.id")
        .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
        .where("_shippingOrder.user_id", user_id);

      return { data: result };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.knexService
        .getKnex()
        .table("_shippingOrder")
        .select(
          "_shippingOrder.*",
          "_promocode.*",
          "_products.*",
          "_users.id",
          "_users.first_name",
          "_users.last_name",
          "_users.phone",
          "_users.username",
          "_shippingOrder.id  as order_id",
          "_users.email",
          "_shippingOrder.created_at as shipping_order_created_at",
          "_shippingOrder.updated_at as shipping_updated_at"
        )
        .from("_shippingOrder")
        .leftJoin("_promocode", "_shippingOrder.promocode_id", "_promocode.id")
        .leftJoin("_products", "_shippingOrder.product_id", "_products.id")
        .leftJoin("_users", "_shippingOrder.user_id", "_users.id")
        .where("_shippingOrder.product_id", id)
        .first();

      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateShippingDto: any) {
    return `This action updates a #${id} shipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipping`;
  }
}
