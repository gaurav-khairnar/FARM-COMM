"use client";

import Link from 'next/link';
import { Sprout, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-20 border-t border-[color:var(--line)] bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/home" className="flex items-center gap-2 text-[color:var(--primary)]">
              <Sprout size={28} className="text-[color:var(--accent)]" />
              <span className="text-xl font-bold">Farm-Connect</span>
            </Link>
            <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">
              Connecting local farmers with conscious consumers for fresh, organic produce delivery.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-[color:var(--neutral)] hover:bg-[color:var(--primary)] hover:text-white flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[color:var(--neutral)] hover:bg-[color:var(--primary)] hover:text-white flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[color:var(--neutral)] hover:bg-[color:var(--primary)] hover:text-white flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-[color:var(--text)] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/home" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Marketplace</Link></li>
              <li><Link href="/cart" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Shopping Cart</Link></li>
              <li><Link href="/orders" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">My Orders</Link></li>
              <li><Link href="/sell" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Sell Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-[color:var(--text)] mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[color:var(--text)] mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-[color:var(--text-muted)]">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Farm Road, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2 text-[color:var(--text-muted)]">
                <Phone size={16} className="flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-[color:var(--text-muted)]">
                <Mail size={16} className="flex-shrink-0" />
                <span>support@farm-connect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[color:var(--line)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[color:var(--text-muted)]">
          <p>© {currentYear} Farm-Connect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500">❤</span> for farmers and consumers
          </p>
        </div>
      </div>
    </footer>
  );
}
