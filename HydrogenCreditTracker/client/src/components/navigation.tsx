import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/auth/wallet-connect";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explorer", href: "/explorer" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Regulator", href: "/regulator" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold gradient-text">
              HydroChain
            </Link>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Green Hydrogen Credits
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  location === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnect />
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location === item.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
                data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
