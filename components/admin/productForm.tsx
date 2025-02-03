'use client';

import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { productDefaultValues } from '@/lib/constants';
import { UploadButton } from '@/lib/uploadthing';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { PRODUCT_FORM_TYPE, Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ProductFormProps {
    type: PRODUCT_FORM_TYPE;
    product?: Product;
    productId?: string;
}
type ProductFormData = z.infer<typeof insertProductSchema>;
type FieldProps<T extends keyof ProductFormData> = {
    field: ControllerRenderProps<ProductFormData, T>;
};

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver:
            type === PRODUCT_FORM_TYPE.update
                ? zodResolver(updateProductSchema)
                : zodResolver(insertProductSchema),
        defaultValues:
            product && type === PRODUCT_FORM_TYPE.update
                ? product
                : productDefaultValues,
    });
    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
        values
    ) => {
        if (type === PRODUCT_FORM_TYPE.create) {
            const res = await createProduct(values);

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
                return;
            }

            toast({
                description: res.message,
            });
            router.push('/admin/products');
        }

        if (type === PRODUCT_FORM_TYPE.update) {
            const res = await updateProduct({ ...values, id: productId });

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
                return;
            }

            toast({
                description: res.message,
            });
            router.push('/admin/products');
        }
    };

    const images = form.watch('images');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');
    return (
        <Form {...form}>
            <form
                method='POST'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
            >
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }: FieldProps<'name'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Emter product name' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/* Slug */}
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({ field }: FieldProps<'slug'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input placeholder='Enter product slug' {...field} />
                                        <Button
                                            type='button'
                                            className='bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                                            onClick={() => {
                                                form.setValue(
                                                    'slug',
                                                    slugify(form.getValues('name'), { lower: true })
                                                );
                                            }}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Category */}
                    <FormField
                        control={form.control}
                        name='category'
                        render={({ field }: FieldProps<'category'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter category' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Brand */}
                    <FormField
                        control={form.control}
                        name='brand'
                        render={({ field }: FieldProps<'brand'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product brand' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Price */}
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }: FieldProps<'price'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Stock  */}
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({ field }: FieldProps<'stock'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder='Enter product stock'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field flex flex-col gap-5 md:flex-row'>
                    {/* Images */}
                    <FormField
                        control={form.control}
                        name='images'
                        render={() => (
                            <FormItem className='w-full'>
                                <FormLabel>Iamges</FormLabel>
                                <Card>
                                    <CardContent className='space-y-2 mt-2 min-h-48'>
                                        <div className='flex-start space-x-2'>
                                            {images.map((image: string, index) => (
                                                <div key={image} className='relative group'>
                                                    <Image
                                                        src={image}
                                                        alt='product image'
                                                        className='w-20 h-20 object-cover object-center rounded-sm'
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <Button
                                                        type='button'
                                                        variant="destructive"
                                                        onClick={() => {
                                                            const newImages = [...images];
                                                            newImages.splice(index, 1);
                                                            form.setValue('images', newImages);
                                                        }}
                                                        className='absolute -top-2 -right-2 p-0 rounded-full w-[20px] h-[20px] flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity'
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormControl>
                                            <UploadButton
                                                endpoint='imageUploader'
                                                onClientUploadComplete={(res: { url: string }[]) => {
                                                    form.setValue('images', [...images, res[0].url]);
                                                }}
                                                onUploadError={(error: Error) => {
                                                    toast({
                                                        variant: 'destructive',
                                                        description: `ERROR! ${error.message}`,
                                                    });
                                                }}
                                            ></UploadButton>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field'>
                    Featured Product
                    <Card>
                        <CardContent className='space-y-2 mt-2'>
                            <FormField
                                control={form.control}
                                name='isFeatured'
                                render={({ field }) => (
                                    <FormItem className='space-x-2 items-center'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Featured?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            {isFeatured && banner && (
                                <Image
                                    src={banner}
                                    alt='banner image'
                                    className=' w-full object-cover object-center rounded-sm'
                                    width={1920}
                                    height={680}
                                />
                            )}
                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('banner', res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                            variant: 'destructive',
                                            description: `ERROR! ${error.message}`,
                                        });
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }: FieldProps<'description'>) => (
                            <FormItem className='w-full'>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Enter product description'
                                        className='resize-none'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    {/* Submit */}
                    <Button
                        type='submit'
                        size='lg'
                        disabled={form.formState.isSubmitting}
                        className='button col-span-2 w-full'
                    >
                        {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
