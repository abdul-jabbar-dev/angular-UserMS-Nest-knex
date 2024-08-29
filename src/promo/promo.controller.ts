import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from "@nestjs/common";
import { PromoService } from "./promo.service";

@Controller("promo")
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post("create")
  async create(@Body() createPromoDto) {
    let { user_id, ...promoInfo } = createPromoDto;
    return await this.promoService.create(user_id, promoInfo);
  }

  @Get()
  findAll(
    @Query()
    {
      pageSize = 5,
      page = 1,
      admin,
    }: {
      pageSize: string | number;
      page: string | number;
      admin: boolean;
    }
  ) {
    console.log(pageSize, page);
    return this.promoService.findAll(pageSize, page);
  }

  @Get("for_users")
  for_users() {
    return this.promoService.for_users();
  }

  @Get("verify/:code")
  async verifyCode(@Param("code") code) {
    const result = await this.promoService.verifyCode(code);
    return result;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promoService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePromoDto) {
    return this.promoService.update(+id, updatePromoDto);
  }
  @Put("status/:id")
  toggoleState(@Param("id") id: string) {
    return this.promoService.toggleState(Number(id));
  }

  @Put("visibility/:id")
  toggoleVisibility(@Param("id") id: string) {
    return this.promoService.toggleVisibility(Number(id));
  }

  @Put("use/:id")
  usePromocode(@Param("id") id: string) {
    return this.promoService.usePromocode(Number(id));
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.promoService.remove(+id);
  }
}
