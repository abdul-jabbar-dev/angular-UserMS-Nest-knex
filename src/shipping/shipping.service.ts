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
};

@Injectable()
export class ShippingService {
  constructor(private readonly knexService: KnexService) {}

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
        const orderId = await this.knexService
          .getKnex()
          .table("_shippingOrder")
          .insert(data)
          .returning("*");
        if (!orderId) {
          throw new UnprocessableEntityException("Shopping Order failed");
        } else {
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

  findAll() {
    return `This action returns all shipping`;
  }

  async findOne(id: number, userInfo: any) {
    try {
      const result = await this.knexService
        .getKnex()
        .table("_shippingOrder")
        .where({ product_id: id, user_id: userInfo.user_id })
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
