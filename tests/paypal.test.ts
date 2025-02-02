import { generateAccessToken, paypal } from '@/lib/paypal';

test('generates token from paypal', async () => {
	const tokenResponse = await generateAccessToken();
	console.log(tokenResponse);
	expect(typeof tokenResponse).toBe('string');
	expect(tokenResponse.length).toBeGreaterThan(0);
});

test('creates a paypal order', async () => {
	// const token = await generateAccessToken();
	const price = 10.0;
	const createOrderRes = await paypal.createOrder(price);
	console.log(createOrderRes, 'createOrderRes');

	expect(createOrderRes).toHaveProperty('id');
	expect(createOrderRes).toHaveProperty('status');
	expect(createOrderRes.status).toBe('CREATED');
});

test('simulates capturing a PayPal order', async () => {
	const orderId = '100'; // Mock order ID

	// 1. 创建模拟函数
	const mockCapturePayment = jest
		.spyOn(paypal, 'capturePayment') // 监视 paypal.capturePayment 方法
		.mockResolvedValue({
			// 设置模拟返回值
			status: 'COMPLETED',
		});

	// 使用模拟的函数
	const captureResponse = await paypal.capturePayment(orderId);
	expect(captureResponse).toHaveProperty('status', 'COMPLETED');

	// 清理模拟，恢复原始函数
	mockCapturePayment.mockRestore();
});
