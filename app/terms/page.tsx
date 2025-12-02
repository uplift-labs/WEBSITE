'use client';

import Navbar from '@/src/components/Navbar';
import Terms from '@/src/sections/Terms';
import Footer from '@/src/components/Footer';

export default function TermsPage() {
  return (
    <div className="w-full bg-background">
      <Navbar currentPage="home" />
      <Terms />
      <Footer />
    </div>
  );
}
