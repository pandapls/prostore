import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ModeToggle from './mode-toggle'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import UserButton from './userButton';

const Menu = () => {
    return (
        <>
            <div className='flex justify-end gap-3'>
                <nav className='md:flex hidden w-full max-w-xs gap-1'>
                    <ModeToggle />
                    <Button asChild variant='ghost'>
                        <Link href='/cart'>
                            <ShoppingCart />
                            Cart
                        </Link>
                    </Button>
                    <UserButton />
                </nav>
                <nav className='md:hidden'>
                    <Sheet>
                        <SheetTrigger className='align-middle'>
                            <EllipsisVertical />
                        </SheetTrigger>
                        <SheetContent className='flex flex-col items-start'>
                            <SheetTitle>
                                Menu <ModeToggle />
                            </SheetTitle>
                            <Button asChild variant='ghost'>
                                <Link href='/cart'>
                                    <ShoppingCart />
                                    Cart
                                </Link>
                            </Button>
                            <UserButton />
                            <SheetDescription></SheetDescription>
                        </SheetContent>
                    </Sheet>
                </nav>
            </div>
        </>
    )
}

export default Menu
