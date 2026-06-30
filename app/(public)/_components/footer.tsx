import { Film, Mail, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t">
      {/* ===== MAIN FOOTER CONTENT ===== */}

      <div className="max-w-7xl mx-auto  px-6 py-12">
        <div className="grid grid-cols-15 md:grid-cols-3 gap-50">
          {/* ===== BRAND SECTION ===== */}
          <div className="flex flex-col gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
            >
              <div className="rounded-lg bg-purple-600 p-1.5">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span>
                Cine<span className="text-purple-500">Vault</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed">
              Discover and purchase your favorite movies. Your ultimate cinema experience, online.
            </p>

            {/* Social Icons */}
            <div className="mt-2 flex items-center gap-3">
              <a href="#" className="transition-colors hover:text-purple-400">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors hover:text-purple-400">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ===== ACCOUNT ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground mb-1 text-sm font-semibold tracking-wider uppercase">
              Account
            </h3>
            <Link href="/sign-in" className="text-sm transition-colors hover:text-purple-400">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Register
            </Link>
            <Link href="/orders" className="text-sm transition-colors hover:text-purple-400">
              My Orders
            </Link>
            <Link href="/profile" className="text-sm transition-colors hover:text-purple-400">
              My Profile
            </Link>
          </div>

          {/* ===== CONTACT ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground mb-1 text-sm font-semibold tracking-wider uppercase">
              Contact
            </h3>
            <p className="text-sm">support@cinevault.com</p>
            <p className="text-sm">Mon - Fri, 9am - 6pm</p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t py-4 px-6">
        <div className="max-w-7xl mx-auto  flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>© 2026 CineVault. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-purple-400">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-purple-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
