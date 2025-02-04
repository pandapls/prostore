import { Prisma,PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
/**
 * 全量导入数据脚本
 */
async function main() {
	// 创建 Prisma 客户端实例
	const prisma = new PrismaClient();
	// 清空现有的测试数据
	await prisma.product.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();
	// 批量插入示例数据
	await prisma.product.createMany({
		data: sampleData.products,
	});
	await prisma.user.createMany({
		data: sampleData.users as unknown as Prisma.UserCreateInput,
	});

	console.log('Database seeded successfully');
}
main();
