'use server';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils';
import { updateOrderToPaid } from './order.actions';

export async function deleteOrder(id: string) {
	try {
		await prisma.order.delete({ where: { id } });

		revalidatePath('/admin/orders');

		return {
			success: true,
			message: 'Order deleted successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) as unknown as string };
	}
}

export async function updateOrderToPaidByCOD(orderId: string) {
	try {
		await updateOrderToPaid({ orderId });
		revalidatePath(`/order/${orderId}`);
		return { success: true, message: 'Order paid successfully' };
	} catch (err) {
		return { success: false, message: formatError(err) };
	}
}

export async function deliverOrder(orderId: string) {
	try {
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) throw new Error('Order not found');
		if (!order.isPaid) throw new Error('Order is not paid');

		await prisma.order.update({
			where: { id: orderId },
			data: {
				isDelivered: true,
				deliveredAt: new Date(),
			},
		});

		revalidatePath(`/order/${orderId}`);

		return { success: true, message: 'Order delivered successfully' };
	} catch (err) {
		return { success: false, message: formatError(err) };
	}
}
