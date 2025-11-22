import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 z-50 w-full bg-black px-8 py-4 border-b border-gray-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo width={150} height={60} />
          </Link>
        </div>
      </nav>

      <div className="pt-24 px-8 md:px-16 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-gray-300 transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-5xl font-bold mb-8">About THE WANS</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-xl leading-relaxed">
              THE WANS is the premier streaming platform dedicated to bringing Papua New Guinea,
              Pacific Islander, and world cinema to audiences everywhere.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Our Mission</h2>
            <p className="leading-relaxed">
              We believe in the power of storytelling to connect cultures, preserve heritage,
              and inspire change. Our platform showcases authentic voices from Papua New Guinea
              and the Pacific Islands, alongside carefully curated international content.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">What We Offer</h2>
            <ul className="space-y-3 leading-relaxed">
              <li>• Original PNG productions and exclusive content</li>
              <li>• Pacific Islander films celebrating diverse cultures</li>
              <li>• Award-winning Asian cinema</li>
              <li>• International films from around the world</li>
              <li>• Documentaries highlighting environmental and cultural stories</li>
            </ul>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Our Values</h2>
            <p className="leading-relaxed">
              We are committed to cultural authenticity, supporting local filmmakers,
              and providing a platform where Pacific stories can be told by Pacific voices.
              Every film we feature is carefully selected to ensure quality, relevance,
              and respect for the communities we serve.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
