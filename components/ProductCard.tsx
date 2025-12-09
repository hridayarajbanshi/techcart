'use client';
import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { Product } from "@/sanity.types";

import Image from 'next/image';
import { FormatPrice } from './PriceFormat';
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
const firstImage = product?.image && product.image.length > 0 ? product.image[0] : null;
const imgUrl = firstImage?.url || product.imageUrl || '/placeholder.png';
  const productName = product.title || product.name || "Product Name";
  const productPrice = product.discountPrice || product.price || 0;
  const originalPrice = product.price && product.discountPrice && product.price > product.discountPrice 
    ? product.price 
    : null;
 const discountAmount = product.discount || 0; // This is the discount amount (e.g., 150)
  
  // Calculate discounted price
  const calculateDiscountPrice = () => {
    if (originalPrice && discountAmount > 0) {
      // If discount is a percentage (e.g., 15 for 15%)
      if (discountAmount <= 100) {
        return originalPrice * (1 - discountAmount / 100);
      }
      // If discount is a fixed amount (e.g., 150)
      return Math.max(0, originalPrice - discountAmount);
    }
    return originalPrice;
  };
  const productRating = product.rating || 0;
  const productStock = product.stock || 0;
  const isInStock = productStock > 0;
  const isNewProduct = product.isNew || false;
  const productTags = product.tags || [];
const productCategory = product.variant || 'Uncategorized';
const addingCart = () => {
  console.log(`Adding ${productName} to cart.`);  
}
  return (
    <div 
      className="relative bg-white shadow-lg hover:shadow-2xl w-full rounded-xl transition-all duration-500 border border-gray-100 overflow-hidden m-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        {/* Top left tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNewProduct && (
            <span className="bg-green-700 text-white text-xs px-3 py-1 rounded-full">
              New
            </span>
          )}
          {productTags.slice(0, 2).map((tag: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | Iterable<React.ReactNode> | null | undefined, index: React.Key | null | undefined) => (
            <span 
              key={index} 
              className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Favorite button */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.slug?.current || '#'}`}>
        <Image className="w-full h-full object-cover object-center transition-transform duration-500 transform hover:scale-105"
          src={imgUrl}
          alt={productName}
          width={260}
          height={192}
          draggable={false}
        />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(productRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
            />
          ))}
          <span className="text-xs text-slate-500 ml-1">
            ({productRating.toFixed(1)})
          </span>
        </div>

        {/* Category */}
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
          {productCategory}
        </span>

        {/* Stock Status */}
        <div className="flex items-center gap-1 mt-1">
          <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className='text-sm text-gray-600'>
            {isInStock ? `In Stock (${productStock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2 hover:text-blue-600 transition-colors duration-300 line-clamp-1">
          {productName}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-slate-900">
            {FormatPrice(productPrice, 'NPR', 'full', true, 2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${originalPrice.toLocaleString()}
    
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
        onClick={addingCart}
          disabled={!isInStock}
          className={`flex items-center justify-center gap-2 py-2.5 w-full rounded-lg transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden ${
            isInStock 
              ? 'bg-slate-800 text-white hover:bg-slate-900' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="font-semibold">
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </span>
        </button>
      </div>
    </div>
  );
}