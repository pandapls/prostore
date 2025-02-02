import { z } from 'zod';

export const shippingAddressSchema = z.object({
	fullName: z.string().min(3, 'Name must be at least 3 characters'),
	streetAddress: z.string().min(3, 'Street must be at least 3 characters'),
	city: z.string().min(3, 'City must be at least 3 characters'),
	postalCode: z.string().min(3, 'Postal must be at least 3 characters'),
	country: z.string().min(3, 'Country must be at least 3 characters'),
	lat: z.number().optional(),
	lng: z.number().optional(),
});
