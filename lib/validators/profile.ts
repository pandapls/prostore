import { z } from 'zod';

export const updateProfileSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.string().min(3, 'Email must be at least 3 characters'),
});
