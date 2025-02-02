import { z } from 'zod';

export const signInFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpFormSchema = z
	.object({
		name: z.string().min(3, 'Name must be at least 3 characters'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm Password must be at least 6 characters'),
	})
	.refine(
		(data) => {
			return data.password === data.confirmPassword;
		},
		{
			message: "Passwords don't match",
			path: ['confirmPassword'],
		}
	);
