import React from 'react'
import CompanySlider from '@/components/CompanySlider';
import Features from '@/components/Features';
import ProductGrid from '@/components/ProductGrid';
import BrandGrid from '@/components/BrandGrid';


export default function Home() {
  return (
   <>
      <div className='mx-auto px-4 sm:px-6 lg:px-20 my-10'>
      <ProductGrid />
    </div>
    <BrandGrid/>
    {/* <ProductCard product={}/> */}
   <CompanySlider />
   <Features />

   </>
  );
}
