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
  @Post()
  async create(@Body() createShipping) {
    const result = await this.shippingService.create(createShipping);

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

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingService.remove(+id);
  }
}
