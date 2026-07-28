import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'
import Logo from './logo'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted text-muted-foreground">
      <div className="mx-auto max-w-7.5xl px-4 py-10 sm:px-8">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-16
          "
        >
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />

            <p className="max-w-md text-sm leading-relaxed">
              Your digital cinema library. Discover, collect, and enjoy movies anytime, anywhere.
            </p>

            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="transition-colors hover:text-primary">
                <FaInstagram className="h-5 w-5" />
              </a>

              <a href="#" aria-label="Twitter" className="transition-colors hover:text-primary">
                <FaTwitter className="h-5 w-5" />
              </a>

              <a href="#" aria-label="YouTube" className="transition-colors hover:text-primary">
                <FaYoutube className="h-5 w-5" />
              </a>

              <a href="#" aria-label="Facebook" className="transition-colors hover:text-primary">
                <FaFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Movies */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Movies
            </h3>

            <Link href="/movies" className="text-sm transition-colors hover:text-primary">
              Browse Movies
            </Link>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Account
            </h3>

            <Link href="/sign-in" className="text-sm transition-colors hover:text-primary">
              Sign In
            </Link>

            <Link href="/register" className="text-sm transition-colors hover:text-primary">
              Register
            </Link>

            <Link href="/profile" className="text-sm transition-colors hover:text-primary">
              My Orders
            </Link>

            <Link href="/profile" className="text-sm transition-colors hover:text-primary">
              My Profile
            </Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>

            <p className="text-sm">support@cinevault.com</p>

            <p className="text-sm">Mon - Fri, 9am - 6pm</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/80 bg-background/20">
        <div
          className="
            mx-auto
            flex
            max-w-7.5xl
            flex-col
            items-center
            gap-3
            px-4
            py-5
            text-center
            text-sm
            sm:px-8
            md:flex-row
            md:justify-between
            md:text-left
          "
        >
          <p>© 2026 CineVault. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
