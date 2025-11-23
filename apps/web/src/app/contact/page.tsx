import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
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

          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-400 mb-12">
            We'd love to hear from you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gray-900 rounded-lg text-center">
              <div className="h-12 w-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">support@thewans.com</p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg text-center">
              <div className="h-12 w-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-gray-400 text-sm">+675 XXX XXXX</p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg text-center">
              <div className="h-12 w-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm">Coming Soon</p>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
