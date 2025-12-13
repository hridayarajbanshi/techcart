import React from 'react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'

const page = async () => {
    // Function to fetch latest blogs
    const getLatestBlogs = async (limit: number) => {
        const query = `*[_type == "blog"] | order(publishedAt desc) [0...${limit}] {
            _id,
            title,
            slug,
            excerpt,
            mainImage,
            category->{title},
            publishedAt
        }`
        return await client.fetch(query)
    }

    // Function to fetch latest vlogs
    const getLatestVlogs = async (limit: number) => {
        const query = `*[_type == "vlog"] | order(publishedAt desc) [0...${limit}] {
            _id,
            title,
            slug,
            excerpt,
            videoThumbnail,
            category->{title},
            publishedAt
        }`
        return await client.fetch(query)
    }

    // You might want to create a client component with state to toggle
    // For server component, you could add a search param or separate pages
    
    const blogs = await getLatestBlogs(3);
    // const vlogs = await getLatestVlogs(3); // Uncomment when you have vlogs
    
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className='max-w-7xl mx-auto mb-10'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">Latest Content</h1>
                    {/* Add toggle buttons here */}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 pt-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300 cursor-pointer">
                            {blog.mainImage && (
                                <Image 
                                    className="rounded-lg w-full h-48 object-cover"
                                    src={urlFor(blog.mainImage).url()}
                                    alt={blog.title}
                                    width={288}
                                    height={192}
                                />
                            )}
                            <h3 className="text-base text-slate-900 font-medium mt-3">{blog.title}</h3>
                            {blog.category && (
                                <span className="text-sm text-green-600 font-semibold">{blog.category.title}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default page;