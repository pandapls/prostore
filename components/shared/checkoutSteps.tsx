import { cn } from "@/lib/utils";
import React from "react";
const STEPS = [
    { title: 'User Login', id: 1 },
    { title: 'Shipping Address', id: 2 },
    {
        title: 'Payment Method', id: 3
    },
    { title: 'Place Order', id: 4 },

];
const CheckoutSteps = ({ current = 0 }) => {
    return (<div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
        {STEPS.map(({ title, id }, index) => (
            <React.Fragment key={id}>
                <div className={cn('p-2 w-56 rounded-full text-center text-sm', index === current ? 'bg-secondary' : '')}>
                    {title}
                </div>
                {id !== 4 && (
                    <hr className="w-16 border-t border-gray-300 mx-2" />
                )}
            </React.Fragment>
        ))}
    </div>);
}

export default CheckoutSteps;