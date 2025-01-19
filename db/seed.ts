import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
/**
 * 全量导入数据脚本
 */
async function main() {
	// 创建 Prisma 客户端实例
	const prisma = new PrismaClient();
	// 清空现有产品数据
	await prisma.product.deleteMany();

	// 批量插入示例数据
	await prisma.product.createMany({
		data: sampleData.products,
	});

	console.log('Database seeded successfully');
}
main();
