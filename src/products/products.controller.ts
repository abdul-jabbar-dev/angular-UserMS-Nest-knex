import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async createProduct(@Body() item: any) {
    const result = await this.productsService.createNewProduct(item);
    return result;
  }
  @Get('get_products')
  async allProducts(
    @Body() user,
    @Query() { token }: { token: string } | undefined,
  ) {
    const result = await this.productsService.getAllProducts(token);
    return result;
  }
  @Get('get_product/:id')
  async singleProduct(@Param('id') id) {
    const result = await this.productsService.getAProduct(id);
    return result;
  }
  @Delete('delete/:id')
  async deleteProduct(@Param('id') id) {
    const result = await this.productsService.deleteAProduct(id);
    return result;
  }
  @Get('my_products')
  async myProducts(@Body() { user_id }) {
 
    const result = await this.productsService.getMyProducts(user_id);
    return result;
  }
  @Put('update/:id')
  async myProductUpdate(@Body() productInfo, @Param('id') id) {
    const result = await this.productsService.updateMyProduct(productInfo, id);
    return result;
  }
}
