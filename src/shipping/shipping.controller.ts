import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ShippingService } from "./shipping.service";

@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get("")
  findAll(@Body() { user_id }) {
    return this.shippingService.findAll(user_id);
  }

  @Get("/get_rider_order")
  findAllOrderRider(@Body() { user_id }) {
    return this.shippingService.findAllOrderRider(user_id);
  }

  @Get("/all")
  findAllOrderAdmin() {
    return this.shippingService.findAllOrderAdmin();
  }

  findAOrderRider(@Param("order_id") id: string, @Body() { user_id }) {
    return this.shippingService.findAOrderRider(user_id, id);
  }

  @Put("/confirm_rider/:order_id")
  async rider_confirm(@Param("order_id") id: string, @Body() { user_id }) {
    const res = await this.shippingService.findAOrderRider(user_id, id);

    return await this.shippingService.rider_confirm(res);
  }
  @Post()
  async create(@Body() createShipping) {
    const result = await this.shippingService.create(createShipping);

    return result;
  }
  @Post("/add_rider")
  async addRider(@Body() createShipping) {
    const result = await this.shippingService.addrider(createShipping);

    return result;
  }

  @Post("/confirm")
  async confirmPayment(@Body() createShipping) {
    return await this.shippingService.confirmPayment(createShipping);
  }

  @Get(":product_id")
  async findOne(@Param("product_id") id: string) {
 
    return await this.shippingService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateShipping) {
    return this.shippingService.update(+id, updateShipping);
  }

  @Put("addpromo/:orderId")
  addPromo(@Param("orderId") id: string, @Body() updateShipping) {
    return this.shippingService.addPromo(+id, updateShipping);
  }

  @Put("confirm_delivery/:orderId")
  confirmDelivery(@Param("orderId") id: string, @Body() {code}) { 
    return this.shippingService.confirmDelivery(+id, code);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingService.remove(+id);
  }
}
