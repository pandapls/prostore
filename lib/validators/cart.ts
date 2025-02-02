import { z } from 'zod';
import { currency } from './insertProductSchema';

export const cartItemSchema = z.object({
	productId: z.string().min(1, 'Product is required'),
	name: z.string().min(1, 'Name is required'),
	slug: z.string().min(1, 'Slug is required'),
	qty: z.number().int().nonnegative('Quantity must be a positive number'),
	image: z.string().min(1, 'Image is required'),
	price: z
		.string()
		.refine(
			(value) => /^\d+(\.\d{2})?$/.test(Number(value).toFixed(2)),
			'Price must have exactly two decimal places (e.g., 49.99)'
		),
});

export const insertCartSchema = z.object({
	items: z.array(cartItemSchema),
	itemsPrice: currency,
	totalPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	sessionCartId: z.string().min(1, 'Session is required'),
	userId: z.string().optional().nullable(),
});
