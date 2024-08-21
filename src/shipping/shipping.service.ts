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
  country: string;
  zip: string;
};

@Injectable()
export class ShippingService {
  constructor(private readonly knexService: KnexService) {}

  async create(createShipping: TOrder) {
    try {
      const result = await this.knexService
        .getKnex()
        .transaction(async (trx) => {
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
            state: createShipping.address.state,
            zip: createShipping.address.zip,
            address_line2: createShipping.address.addressLine2,
          };
          const isSoled = await trx("_products").where({
            id: data.product_id,
            status: "sold",
          });
          if (isSoled?.length) {
            throw new UnprocessableEntityException("Product Already Placed");
          }

          const [orderId] = await trx<Order>("_shippingOrder")
            .insert(data)
            .returning("*");
          if (!orderId) {
            throw new UnprocessableEntityException("Shopping Order failed");
          }
          const updateProductState = await trx("_products")
            .where({ id: data.product_id })
            .update({ status: "sold" });

          if (updateProductState === 0) {
            throw new UnprocessableEntityException(
              "Failed to update product status"
            );
          } else {
            return updateProductState;
          }
        });

      return result;
    } catch (error) {
      if (error.message) {
        throw new UnprocessableEntityException(error.message);
      } else {
        throw new UnprocessableEntityException(error);
      }
    }
  }

  findAll() {
    return `This action returns all shipping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipping`;
  }

  update(id: number, updateShippingDto: any) {
    return `This action updates a #${id} shipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipping`;
  }
}
