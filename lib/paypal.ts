const baseUrl =
	process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
	createOrder: createOrder,
	capturePayment: capturePayment,
};

async function createOrder(price: number) {
	const accessToken = await generateAccessToken();
	const url = `${baseUrl}/v2/checkout/orders`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			intent: 'CAPTURE',
			purchase_units: [
				{
					amount: {
						currency_code: 'USD',
						value: price,
					},
				},
			],
		}),
	});

	return await handleResponse(response);
}

async function capturePayment(orderId: string) {
	const accessToken = await generateAccessToken();
	const url = `${baseUrl}/v2/checkout/orders/${orderId}/capture`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return await handleResponse(response);
}

// Generate paypal access token;
export async function generateAccessToken() {
	const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
	const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
		'base64'
	);

	//   curl -v -X POST "https://api-m.sandbox.paypal.com/v1/oauth2/token"\
	//  -u "CLIENT_ID:CLIENT_SECRET"\
	//  -H "Content-Type: application/x-www-form-urlencoded"\
	//  -d "grant_type=client_credentials"

	const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
		method: 'POST', // 对应 -X POST
		headers: {
			// 对应 -H
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${auth}`, // 对应 -u
		},
		body: 'grant_type=client_credentials', // 对应 -d
	});

	const jsonData = await handleResponse(response);
	return jsonData.access_token;
}

async function handleResponse(response: Response) {
	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	const jsonData = await response.json();
	return jsonData;
}
