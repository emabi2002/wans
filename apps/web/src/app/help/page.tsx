import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I watch films on THE WANS?',
      answer: 'Simply browse our catalog, click on any film, and press Play. You can also add films to your list to watch later.',
    },
    {
      question: 'Can I download films for offline viewing?',
      answer: 'Offline viewing is coming soon. Currently, all content requires an internet connection.',
    },
    {
      question: 'What devices are supported?',
      answer: 'THE WANS works on all modern web browsers on desktop, tablet, and mobile devices.',
    },
    {
      question: 'How do I add films to My List?',
      answer: 'Click the "+ My List" button on any film page or from the homepage hero section.',
    },
    {
      question: 'How can I search for specific films?',
      answer: 'Use the Search page to find films by title, actor, director, or use filters for genre, year, rating, and language.',
    },
    {
      question: 'Are there subtitles available?',
      answer: 'Many of our films include English subtitles. Subtitle availability is indicated on each film page.',
    },
  ];

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

          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-400 mb-12">
            Find answers to common questions
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
            <p className="text-gray-300 mb-4">
              Our support team is here to assist you.
            </p>
            <Link href="/contact" className="text-red-500 hover:text-red-400 font-semibold">
              Contact Support →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
