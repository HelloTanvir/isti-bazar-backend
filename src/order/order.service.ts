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

        for (let i = 0; i < dto.products.length; i++) {
            const p = dto.products[i];

            const product = await this.productService.findOne(userId, p.productId);
            if (!product) {
                throw new ForbiddenException('product does not exist');
            }

            const variant = product.variants.find((v) => (v as any)._id.toString() == p.variantId);
            if (!variant) {
                throw new ForbiddenException('variant does not exist');
            }

            // add product name in DTO and then save on order DB
            (dto as any).products[i].productName = product.name;

            // add this variant as selected variant in DTO and then save on order DB
            (dto as any).products[i].selectedVariant = variant;

            // add other variants in DTO and then save on order DB
            (dto as any).products[i].otherVariants = product.variants.filter(
                (v) => (v as any)._id.toString() != p.variantId
            );

            itemTotal += product.sellingPrice * p.quantity;
        }

        const discountedTotal = itemTotal - (itemTotal * (+dto.discount ?? 0)) / 100;
        const grandTotal =
            discountedTotal + (+dto.shipmentCharge ?? 0) - (+dto.advancedPayment ?? 0);

        const newOrder = new this.orderModel({
            ...dto,
            merchantId: userId,
            itemTotal,
            grandTotal,
        });

        await newOrder.save();

        return newOrder;
    }

    async findAll(userId: string): Promise<Order[]> {
        return await this.orderModel.find({ merchantId: userId });
    }

    async findOne(userId: string, orderId: string): Promise<Order> {
        return await this.orderModel.findOne({ merchantId: userId, _id: orderId });
    }

    async update(userId: string, orderId: string, dto: OrderUpdateDto): Promise<Order> {
        const order = await this.orderModel.findOne({ merchantId: userId, _id: orderId });
        if (!order) {
            throw new ForbiddenException('order does not exist');
        }

        order.status = dto.status;

        await order.save();

        return order;
    }

    async delete(userId: string, orderId: string): Promise<Order> {
        const order = await this.orderModel.findOne({ merchantId: userId, _id: orderId });
        if (!order) {
            throw new ForbiddenException('order does not exist');
        }

        await order.remove();

        return order;
    }
}
