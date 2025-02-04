import { insertProductSchema } from '@/lib/validators';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
	id: string;
	createdAt: Date;
	rating: string;
	numReviews: number;
};


export enum PRODUCT_FORM_TYPE {
    create = 'Create',
    update = 'Update'
}
