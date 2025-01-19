import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// 设置 Neon 使用 WebSocket 通信
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// 创建连接池：
const pool = new Pool({ connectionString });

// 设置 Prisma 适配器：
const adapter = new PrismaNeon(pool);

// 扩展 PrismaClient
export const prisma = new PrismaClient({ adapter }).$extends({
	result: {
		product: {
			price: {
				compute(product) {
					return product.price.toString();
				},
			},
			rating: {
				compute(product) {
					return product.rating.toString();
				},
			},
		},
	},
});
