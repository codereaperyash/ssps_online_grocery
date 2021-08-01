export class Cart{
    items!: CartItem[];
}

export class CartItem{
    product?: string;
    quantity!: number;
}

export class CartItemDetailed{
    product!: any;
    quantity!: number;
}