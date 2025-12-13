import React from 'react';
import { auth, currentUser } from "@clerk/nextjs/server";
import Slider from './Slider';
import Navigation from './Navigation';

const App = async () => {
    // Get user authentication state on the server
    const {userId } = auth();
    const user = await currentUser();
    
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Blog', path: '/blog' },
    ];

    // Initial state values that would normally come from useState
    const initialCartCount = 3;
    const initialFavoriteCount = 5;
    const userData = user ?{
        firstName: user.firstName,
        lastName: user.lastName,
        imgUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress || '',
    }: null;
    
    return (
        <div className="">
            {/* Navigation - Now a client component */}
            <Navigation 
                navLinks={navLinks}
                initialCartCount={initialCartCount}
                initialFavoriteCount={initialFavoriteCount}
                user={userData}
                userId={userId}
            />

            {/* Main Content */}
            
        </div>
    );
}

export default App;