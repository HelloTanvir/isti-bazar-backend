import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { OrderDto } from './dto';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderService } from './order.service';
import { Order } from './schema';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create an order' })
    @ApiCreatedResponse({ type: Order })
    async create(@Body() dto: OrderDto): Promise<Order> {
        return await this.orderService.create(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel all orders' })
    @ApiOkResponse({ type: [Order] })
    async findAll(): Promise<Order[]> {
        return await this.orderService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel a single order' })
    @ApiOkResponse({ type: Order })
    async findOne(@Param('id') id: string | number): Promise<Order> {
        return await this.orderService.findOne(id);
    }

    @Post('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update an order' })
    @ApiOkResponse({ type: Order })
    @ApiBearerAuth()
    async update(@Param('id') id: string | number, @Body() dto: OrderUpdateDto): Promise<Order> {
        return await this.orderService.update(id, dto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete an order' })
    @ApiOkResponse({ type: Order })
    @ApiBearerAuth()
    async delete(@Param('id') id: string | number): Promise<Order> {
        return await this.orderService.delete(id);
    }
}
