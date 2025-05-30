import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api/products";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
