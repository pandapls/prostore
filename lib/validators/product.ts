import { z } from 'zod';
import { formatNumberWithDecimal } from '../utils';
export const currency = z.string().refine(
	(value) => {
		// 1. 检查是否为空
		if (!value) return false;

		// 2. 尝试转换为数字
		const num = Number(value);
		if (isNaN(num)) return false;

		// 3. 检查格式
		const formatted = formatNumberWithDecimal(num);
		return /^\d+\.\d{2}$/.test(formatted);
	},
	{
		message: 'Price must be a valid number with exactly two decimal places',
		path: ['price'], // 指定错误路径
	}
);
// Schema for inseting products
export const insertProductSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	slug: z.string().min(3, 'Slug must be at least 3 characters'),
	category: z.string().min(3, 'Category must be at least 3 characters'),
	brand: z.string().min(3, 'Brand must be at least 3 characters'),
	description: z.string().min(3, 'Description must be at least 3 characters'),
	stock: z.coerce.number(),
	images: z.array(z.string()).min(1, 'Product must have at least one image'),
	isFeatured: z.boolean(),
	banner: z.string().nullable(),
	price: currency,
});

export const updateProductSchema = insertProductSchema.extend({
	id: z.string().min(1, 'Id is required'),
});
