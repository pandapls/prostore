import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";

export const metadata: Metadata = {
    title: 'Admin Dashboard'
}
const OverviewPage = async () => {
    const session = await auth();

    // Make sure the user is an admin
    if (session?.user.role !== 'admin')
        throw new Error('admin permission required');

    // Get order summary
    const summary = await getOrderSummary();
    return (<div className='space-y-2'>
        <h1 className='h2-bold'>Dashboard</h1>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                    <BadgeDollarSign />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {formatCurrency((summary.totalSales._sum.totalPrice || 0)!.toString())}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                    <CreditCard />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {formatNumber(summary.ordersCount)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Customers</CardTitle>
                    <Users />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{summary.usersCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Products</CardTitle>
                    <Barcode />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{summary.productsCount}</div>
                </CardContent>
            </Card>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                    {/* CHART */}
                    <Charts data={{ salesData: summary.salesData }} />
                </CardContent>
            </Card>
            <Card className='col-span-3'>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>BUYER</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>TOTAL</TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.latestOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        {order.user?.name ? order.user.name : 'Deleted user'}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTime(order.createdAt).dateOnly}
                                    </TableCell>
                                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                    <TableCell>
                                        <Link href={`/order/${order.id}`}>
                                            <span className='px-2'>Details</span>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>);
}

export default OverviewPage;