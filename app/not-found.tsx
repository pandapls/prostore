'use client';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
const NotNoundPage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <Image
                priority={true}
                src='/images/logo.svg'
                width={48}
                height={48}
                alt={`${APP_NAME} logo`}
            />
            <div className='p-5 w-1/3 rounded-lg shadow-md text-center'>
                <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
                <p className='text-destructive'>Could not find requested Page</p>
                <Button
                    variant='outline'
                    className='mt-4 ml-2'
                    onClick={() => (window.location.href = '/')}
                >
                    Back To Home
                </Button>
            </div>
        </div>
    );
};

export default NotNoundPage;
