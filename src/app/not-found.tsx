import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-slate-900">
      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-6xl sm:text-8xl text-gold-500 mb-4">
            404
          </h1>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="javascript:history.back()">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Go Back
            </a>
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Or explore our main sections:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="text-gold-500 hover:text-gold-400 transition-colors">
              Services
            </Link>
            <Link href="/work" className="text-gold-500 hover:text-gold-400 transition-colors">
              Our Work
            </Link>
            <Link href="/about" className="text-gold-500 hover:text-gold-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gold-500 hover:text-gold-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
