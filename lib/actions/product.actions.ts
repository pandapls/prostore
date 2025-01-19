'use server';

import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { convertToPlainObject } from '../utils';

// 获取产品列表
export async function getLatesProducts() {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		// 降序
		orderBy: { createdAt: 'desc' },
	});

	return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
	return await prisma.product.findFirst({
		where: { slug: slug },
	});
}
