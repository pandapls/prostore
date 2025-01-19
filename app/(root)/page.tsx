import ProductList from "@/components/shared/product/ProductList";
import { getLatesProducts } from "@/lib/actions/product.actions";
import { Product } from "@/types";

export const metadata = {
  title: 'home',
}

export default async function Home() {
  const latestProducts = await getLatesProducts();
  return (
    <div>
      <ProductList data={latestProducts as unknown as Product[]} title='Newest Arrivals' />
    </div>
  );
}
