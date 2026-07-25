import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Shield, Sparkles, UserCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [isSimulating, setIsSimulating] = useState(false);

  // If already authenticated, redirect to profile setup or chat
  if (isAuthenticated && !isSimulating) {
    // Check if profile exists, if not go to setup, else chat
    const savedProfile = localStorage.getItem("arogya_patient_profile");
    if (!savedProfile) {
      setLocation("/profile-setup");
    } else {
      setLocation("/chat");
    }
  }

  const handleSimulatedGoogleAuth = (email: string, name: string) => {
    setIsSimulating(true);
    // Store user data in local simulated auth session
    const mockUser = {
      id: "google-usr-" + Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
    localStorage.setItem("manus-runtime-user-info", JSON.stringify(mockUser));
    localStorage.setItem("arogya_google_user", JSON.stringify(mockUser));
    
    // Redirect to step 3: Complete Profile
    setTimeout(() => {
      window.location.href = "/profile-setup";
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px]">1</span>
          <span className="text-primary font-bold">Google Auth</span>
          <span>&rarr;</span>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px]">2</span>
          <span>Complete Profile</span>
          <span>&rarr;</span>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px]">3</span>
          <span>AI Chat</span>
        </div>

        <Card className="border-border shadow-xl backdrop-blur-md bg-card/95 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
          
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Sign In to ArogyaAI</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Connect your Google account to get personalized AI healthcare guidance & lab report reading.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Primary Google Login Button (OAuth) */}
            <Button
              onClick={() => startLogin()}
              variant="outline"
              size="lg"
              className="w-full h-12 font-medium text-foreground bg-background hover:bg-muted/80 border-border flex items-center justify-center gap-3 shadow-sm transition-all hover:scale-[1.01]"
            >
              {/* Colorful Google G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or Quick Demo Sign In</span>
              </div>
            </div>

            {/* Quick Demo Google Accounts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-1">
                Select a simulated Google Account to test the flow instantly:
              </p>
              
              <button
                onClick={() => handleSimulatedGoogleAuth("alex.rivera@gmail.com", "Alex Rivera")}
                disabled={isSimulating}
                className="w-full p-3 rounded-xl border border-border hover:border-primary/50 bg-muted/40 hover:bg-accent/10 flex items-center justify-between transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                    AR
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">Alex Rivera</p>
                    <p className="text-xs text-muted-foreground">alex.rivera@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => handleSimulatedGoogleAuth("sarah.chen@gmail.com", "Sarah Chen")}
                disabled={isSimulating}
                className="w-full p-3 rounded-xl border border-border hover:border-primary/50 bg-muted/40 hover:bg-accent/10 flex items-center justify-between transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-foreground font-bold flex items-center justify-center text-xs">
                    SC
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">sarah.chen@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border p-4 text-center justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>HIPAA Compliant &amp; 256-Bit SSL Encrypted Health Portal</span>
            </div>
          </CardFooter>
        </Card>

        {/* Feature Pill Footer */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
          <div className="p-2 rounded-lg bg-card border border-border/50 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Instant Google SSO</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border/50 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Lab Report Vision</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border/50 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Smart Follow-ups</span>
          </div>
        </div>
      </div>
    </div>
  );
}
