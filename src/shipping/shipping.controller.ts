import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ShippingService } from "./shipping.service";

@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  async create(@Body() createShipping) {
    return await this.shippingService.create(createShipping);
  }

  @Get()
  findAll() {
    return this.shippingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shippingService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateShipping) {
    return this.shippingService.update(+id, updateShipping);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shippingService.remove(+id);
  }
}
