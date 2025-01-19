import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

// 格式化数字的小数位数
export function formatNumberWithDecimal(num: number): string {
	const [int, decimal] = num.toString().split('.');
	return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}
