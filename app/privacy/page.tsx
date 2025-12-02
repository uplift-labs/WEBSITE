'use client';

import Navbar from '@/src/components/Navbar';
import Privacy from '@/src/sections/Privacy';
import Footer from '@/src/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="w-full bg-background">
      <Navbar currentPage="home" />
      <Privacy />
      <Footer />
    </div>
  );
}
