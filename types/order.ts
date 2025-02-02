import { inserOrderSchema, insertOrderItemSchema } from '@/lib/validators';
import { z } from 'zod';

export type Order = z.infer<typeof inserOrderSchema> & {
	id: string;
	createdAt: Date;
	isPaid: boolean;
	paidAt: Date | null;
	isDelivered: boolean;
	deliveredAt: Date | null;
	orderItems: OrderItem[];
	user: { name: string; email: string };
};
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
