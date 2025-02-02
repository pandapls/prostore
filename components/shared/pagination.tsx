'use client';

import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
type PaginationProps = {
    page: number | string;
    totalPages: number;
    urlParamName?: string;
};
const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = (direction: 'prev' | 'next') => {
        const pageValue = direction === 'next' ? Number(page) + 1 : Number(page) - 1;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: urlParamName || 'page',
            value: pageValue.toString(),
        });

        router.push(newUrl, { scroll: false });
    };
    return (
        <div className='flex gap-2'>
            <Button
                size='lg'
                variant='outline'
                className='w-28'
                disabled={Number(page) <= 1}
                onClick={() => handleClick('prev')}
            >
                Previous
            </Button>
            <Button
                size='lg'
                variant='outline'
                className='w-28'
                disabled={Number(page) >= totalPages}
                onClick={() => handleClick('next')}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
