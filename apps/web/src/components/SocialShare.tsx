'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Link2, Mail, Check } from 'lucide-react';
import { Button } from './ui/button';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
}

export function SocialShare({ title, description, url }: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = description || title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    setShowMenu(false);
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    setShowMenu(false);
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
      `${shareText}\n\n${shareUrl}`
    )}`;
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-black border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-semibold">Share</p>
            </div>
            <div className="p-2">
              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded transition text-left"
              >
                <Facebook className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Share on Facebook</span>
              </button>
              <button
                onClick={shareOnTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded transition text-left"
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                <span className="text-sm">Share on Twitter</span>
              </button>
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded transition text-left"
              >
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm">Share via Email</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded transition text-left"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
