import { OrderItem } from './order_item';
import { User } from '@codereaper/users';

export class Order{
    id?: string;
    orderItems?: OrderItem[];
    deliveryAddress1?: string;
    deliveryAddress2?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    totalPrice?: number;
    totalMrp?: number;
    totalSavings?: number;
    totalDiscount?: number;
    user?: any;
    dateOrdered?: string;
    shopPickup?: boolean;
    status?: string;
}