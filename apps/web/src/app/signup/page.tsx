'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setStep(2);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const allRequirementsMet = passwordRequirements.every((req) => req.test(password));
    if (!allRequirementsMet) {
      setError('Password does not meet all requirements');
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      // Store auth token (in production, use proper authentication)
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo width={200} height={80} />
          </Link>
        </div>

        {/* Signup Form */}
        <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {step === 1 && 'Create Your Account'}
              {step === 2 && 'Create a Password'}
              {step === 3 && 'Complete Your Profile'}
            </h1>
            <p className="text-sm text-gray-400">
              Step {step} of 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded ${
                  s <= step ? 'bg-red-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
              >
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-900 border-gray-700 text-white pr-10"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.test(password);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        isMet ? 'text-green-500' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          isMet ? 'bg-green-500' : 'bg-gray-700'
                        }`}
                      >
                        {isMet && <Check className="h-3 w-3 text-black" />}
                      </div>
                      <span>{req.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Name */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                  autoFocus
                />
              </div>

              <div className="p-4 bg-gray-900 rounded border border-gray-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600"
                    required
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-white hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-white hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <div className="p-4 bg-gray-900 rounded border border-gray-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm text-gray-300">
                    Send me updates about new films and special offers
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
