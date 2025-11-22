import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: 'Basic',
    price: 9.99,
    description: 'Perfect for casual viewers',
    features: [
      { text: 'Watch on 1 device at a time', included: true },
      { text: 'HD quality (720p)', included: true },
      { text: 'PNG Originals library', included: true },
      { text: 'Limited Pacific Islander films', included: true },
      { text: 'Offline downloads', included: false },
      { text: 'Full content library', included: false },
      { text: '4K Ultra HD', included: false },
      { text: 'Dolby Atmos', included: false },
    ],
    popular: false,
  },
  {
    name: 'Standard',
    price: 14.99,
    description: 'Best value for families',
    features: [
      { text: 'Watch on 2 devices at a time', included: true },
      { text: 'Full HD quality (1080p)', included: true },
      { text: 'Full PNG Originals library', included: true },
      { text: 'Full Pacific Islander films', included: true },
      { text: 'Offline downloads (2 devices)', included: true },
      { text: 'Full content library', included: true },
      { text: '4K Ultra HD', included: false },
      { text: 'Dolby Atmos', included: false },
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 19.99,
    description: 'Ultimate streaming experience',
    features: [
      { text: 'Watch on 4 devices at a time', included: true },
      { text: '4K Ultra HD quality', included: true },
      { text: 'Full PNG Originals library', included: true },
      { text: 'Full Pacific Islander films', included: true },
      { text: 'Offline downloads (4 devices)', included: true },
      { text: 'Full content library', included: true },
      { text: '4K Ultra HD', included: true },
      { text: 'Dolby Atmos sound', included: true },
    ],
    popular: false,
  },
];

const FAQ_ITEMS = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and mobile money services available in Papua New Guinea.',
  },
  {
    question: 'Can I change my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! New subscribers get a 7-day free trial. Cancel before the trial ends to avoid charges.',
  },
  {
    question: 'What devices can I watch on?',
    answer: 'THE WANS works on smartphones, tablets, computers, and smart TVs. Download our apps or watch in your browser.',
  },
];

export default function PricingPage() {
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
              <Link href="/pricing" className="text-red-600 font-semibold">Pricing</Link>
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
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">
            Watch PNG and Pacific Islander cinema anywhere. Cancel anytime.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/50 rounded-full text-green-500 text-sm font-semibold">
            <Check className="h-4 w-4" />
            7-day free trial for all plans
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg overflow-hidden ${
                plan.popular
                  ? 'bg-gradient-to-b from-red-600/20 to-black border-2 border-red-600'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-14' : ''}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-400">PGK</span>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>

                <Link href="/signup">
                  <Button
                    className={`w-full h-12 mb-6 ${
                      plan.popular
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    Start Free Trial
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-white' : 'text-gray-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Basic</th>
                  <th className="text-center p-4 font-semibold bg-red-600/10">Standard</th>
                  <th className="text-center p-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="p-4">Monthly Price</td>
                  <td className="p-4 text-center">PGK 9.99</td>
                  <td className="p-4 text-center bg-red-600/5">PGK 14.99</td>
                  <td className="p-4 text-center">PGK 19.99</td>
                </tr>
                <tr className="bg-gray-900/50">
                  <td className="p-4">Video Quality</td>
                  <td className="p-4 text-center">HD (720p)</td>
                  <td className="p-4 text-center bg-red-600/5">Full HD (1080p)</td>
                  <td className="p-4 text-center">4K Ultra HD</td>
                </tr>
                <tr>
                  <td className="p-4">Devices at once</td>
                  <td className="p-4 text-center">1</td>
                  <td className="p-4 text-center bg-red-600/5">2</td>
                  <td className="p-4 text-center">4</td>
                </tr>
                <tr className="bg-gray-900/50">
                  <td className="p-4">Offline downloads</td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-gray-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-red-600/5">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4">Dolby Atmos</td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-gray-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-red-600/5">
                    <X className="h-5 w-5 text-gray-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="group bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
              >
                <summary className="p-6 cursor-pointer font-semibold flex items-center justify-between hover:bg-gray-800 transition">
                  {item.question}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to start watching?</h2>
            <p className="text-xl mb-6">
              Join thousands of viewers enjoying PNG and Pacific Islander cinema
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-12 text-lg">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
