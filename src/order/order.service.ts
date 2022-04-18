import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schema';
import { OrderDto } from './dto';
import { Order, OrderDocument } from './schema';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>
    ) {}

    async create(dto: OrderDto): Promise<Order> {
        dto.products.forEach(async (p) => {
            const product = await this.productModel.findById(p.id);
            if (!product) {
                throw new ForbiddenException('product does not exist');
            }
        });

        const newOrder = new this.orderModel(dto);
        return newOrder.save();
    }
}
