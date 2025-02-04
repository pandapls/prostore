import { z } from 'zod';

export const updateProfileSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.string().min(3, 'Email must be at least 3 characters'),
});


export const updateUserSchema = updateProfileSchema.extend({
	id: z.string().min(1, 'Id is required'),
	name: z.string().min(3, 'Name must be at least 3 characters'),
	role: z.string().min(1, 'Role is required'),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;