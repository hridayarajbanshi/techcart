"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import { Product } from "@/sanity.types";

// Product type configuration
const productTypes = [
  { id: 'all', label: 'All Products', icon: '📱', variant: '' },
  { id: 'laptops', label: 'Laptops', icon: '💻', variant: 'laptops' },
  { id: 'headphones', label: 'Headphones', icon: '🎧', variant: 'headphones' },
  { id: 'camera', label: 'Camera', icon: '📷', variant: 'camera' },
  { id: 'smartwatches', label: 'Smartwatches', icon: '⌚', variant: 'smartwatches' },
  { id: 'smartphones', label: 'Smartphones', icon: '📱', variant: 'smartphones' },
  { id: 'airbuds', label: 'Airbuds', icon: '🎵', variant: 'airbuds' },
];

// Main ProductGrid component
const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [visibleProducts, setVisibleProducts] = useState<number>(12);

  // Build query based on selected type
  const buildQuery = () => {
    if (selectedType === 'all') {
      return `*[_type == "product"] | order(_createdAt desc) {
        _id,
        title,
        name,
        slug,
        price,
        discount,
        category->{
          title,
          slug
        },
        variant,
        tags,
        stock,
        description,
        rating,
         "images": image[]{
    _key,
    "url": asset->url,
    "alt": alt,
    "metadata": asset->metadata
  },
  "imageUrl": image[0].asset->url,
  "imageAlt": alt,
        isNew,
        featured,
        _createdAt
      }`;
    } else {
      return `*[_type == "product" && variant == "${selectedType}"] | order(_createdAt desc) {
        _id,
        title,
        name,
        slug,
        price,
        discount,
        category->{
          title,
          slug
        },
        variant,
        tags,
        stock,
        description,
        rating,
         "images": image[]{_key,
    "url": asset->url,
    "alt": alt,
    "metadata": asset->metadata
  },
  "imageUrl": image[0].asset->url,
  "imageAlt": alt,
        isNew,
        featured,
        _createdAt
      }`;
    }
  };

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = buildQuery();
        const data = await client.fetch(query);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedType]);


  const handleCategoryChange = (typeId: string) => {
    setSelectedType(typeId);
    setVisibleProducts(12);
  };

 
 
  // Filter visible products
  const visibleProductsList = products.slice(0, visibleProducts);

  return (
    <div className="my-10 ">
      {/* Tab Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center md:gap-4 p-2 sm:flex-row">
          {productTypes.map((type) => (
            <div key={type.id} className="relative">
              <input
                type="radio"
                id={`type-${type.id}`}
                name="productType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor={`type-${type.id}`}
                className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-lg cursor-pointer transition-all duration-300 select-none border-2 ${
                  selectedType === type.id
                    ? 'bg-white text-green-600 shadow-lg border-green-200 font-semibold'
                    : 'bg-slate-700 text-white border-slate-300 hover:bg-white hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm md:text-base whitespace-nowrap">{type.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center">
       
            <Loader2 className="w-6 h-6" />
            <span className="text-lg">Loading products...</span>
        </div>
      )}

      {/* Products Grid */}
      {!loading && visibleProductsList.length > 0 && (
        <>
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-bold text-green-600">{visibleProductsList.length}</span> of{' '}
              <span className="font-bold text-gray-900">{products.length}</span> products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence>
              {visibleProductsList.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex justify-center"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* No Products Found */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}

    </div>
  );
};

export default ProductGrid;