'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/actions/order.actions';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className='w-full'>
            {pending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Check className='w-4 h-4' />
            )}{' '}  Place Order
        </Button>
    );
};
const PlaceOrderForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const res = await createOrder();
        console.log(res, 'res')
        if (res.redirectTo) {
            router.push(res.redirectTo);
        }

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            });
            return;
        }
    };
    return (
        <form onSubmit={handleSubmit} className='w-full'>
            <PlaceOrderButton />
        </form>
    );
};

export default PlaceOrderForm;
