import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PAYMENT_METHODS } from '../constants';
import { currency } from './insertProductSchema';
import { shippingAddressSchema } from './shipping';

export const inserOrderSchema = z.object({
	userId: z.string().min(1, 'User is required'),
	itemsPrice: currency,
	shippingPrice: currency,
	taxPrice: currency,
	totalPrice: currency,
	paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
		message: 'Invalid payment method',
	}),
	shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
	productId: z.string(),
	slug: z.string(),
	image: z.string(),
	name: z.string(),
	price: currency,
	qty: z.number(),
});

export const toOrderCreateInput = (
	data: z.infer<typeof inserOrderSchema>
): Prisma.OrderCreateInput => ({
	itemsPrice: data.itemsPrice,
	shippingPrice: data.shippingPrice,
	taxPrice: data.taxPrice,
	totalPrice: data.totalPrice,
	paymentMethod: data.paymentMethod,
	shippingAddress: data.shippingAddress,
	user: {
		connect: {
			id: data.userId,
		},
	},
});
