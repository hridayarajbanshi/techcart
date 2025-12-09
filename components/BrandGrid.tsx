"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
 // Optional: Add loading skeletons

// Define brand type based on your Sanity schema
interface Brand {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  logo?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  description?: string;
  productsCount?: number;
  isFeatured?: boolean;
  category?: string;
}

const BrandGrid = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from Sanity
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const query = `*[_type == "brand"] | order(name asc) {
          _id,
          name,
          slug,
          logo,
          description,
          "productsCount": count(*[_type == "product" && references(^._id)]),
          isFeatured,
          category
        }`;
        
        const data = await client.fetch(query);
        setBrands(data);
      } catch (err) {
        setError('Failed to load brands');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Predefined colors for brand cards (fallback if brands don't have logos)

  // Get color based on brand index

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-100 rounded-lg mb-6">
        <div className="grid lg:grid-cols-2 mb-12">
          <div><h2 className="text-2xl font-semibold text-gray-900 sm:text-2xl">Shop By Brands</h2></div>
          <div className='text-right'>
           
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index}
              className="animate-pulse bg-white rounded-2xl h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-100 rounded-lg mb-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-100 rounded-lg mb-6">
        <div className="text-center py-8">
          <p className="text-gray-600">No brands found</p>
        </div>
      </div>
    );
  }

  return ( 
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-100 rounded-lg mb-6">
      {/* Header */}
      <div className="grid lg:grid-cols-2 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-2xl">
            Shop By Brands
          </h2>
          <p className="text-gray-600 mt-2">Browse products from your favorite brands</p>
        </div>
        <div className='text-right self-center'>
          <Link href={"/brands"} className="inline-block">
            <span className='underline font-semibold hover:text-green-600 cursor-pointer transition-colors'>
              View all brands ({brands.length})
            </span>
          </Link>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {brands.map((brand, index) => {
          
          const brandLogoUrl = brand.logo 
            ? urlFor(brand.logo).width(120).height(120).url()
            : null;

          return (
            <div
              key={brand._id}
              className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 border border-gray-100 overflow-hidden bg-white"
            >
              <Link 
                href={{
                  pathname: '/products',
                  query: { brand: brand.slug.current }
                }} 
                className="block h-full"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br  opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                  {/* Logo */}
                  <div className="mb-4 w-20 h-20 flex items-center justify-center">
                    {brandLogoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={brandLogoUrl}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 80px) 100vw, 80px"
                        />
                      </div>
                    ) : (
                      <span className="text-4xl">
                        {['💻', '📱', '🎧', '⌚', '📷'][index % 5]}
                      </span>
                    )}
                  </div>
                  
                  {/* Brand Name */}
                  <h3 className={`text-lg font-bold text-center mb-2 transition-colors duration-300`}>
                    {brand.name}
                  </h3>
                  
                  {/* Products Count */}
                  <div className="text-sm text-gray-500 mt-2">
                    {brand.productsCount || 0} products
                  </div>
                  
                  {/* Description (on hover) */}
                  <div className="mt-3 text-xs text-gray-600 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {brand.description || 'Explore products from this brand'}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                  <div className="absolute inset-[2px] rounded-2xl bg-white" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BrandGrid;