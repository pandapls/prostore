'use client';
import { cn } from '@/lib/utils';
const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
    const stringValue = value.toFixed(2);
    const [intValue, floatValue] = stringValue.split('.');
    return (
        <span className={cn('text-2xl', className)}>
            <span className="text-xs align-super">
                $
            </span>
            <span>{intValue}</span>
            <span className="text-xs align-super">
                .{floatValue}
            </span>
        </span>
    )
}

export default ProductPrice;