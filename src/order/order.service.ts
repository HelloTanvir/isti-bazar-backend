import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { OrderCreateDto, OrderUpdateDto } from './dto';
import { Order, OrderDocument } from './schema';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        private readonly productService: ProductService
    ) {}

    async create(userId: string, dto: OrderCreateDto): Promise<Order> {
        let itemTotal = 0;

        for (const p of dto.products) {
            const product = await this.productService.findOne(userId, p.productId);
            if (!product) {
                throw new ForbiddenException('product does not exist');
            }

            const variant = product.variants.find((v) => (v as any)._id.toString() == p.variantId);
            if (!variant) {
                throw new ForbiddenException('variant does not exist');
            }

            itemTotal += product.sellingPrice * p.quantity;
        }

        const discountedTotal = itemTotal - (itemTotal * dto.discount) / 100;
        const grandTotal = discountedTotal + dto.shipmentCharge;

        const newOrder = new this.orderModel({
            ...dto,
            merchantId: userId,
            itemTotal,
            grandTotal,
        });

        await newOrder.save();

        return newOrder;
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

        return await this.orderModel.findByIdAndUpdate(id, dto, { new: true });
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
