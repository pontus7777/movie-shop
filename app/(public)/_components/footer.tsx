import { Film, Mail, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-background text-muted-foreground">
      {/* ===== MAIN FOOTER CONTENT ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div
          className="
            grid
            grid-cols-1
            gap-8

            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-16
          "
        >
          {/* ===== BRAND SECTION ===== */}
          <div className="flex flex-col gap-4">
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

            <p className="max-w-sm text-sm leading-relaxed">
              Discover and purchase your favorite movies. Your ultimate cinema experience, online.
            </p>

            <div className="flex items-center gap-3">
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
            <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider">
              Account
            </h3>

            <Link href="/sign-in" className="text-sm transition-colors hover:text-purple-400">
              Sign In
            </Link>

            <Link href="/register" className="text-sm transition-colors hover:text-purple-400">
              Register
            </Link>

            <Link href="/user" className="text-sm transition-colors hover:text-purple-400">
              My Dashboard
            </Link>
          </div>

          {/* ===== CONTACT ===== */}
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>

            <p className="text-sm">support@cinevault.com</p>

            <p className="text-sm">Mon - Fri, 9am - 6pm</p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            gap-3
            px-4
            py-5
            text-center
            text-sm

            sm:px-6

            md:flex-row
            md:justify-between
            md:text-left
          "
        >
          <p>© 2026 CineVault. All rights reserved.</p>

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-x-4
              gap-y-2
            "
          >
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
