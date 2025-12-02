'use client';

import Navbar from '@/src/components/Navbar';
import Contact from '@/src/sections/Contact';
import Footer from '@/src/components/Footer';

export default function ContactPage() {
  return (
    <div className="w-full bg-background">
      <Navbar currentPage="contact" />
      <Contact />
      <Footer />
    </div>
  );
}
