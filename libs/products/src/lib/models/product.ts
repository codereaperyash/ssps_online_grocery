import { Category } from "./category";

export class Product {
    id?: string;
    name?: string;
    icon?: string;
    description?: string;
    image?: string;
    brand?: string;
    price!: number;
    mrp!: number;
    category?: Category;
    availability?: boolean;
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    dateCreated?: string;
}