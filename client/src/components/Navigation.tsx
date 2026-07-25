import { useAuth } from "@/_core/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, MessageSquare, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
    // also clear local simulated profile if set
    localStorage.removeItem("arogya_patient_profile");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
            A
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
            ArogyaAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${location === '/' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
          >
            Home
          </Link>
          <a
            href="/#features"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="/#lab-reader"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Lab Report Reader
          </a>
          {isAuthenticated && (
            <>
              <Link 
                href="/profile-setup" 
                className={`text-sm font-medium transition-colors ${location === '/profile-setup' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
              >
                My Profile
              </Link>
              <Link 
                href="/chat" 
                className={`text-sm font-medium transition-colors ${location === '/chat' ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground'}`}
              >
                AI Chat
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profile-setup">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 rounded-full border-primary/20">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs max-w-[100px] truncate">{user?.name || "Patient Profile"}</span>
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-4 shadow-sm">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  <span>Chat Assistant</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline text-xs">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border hover:bg-muted font-medium text-xs sm:text-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-full shadow-sm text-xs sm:text-sm px-4"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground/80"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-3">
            <Link 
              href="/" 
              className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="/#features"
              className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/#lab-reader"
              className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lab Report Reader
            </a>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile-setup" 
                  className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Complete / Edit Health Profile
                </Link>
                <Link 
                  href="/chat" 
                  className="block text-sm font-medium text-primary font-semibold transition-colors py-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Open AI Chatbot
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm font-medium text-destructive transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="block text-sm font-medium text-primary font-semibold transition-colors py-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
