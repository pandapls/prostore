import ProductCarousel from '@/components/shared/product/productCarousel';
import ProductList from '@/components/shared/product/ProductList';
import { ViewAllProductsButton } from '@/components/shared/product/ViewAllProductsButton';
import {
  getFeatureProducts,
  getLatesProducts,
} from '@/lib/actions/product.actions';
import { Product } from '@/types';

export const metadata = {
  title: 'home',
};

export default async function Home() {
  const latestProducts = await getLatesProducts();
  const featuredProducts = await getFeatureProducts();
  return (
    <div>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList
        data={latestProducts as unknown as Product[]}
        title='Newest Arrivals'
        limit={4}
      />
      <ViewAllProductsButton />
    </div>
  );
}
