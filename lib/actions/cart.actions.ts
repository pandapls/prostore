'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
	const itemsPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
		),
		shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
		taxPrice = round2(0.15 * itemsPrice),
		totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};
export async function addItemToCart(data: z.infer<typeof cartItemSchema>) {
	try {
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) {
			throw new Error('Cart session not found');
		}

		const sesstion = await auth();
		const userId = sesstion?.user?.id
			? (sesstion.user.id as string)
			: undefined;
		const cart = await getMyCart();
		const item = cartItemSchema.parse(data);
		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});

		if (!product) throw new Error('Product not found');
		if (!cart) {
			const newCart = insertCartSchema.parse({
				userId: userId,
				items: [item],
				sessionCartId: sessionCartId,
				...calcPrice([item]),
			});

			await prisma.cart.create({
				// data: newCart,
				data: {
					userId: newCart.userId,
					items: newCart.items,
					sessionCartId: newCart.sessionCartId,
					itemsPrice: newCart.itemsPrice,
					totalPrice: newCart.totalPrice,
					shippingPrice: newCart.shippingPrice,
					taxPrice: newCart.taxPrice,
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		}
		const existItem = (cart.items as CartItem[]).find(
			(x) => x.productId === item.productId
		);
		if (!existItem) {
			if (product.stock < 1) {
				throw new Error('Not enough stock');
			}
			cart.items.push(item);
		} else {
			if (product.stock < existItem.qty + 1) {
				throw new Error('Not enough stock');
			}

			(cart.items as CartItem[]).find(
				(x) => x.productId === item.productId
			)!.qty = existItem.qty + 1;
		}

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});
		revalidatePath(`/product/${product.slug}`);
		return {
			success: true,
			message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
		};
	} catch (error) {
		console.log(error, 'error');
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	const sessionCartId = (await cookies()).get('sessionCartId')?.value;
	if (!sessionCartId) {
		throw new Error('Cart session not found');
	}

	const sesstion = await auth();
	const userId = sesstion?.user?.id ? (sesstion.user.id as string) : undefined;

	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});

	if (!cart) return undefined;

	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}

export async function removeItemFromCart(productId: string) {
	try {
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) {
			throw new Error('Cart session not found');
		}
		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) throw new Error('Product not found');
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		const exist = (cart.items as CartItem[]).find(
			(x) => x.productId === productId
		);
		if (!exist) throw new Error('Item not found');

		if (exist.qty === 1) {
			cart.items = (cart.items as CartItem[]).filter(
				(x) => x.productId !== exist.productId
			);
		} else {
			(cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
				exist.qty - 1;
		}

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});
		revalidatePath(`/product/${product.slug}`);
		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
