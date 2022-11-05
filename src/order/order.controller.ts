import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    // eslint-disable-next-line prettier/prettier
    Query
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { GetCurrentUser } from '../common/decorators';
import { OrderCreateDto, OrderUpdateDto } from './dto';
import { FilterQuery } from './interfaces';
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
    async create(
        @GetCurrentUser('userId') userId: string,
        @Body() dto: OrderCreateDto
    ): Promise<Order> {
        return await this.orderService.create(userId, dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel all orders' })
    @ApiOkResponse({ type: [Order] })
    async findAll(
        @GetCurrentUser('userId') userId: string,
        @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
        @Query('size', new DefaultValuePipe(10), new ParseIntPipe()) size: number,
        @Query('orderId') orderId: string,
        @Query('merchantId') merchantId: string,
        @Query('status') status: string,
        @Query('customerName') customerName: string,
        @Query('customerNumber') customerNumber: string,
        @Query('date') date: string
    ): Promise<Order[]> {
        const filterQuery: FilterQuery = {
            _id: orderId,
            merchantId,
            status,
            customerName,
            customerNumber,
            updated_at: date,
        };

        console.log(filterQuery);

        return await this.orderService.findAll(userId, page, size, filterQuery);
    }

    @Get('/:orderId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel a single order' })
    @ApiOkResponse({ type: Order })
    async findOne(
        @GetCurrentUser('userId') userId: string,
        @Param('orderId') orderId: string
    ): Promise<Order> {
        return await this.orderService.findOne(userId, orderId);
    }

    @Post('/:orderId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update an order' })
    @ApiOkResponse({ type: Order })
    @ApiBearerAuth()
    async update(
        @GetCurrentUser('userId') userId: string,
        @Param('orderId') orderId: string,
        @Body() dto: OrderUpdateDto
    ): Promise<Order> {
        return await this.orderService.update(userId, orderId, dto);
    }

    @Delete('/:orderId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete an order' })
    @ApiOkResponse({ type: Order })
    @ApiBearerAuth()
    async delete(
        @GetCurrentUser('userId') userId: string,
        @Param('orderId') orderId: string
    ): Promise<Order> {
        return await this.orderService.delete(userId, orderId);
    }
}
