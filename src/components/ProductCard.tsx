import Link from "next/link";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage =
    product.images[0]?.optimizeUrl || "/placeholder-product.jpg";

  return (
    <Link href={`/products/${product._id}`} passHref>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-primary">${product.price}</span>
            <span className="text-sm text-gray-500">
              {product.category.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
