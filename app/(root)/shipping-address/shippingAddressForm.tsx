'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingAddressDefaultValues } from '@/lib/constants';
import {
    FieldProps,
    shippingAddressFormData,
    shippingAddressSchema,
} from '@/lib/validators';
import { ShippingAddress } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    });
    const [isPending, startTransition] = useTransition();
    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
        values
    ) => {
        console.log(values);
        startTransition(async () => {
            const res = await updateUserAddress(values);
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
                return;
            }
            router.push('/payment-method');
        });
    };
    return (
        <>
            <div className='max-w-md mx-auto space-y-4'>
                <h1 className='h2-bold mt-4'>Shipping Address</h1>
                <p className='text-sm text-muted-foreground'>
                    Please enter and address to ship to
                </p>
                <Form {...form}>
                    <form
                        method='post'
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({
                                    field,
                                }: FieldProps<shippingAddressFormData, 'fullName'>) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>FullName</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter full name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='streetAddress'
                                render={({
                                    field,
                                }: FieldProps<shippingAddressFormData, 'streetAddress'>) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter Address' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({
                                    field,
                                }: FieldProps<shippingAddressFormData, 'city'>) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter City' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='country'
                                render={({
                                    field,
                                }: FieldProps<shippingAddressFormData, 'country'>) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter country' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({
                                    field,
                                }: FieldProps<shippingAddressFormData, 'postalCode'>) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter Postal Code' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='felx gap-2'>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? (
                                    <Loader className='animate-spin w-4 h-4' />
                                ) : (
                                    <ArrowRight className='w-4 h-4' />
                                )}
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default ShippingAddressForm;
