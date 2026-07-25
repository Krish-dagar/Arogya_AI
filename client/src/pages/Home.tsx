import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Brain,
  Activity,
  FileSearch,
  Shield,
  ArrowRight,
  Sparkles,
  UserCheck,
  MessageSquare,
  Upload,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: FileSearch,
      title: "Lab Report Image Reader",
      description:
        "Upload photos of your CBC blood tests, thyroid panels, lipid profile, or glucose reports for instant AI OCR analysis.",
    },
    {
      icon: Brain,
      title: "AI Symptom Triage",
      description:
        "Advanced machine learning algorithms analyze your health symptoms and ask proactive follow-up questions.",
    },
    {
      icon: Activity,
      title: "Smart Follow-up Questions",
      description:
        "ArogyaAI asks relevant clinical follow-up questions with 1-click quick replies to pinpoint health issues.",
    },
    {
      icon: UserCheck,
      title: "Personalized Patient Context",
      description:
        "Complete your health profile once to get personalized advice tailored to your age, conditions, and medications.",
    },
    {
      icon: Shield,
      title: "Private & Encrypted",
      description:
        "Your uploaded lab reports and medical history are encrypted and secure with HIPAA-grade standards.",
    },
    {
      icon: Heart,
      title: "24/7 Virtual Health Companion",
      description:
        "Get instant guidance day or night before scheduling doctor visits.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Google Sign In",
      desc: "Instant & secure login with your Google account in 1-click.",
      icon: Shield,
    },
    {
      number: "02",
      title: "Complete Profile",
      desc: "Provide basic health history, age, and conditions for personalized care.",
      icon: UserCheck,
    },
    {
      number: "03",
      title: "AI Chat & Lab Reader",
      desc: "Upload lab report images or discuss symptoms with smart AI follow-ups.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
        <div className="absolute top-25 right-12 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container relative z-10">
          <div
            className={`text-center space-y-8 max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 border border-secondary/30 text-sm font-medium text-secondary shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Next-Gen Medical AI &amp; Lab Report OCR Reader</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Your AI Healthcare &amp;
                <span className="block gradient-text">Lab Report Assistant</span>
              </h1>
              <p className="text-lg md:text-2xl text-foreground/75 max-w-3xl mx-auto leading-relaxed">
                Upload your blood test images, analyze lab reports, and get intelligent health insights with proactive clinical follow-up questions.
              </p>
            </div>

            {/* CTA Buttons Flow */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href={isAuthenticated ? "/chat" : "/login"}>
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  {isAuthenticated ? "Open AI Chatbot" : "Get Started with Google"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {!isAuthenticated && (
                <Link href="/profile-setup">
                  <Button variant="outline" size="lg" className="rounded-full px-6 py-6 border-border font-medium text-base">
                    Preview Profile Setup
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Indicator */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-foreground/70">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Google OAuth</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lab Report OCR Vision</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Smart Follow-up Questions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guided 3-Step Flow Showcase */}
      <section className="py-16 bg-muted/40 border-y border-border">
        <div className="container">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Seamless 3-Step Patient Journey</h2>
            <p className="text-sm md:text-base text-muted-foreground">From sign-in to instant lab report diagnostic insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col items-start space-y-3 group hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                    {s.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Report Reader Showcase */}
      <section id="lab-reader" className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Upload className="w-3.5 h-3.5" /> Image Vision Feature
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Read &amp; Interpret <span className="gradient-text">Lab Reports</span> in Seconds
              </h2>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                No more confusing medical jargon. Snap or upload a photo of your blood test, CBC, lipid profile, or thyroid test. ArogyaAI parses key health indicators, highlights abnormal values, and explains what they mean.
              </p>
              
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Automatic identification of High (⚠️), Low (🔽), and Normal (✅) values</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Clinical explanations translated into clear, everyday language</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Pre-loaded sample lab test chips for instant 1-click testing</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
                    Try Lab Report Reader Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Lab Report Mock Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    🧪
                  </div>
                  <div>
                    <p className="text-sm font-bold">CBC Blood Report Analysis</p>
                    <p className="text-xs text-muted-foreground">Uploaded: Today • 100% Parsed</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Attention Needed
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                  <span>Hemoglobin (Hb)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">11.2 g/dL 🔽 (Low)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                  <span>Fasting Blood Glucose</span>
                  <span className="font-bold text-red-600 dark:text-red-400">142 mg/dL ⚠️ (High)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between">
                  <span>Total WBC Count</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">7,200 /mcL ✅ (Normal)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs space-y-1">
                <p className="font-semibold text-primary">💡 ArogyaAI Clinical Insight:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Your fasting glucose is mildly elevated. Have you noticed any increased thirst or fatigue recently?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold">
              Comprehensive Health Assistant Features
            </h2>
            <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
              Empowering you with AI-driven clarity, lab analysis, and structured follow-ups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group p-6 hover:shadow-lg transition-all duration-300 hover:border-accent/50 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="inline-flex p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors text-accent">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <div className="container text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Analyze Your Health &amp; Lab Reports?
          </h2>
          <p className="text-base md:text-lg text-foreground/75">
            Sign in with Google, complete your profile, and start chatting with your AI healthcare companion in under 60 seconds.
          </p>
          <div className="pt-2">
            <Link href={isAuthenticated ? "/chat" : "/login"}>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 rounded-full shadow-lg"
              >
                {isAuthenticated ? "Go to AI Chatbot" : "Sign In with Google"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background/50 text-sm text-foreground/70">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-base">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs">
              A
            </div>
            <span>ArogyaAI</span>
          </div>
          <p>&copy; 2026 ArogyaAI. Medical AI Assistant &amp; Lab Report Reader. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
