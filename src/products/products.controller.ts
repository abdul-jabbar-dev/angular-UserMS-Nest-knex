import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("product")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("create")
  async createProduct(@Body() item: any) {
    const result = await this.productsService.createNewProduct(item);
    return result;
  }
  @Get("get_products")
  async allProducts(
    @Query()
    { token, searchQuery }: { token: string; searchQuery: string } | undefined
  ) {
    const result = await this.productsService.getAllProducts(
      token,
      searchQuery
    );
    return result;
  }
  @Get("get_all_products")
  async allProductsAdmin(
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
    if (!admin) {
      throw new UnauthorizedException("Unauthorized route");
    }
    const result = await this.productsService.getAllProductsAdmin(
      pageSize,
      page
    );
    return result;
  }
  @Get("get_product/:id")
  async singleProduct(@Param("id") id) {
    const result = await this.productsService.getAProduct(id);
    return result;
  }
  @Delete("delete/:id")
  async deleteProduct(@Param("id") id) {
    const result = await this.productsService.deleteAProduct(id);
    return result;
  }
  @Get("my_products")
  async myProducts(@Body() { user_id }) {
    const result = await this.productsService.getMyProducts(user_id);
    return result;
  }
  @Put("update/:id")
  async myProductUpdate(@Body() productInfo, @Param("id") id) {
    const result = await this.productsService.updateMyProduct(productInfo, id);
    return result;
  }
}
