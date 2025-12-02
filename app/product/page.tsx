'use client';

import Navbar from '@/src/components/Navbar';
import ProductPage from '@/src/sections/ProductPage';
import Footer from '@/src/components/Footer';

export default function ProductRoute() {
  return (
    <div className="w-full bg-background">
      <Navbar currentPage="product" />
      <ProductPage />
      <Footer />
    </div>
  );
}
