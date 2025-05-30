import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

import { Badge } from "../ui/badge";
import Image from "next/image";
export default function Product({ product }: any) {
  const mainImage = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="h-full border bg-card rounded-lg"
    >
      <div className="relative overflow-hidden">
        <Image
          src={mainImage?.url}
          alt={mainImage?.altText}
          width={700}
          height={700}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2">
          {product.ribbon && <Badge>{product.ribbon}</Badge>}
          <Badge className="bg-secondary font-semibold text-secondary-foreground">
            {getFormattedPrice(product)}
          </Badge>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div
          className="line-clamp-5"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>
    </Link>
  );
}

function getFormattedPrice(product: any): string {
  const minPrice = product.price;
  const maxPrice = product.price;
  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `from ${formatCurrency(minPrice, product.priceData?.currency)}`;
  } else {
    return (
      product.priceData?.formatted?.discountedPrice ||
      product.priceData?.formatted?.price ||
      "n/a"
    );
  }
}
