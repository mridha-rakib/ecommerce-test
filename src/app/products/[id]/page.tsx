import ProductDetail from "@/components/products/ProductDetail";
import { fetchProduct } from "@/lib/api/products";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.images[0]?.secure_url || "/placeholder-product.jpg",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return notFound();
  }

  return <ProductDetail product={product} />;
}
