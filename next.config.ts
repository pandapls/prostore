import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: ['utfs.io'], // 允许 utfs.io 域名的图片
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				port: '',
			},
		],
		unoptimized: true, // 禁用图片优化
	},
};

export default nextConfig;
