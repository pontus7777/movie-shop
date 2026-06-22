import Link from "next/link";
import { Film, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t">
      {/* ===== MAIN FOOTER CONTENT ===== */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* ===== BRAND SECTION ===== */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
            >
              <div className="bg-purple-600 rounded-lg p-1.5">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span>
                Cine<span className="text-purple-500">Vault</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed">
              Discover and purchase your favorite movies. Your ultimate cinema
              experience, online.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-1">
              Quick Links
            </h3>
            <Link
              href="/"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/trending"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/popular"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Popular
            </Link>
            <Link
              href="/top-rated"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Top-rated
            </Link>
            <Link
              href="/cart"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Cart
            </Link>
          </div>

          {/* ===== ACCOUNT ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-1">
              Account
            </h3>
            <Link
              href="/sign-in"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/orders"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              My Orders
            </Link>
            <Link
              href="/profile"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              My Profile
            </Link>
          </div>

          {/* ===== CONTACT ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-1">
              Contact
            </h3>
            <p className="text-sm">support@cinevault.com</p>
            <p className="text-sm">Mon - Fri, 9am - 6pm</p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>© 2026 CineVault. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
