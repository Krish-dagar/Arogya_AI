import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { User, Activity, Edit3, Sparkles, ShieldCheck, FileSearch } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();

  // Load saved patient profile from local storage if available
  const [patientProfile, setPatientProfile] = useState(() => {
    const saved = localStorage.getItem("arogya_patient_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      fullName: user?.name || "Alex Rivera",
      age: "32",
      gender: "male",
      bloodGroup: "O+",
      conditions: ["Hypertension"],
      medications: "Lisinopril 10mg daily",
      allergies: "None",
      isComplete: true,
    };
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${patientProfile.fullName || "there"}! I'm **ArogyaAI**, your intelligent clinical assistant & lab report vision reader.\n\nI have reviewed your active profile (*${patientProfile.age} yrs old, ${patientProfile.gender}, History: ${patientProfile.conditions?.join(", ") || "None"}*).\n\nHow can I help you today? You can ask about **Eye Strain & Screen Fatigue 👁️**, **Headaches & Tension 🤯**, or **attach a lab report image** (CBC, Lipid, Thyroid, Glucose tests) using the paperclip icon below! 🧪`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const handleSendMessage = async (content: string, image?: string, imageName?: string) => {
    const userMessage: Message = {
      role: "user",
      content,
      image,
      imageName,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        messages: newMessages.map(m => ({
          role: m.role,
          content: m.content,
          image: m.image,
        })),
        patientProfile,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, I encountered a temporary connection issue. Please check your network and try sending your message again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "👁️ I have severe eye strain & dry eyes from 8 hours of screen work",
    "🤯 Having a throbbing headache across my forehead & temples",
    "🧪 Read my uploaded CBC blood report image",
    "🩺 What is the 20-20-20 rule for digital eye strain?",
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background p-2 sm:p-4 max-w-7xl mx-auto w-full gap-3">
      {/* Patient Profile Context Header Banner */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{patientProfile.fullName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Active Health Profile
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {patientProfile.age} yrs • {patientProfile.gender?.toUpperCase()} • Blood: {patientProfile.bloodGroup || "O+"} • Conditions: {patientProfile.conditions?.join(", ") || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile-setup">
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1.5 border-border">
              <Edit3 className="w-3.5 h-3.5 text-primary" />
              <span>Edit Profile</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([
                {
                  role: "assistant",
                  content: `New session started. How can I assist you with your health or lab reports today, ${patientProfile.fullName}?`,
                }
              ]);
            }}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main AI Chatbot Container */}
      <AIChatBox
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask about symptoms, or attach a lab report image (CBC, Lipid, Thyroid)..."
        className="flex-1 min-h-0 border-border"
        height="100%"
        emptyStateMessage="Ask a medical question or attach a lab report image to analyze"
        suggestedPrompts={suggestedPrompts}
      />
    </div>
  );
}
