// components/products/ProductDetail.tsx
"use client";

import Image from "next/image";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]?.optimizeUrl || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-square relative rounded overflow-hidden"
              >
                <Image
                  src={image.optimizeUrl}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-primary mr-4">
              ${product.price}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {product.category.name}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>

          {product.video && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Product Video</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={product.video.secure_url}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
