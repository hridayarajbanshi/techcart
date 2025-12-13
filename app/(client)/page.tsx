import React from 'react'
import CompanySlider from '@/components/CompanySlider';
import Features from '@/components/Features';
import ProductGrid from '@/components/ProductGrid';
import BrandGrid from '@/components/BrandGrid';
import Slider from '@/components/Slider';
import LatestBlogs from '@/components/LatestBlogs';

export default function Home() {
  return (
   <>
   <div className="pt-20">
                <div className="max-w mx-auto px-4 md:px-8 lg:px-16 py-8">
                    <Slider />
               
                </div>
            </div>
      <div className='mx-auto px-4 sm:px-6 lg:px-20 my-10'>
      <ProductGrid />
    </div>
    <BrandGrid />
    <LatestBlogs />
   <CompanySlider />
   <Features />

   </>
  );
}
