'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItem,PaymentResult } from '@/types';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { PAGE_SIZE } from '../constants';
import { paypal } from '../paypal';
import { convertToPlainObject,formatError } from '../utils';
import { inserOrderSchema,toOrderCreateInput } from '../validators';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';

export async function createOrder() {
	try {
		const session = await auth();
		if (!session) throw Error('User is not authenticated');
		const cart = await getMyCart();
		const userId = session?.user?.id;
		if (!userId) throw new Error('User not found');

		const user = await getUserById(userId);
		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: 'Your cart is empty',
				redirectTo: '/cart',
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: 'No shipping address',
				redirectTo: '/shipping-address',
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: 'No payment method',
				redirectTo: '/payment-method',
			};
		}

		const orderData = inserOrderSchema.parse({
			userId: user.id as string,
			shippingAddress: user.address as any,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		const insertedOrderId = await prisma.$transaction(async (tx) => {
			const insertedOrder = await tx.order.create({
				data: toOrderCreateInput(orderData),
			});

			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						price: item.price,
						name: item.name,
						slug: item.slug,
						image: item.image,
						productId: item.productId,
						qty: item.qty,
						orderId: insertedOrder.id,
					},
				});
			}

			// Clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					totalPrice: 0,
					taxPrice: 0,
					shippingPrice: 0,
					itemsPrice: 0,
				},
			});

			return insertedOrder.id;
		});

		if (!insertedOrderId) throw new Error('Order not created');

		return {
			success: true,
			message: 'Order successfully created',
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;

		return { success: false, message: formatError(error) };
	}
}

export async function getOrderById(orderId: string) {
	const data = await prisma.order.findFirst({
		where: {
			id: orderId,
		},
		include: {
			orderItems: true,
			user: { select: { name: true, email: true } },
		},
	});
	return convertToPlainObject(data);
}

export async function createPayPalOrder(orderId: string) {
	try {
		// Get order from database
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});
		if (order) {
			// Create a paypal order
			const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

			// Update the order with the paypal order id
			await prisma.order.update({
				where: {
					id: orderId,
				},
				data: {
					paymentResult: {
						id: paypalOrder.id,
						email_address: '',
						status: '',
						pricePaid: '0',
					},
				},
			});

			// Return the paypal order id
			return {
				success: true,
				message: 'PayPal order created successfully',
				data: paypalOrder.id,
			};
		} else {
			throw new Error('Order not found');
		}
	} catch (err) {
		return { success: false, message: formatError(err) };
	}
}
export async function approvePayPalOrder(
	orderId: string,
	data: { orderId: string }
) {
	try {
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});
		if (!order) throw new Error('Order not found');

		const captureData = await paypal.capturePayment(data.orderId);

		if (
			!captureData ||
			captureData.id !== (order.paymentResult as PaymentResult)?.id ||
			captureData.status !== 'COMPLETED'
		) {
			throw Error('Error in papay payment');
		}
		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: captureData.id,
				status: captureData.status,
				email_address: captureData.payer.email_address,
				pricePaid:
					captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
			},
		});
		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Your order has been successfully paid by PayPal',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

export async function updateOrderToPaid({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult?: PaymentResult;
}) {
	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
		},
		include: {
			orderItems: true,
		},
	});

	if (!order) throw new Error('Order not found');

	if (order.isPaid) throw new Error('Order is already paid');

	await prisma.$transaction(async (tx) => {
		// Update all item quantities in the database
		for (const item of order.orderItems) {
			await tx.product.update({
				where: { id: item.productId },
				data: { stock: { increment: -item.qty } },
			});
		}

		// Set the order to paid
		await tx.order.update({
			where: { id: orderId },
			data: {
				isPaid: true,
				paidAt: new Date(),
				paymentResult,
			},
		});
	});

	const updatedOrder = await prisma.order.findFirst({
		where: {
			id: orderId,
		},
		include: {
			orderItems: true,
			user: { select: { name: true, email: true } },
		},
	});

	if (!updatedOrder) {
		throw new Error('Order not found');
	}
}

export async function getMyOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const session = await auth();
	if (!session) throw new Error('User is not authenticated');

	const data = await prisma.order.findMany({
		where: { userId: session.user.id! },
		orderBy: { createdAt: 'desc' },
		take: limit,
		skip: (page - 1) * limit,
	});

	const dataCount = await prisma.order.count({
		where: { userId: session.user.id! },
	});

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}

export type SalesDataType = {
	month: string; // 月份，格式为 "MM/YY"
	totalSales: number; // 该月的总销售额
};

export async function getOrderSummary() {
	// Get counts for each resource
	const ordersCount = await prisma.order.count();
	const productsCount = await prisma.product.count();
	const usersCount = await prisma.user.count();

	// Calculate the total sales
	const totalSales = await prisma.order.aggregate({
		_sum: { totalPrice: true },
	});

	// Get monthly sales

	const salesDataRaw = await prisma.$queryRaw<
		Array<{ month: string; totalSales: Prisma.Decimal }>
	>`
    SELECT 
        to_char("createdAt", 'MM/YY') as "month", 
        sum("totalPrice") as "totalSales" 
    FROM 
        "Order" 
    GROUP BY 
        to_char("createdAt", 'MM/YY')
	`;
	console.log(salesDataRaw, 'salesDataRaw');
	const salesData: SalesDataType[] = salesDataRaw.map((entry) => ({
		month: entry.month,
		totalSales: Number(entry.totalSales), // Convert Decimal to number
	}));

	// Get latest sales
	const latestOrders = await prisma.order.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			user: { select: { name: true } },
		},
		take: 6,
	});

	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales,
		latestOrders,
		salesData,
	};
}

export async function getAllOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const data = await prisma.order.findMany({
		orderBy: { createdAt: 'desc' },
		take: limit,
		skip: (page - 1) * limit,
		include: { user: { select: { name: true } } },
	});
	const dataCount = await prisma.order.count();

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}
