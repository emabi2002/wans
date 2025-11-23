import Link from 'next/link';
import { Smartphone, Tablet, Monitor, Download, Star, Check } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function MobilePreviewPage() {
  const features = [
    'Seamless streaming on any device',
    'Offline downloads for on-the-go viewing',
    'Personalized recommendations',
    'Multi-device sync',
    '4K streaming support',
    'Parental controls',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-black px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo width={150} height={60} />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-gray-300 transition">Home</Link>
              <Link href="/browse" className="hover:text-gray-300 transition">Browse</Link>
              <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-8 md:px-16 pb-20">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Watch Anywhere,
            <br />
            <span className="text-red-600">Anytime</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            THE WANS works perfectly on all your devices. Stream PNG and Pacific Islander cinema on your phone, tablet, or TV.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 gap-2">
              <Download className="h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/10 gap-2">
              <Download className="h-5 w-5" />
              Download for Android
            </Button>
          </div>
        </div>

        {/* Device Mockups */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Mobile */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-4">
                <Smartphone className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile</h3>
              <p className="text-gray-400">
                Perfect for watching on the go. Download episodes for offline viewing.
              </p>
            </div>

            {/* Tablet */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-4">
                <Tablet className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tablet</h3>
              <p className="text-gray-400">
                Optimized for larger screens. Enjoy the best viewing experience.
              </p>
            </div>

            {/* Desktop */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-4">
                <Monitor className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Desktop & TV</h3>
              <p className="text-gray-400">
                Stream in stunning 4K on your computer or smart TV.
              </p>
            </div>
          </div>

          {/* Mobile Screenshot Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Phone Frame */}
                <div className="relative mx-auto">
                  <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />

                    {/* Screen Content */}
                    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] overflow-hidden">
                      {/* Mock Mobile UI */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-6 bg-red-600 rounded" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-700 rounded-full" />
                            <div className="w-6 h-6 bg-red-600 rounded-full" />
                          </div>
                        </div>

                        {/* Featured Film */}
                        <div className="aspect-video bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="h-2 w-full bg-gray-700 rounded-full mb-2">
                              <div className="h-full w-1/3 bg-red-600 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Film Grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-800 rounded" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">Mobile App Features</h2>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Mockup */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tablet Experience</h2>
            <p className="text-xl text-gray-400">
              Enjoy immersive viewing with our tablet-optimized interface
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-8">
              {/* Tablet Frame */}
              <div className="relative max-w-4xl mx-auto">
                <div className="relative bg-black rounded-3xl p-6 shadow-2xl border-8 border-gray-800">
                  <div className="aspect-[4/3] bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
                    {/* Mock Tablet UI */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-10 bg-red-600 rounded" />
                          <div className="hidden sm:flex gap-6">
                            {['Home', 'Browse', 'My List'].map((item) => (
                              <div key={item} className="h-4 w-16 bg-gray-700 rounded" />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 bg-gray-700 rounded-full" />
                          <div className="h-8 w-8 bg-red-600 rounded-full" />
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="aspect-[2/3] bg-gray-800 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">4K</div>
              <p className="text-gray-400">Ultra HD Quality</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">100+</div>
              <p className="text-gray-400">Films Available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">5</div>
              <p className="text-gray-400">Devices Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= 4 ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-700 text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400">App Store Rating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Watching?</h2>
            <p className="text-xl mb-8">
              Download the app now and get 7 days free
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 gap-2">
                <Download className="h-5 w-5" />
                App Store
              </Button>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 gap-2">
                <Download className="h-5 w-5" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
