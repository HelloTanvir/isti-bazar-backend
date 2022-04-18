import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
