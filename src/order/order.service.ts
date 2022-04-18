import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schema';
import { OrderDto } from './dto';
import { OrderUpdateDto } from './dto/order-update.dto';
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

    async findAll(): Promise<Order[]> {
        return await this.orderModel.find();
    }

    async findOne(id: string | number): Promise<Order> {
        return await this.orderModel.findById(id);
    }

    async update(id: string | number, dto: OrderUpdateDto): Promise<Order> {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new ForbiddenException('order does not exist');
        }

        const newOrder: Order = {
            ...order,
            ...dto,
        };

        return await this.orderModel.findByIdAndUpdate(id, newOrder, { new: true });
    }

    async delete(id: string | number): Promise<Order> {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new ForbiddenException('order does not exist');
        }

        await order.remove();

        return order;
    }
}
