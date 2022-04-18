import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { OrderDto } from './dto';
import { OrderService } from './order.service';
import { Order } from './schema';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: OrderDto): Promise<Order> {
        return await this.orderService.create(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Order[]> {
        return await this.orderService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string | number): Promise<Order> {
        return await this.orderService.findOne(id);
    }
}
