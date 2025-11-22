import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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

          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: November 22, 2025</p>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using THE WANS streaming platform, you accept and agree to be bound
                by the terms and conditions of this agreement. If you do not agree to these terms,
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="leading-relaxed">
                Permission is granted to temporarily stream one copy of the materials on THE WANS
                for personal, non-commercial viewing only. This is the grant of a license, not a
                transfer of title.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You agree to notify us immediately
                of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Content Usage</h2>
              <p className="leading-relaxed">
                All content on THE WANS is protected by copyright and other intellectual property laws.
                You may not reproduce, distribute, modify, create derivative works of, publicly display,
                or exploit any of our content without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
              <p className="leading-relaxed mb-3">You agree not to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the service</li>
                <li>Share your account with others</li>
                <li>Download or copy content without permission</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                THE WANS shall not be held liable for any damages arising from the use or inability
                to use the service, including but not limited to direct, indirect, incidental,
                punitive, and consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any
                material changes. Your continued use of the service after such modifications constitutes
                your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms of Service, please contact us at{' '}
                <Link href="/contact" className="text-red-500 hover:text-red-400">
                  support@thewans.com
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
