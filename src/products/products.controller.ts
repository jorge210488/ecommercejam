import { Controller, Delete, Get, Post, Put, HttpCode, Param, UseGuards, Body, Query, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuthGuard } from "../auth/AuthGuard";
import { Product } from "./Products.entity";
import { CreateProductDto, UpdateProductDto } from "./CreateProduct.dto";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../auth/role.enum";
import { RolesGuard } from "../auth/RolesGuard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

        @HttpCode(200)
        @ApiQuery({ name: 'page', required: false, example: 1 })
        @ApiQuery({ name: 'limit', required: false, example: 5 })
        @Get()
        async getProducts(
            @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // Recibe el parámetro de query 'page'
            @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number // Recibe el parámetro de query 'limit'
           ){
            return this.productsService.getProducts(page, limit);
        }

        @HttpCode(200)
        @Get(":id")
        async getProductById(@Param("id", new ParseUUIDPipe()) id: string) {
            return this.productsService.getProductById(id);
        }
        
        @ApiBearerAuth()
        @UseGuards(AuthGuard)
        @Post()
        async createProduct(@Body() productData: CreateProductDto) {
            return this.productsService.createProduct(productData);
        }

        @Post("sedeer")
        async preloadCategories(){
            return this.productsService.preloadProducts();
        }
    
        @ApiBearerAuth()
        @HttpCode(200)
        @Put(':id')
        @Roles(Role.Admin)
        @UseGuards(AuthGuard, RolesGuard)
        async updateProduct(
            @Param('id', new ParseUUIDPipe()) id: string,
            @Body() updateData: UpdateProductDto
        ) {
            return this.productsService.updateProduct(id, updateData);
        }
    
        @ApiBearerAuth()
        @UseGuards(AuthGuard)
        @HttpCode(200)
        @Delete(':id')
        async deleteProduct(
            @Param('id', new ParseUUIDPipe()) id: string
        ) {
            return this.productsService.deleteProduct(id);
        }    
    }