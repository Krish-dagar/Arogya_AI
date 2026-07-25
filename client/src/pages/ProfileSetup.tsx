import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Activity, ArrowRight, CheckCircle2, HeartPulse, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export interface PatientProfile {
  fullName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  conditions: string[];
  medications: string;
  allergies: string;
  isComplete: boolean;
}

export default function ProfileSetup() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Try loading google user or auth user
  const savedGoogleUserStr = localStorage.getItem("arogya_google_user");
  const googleUser = savedGoogleUserStr ? JSON.parse(savedGoogleUserStr) : null;
  const initialName = user?.name || googleUser?.name || "Alex Rivera";

  const [formData, setFormData] = useState<PatientProfile>(() => {
    const existing = localStorage.getItem("arogya_patient_profile");
    if (existing) {
      try {
        return JSON.parse(existing);
      } catch (e) {
        // fallback
      }
    }
    return {
      fullName: initialName,
      age: "32",
      gender: "male",
      bloodGroup: "O+",
      conditions: ["Hypertension"],
      medications: "Lisinopril 10mg daily",
      allergies: "None reported",
      isComplete: true,
    };
  });

  const availableConditions = [
    "Hypertension (High BP)",
    "Diabetes (Type 1/2)",
    "Thyroid Disorder",
    "Asthma / Respiratory",
    "High Cholesterol",
    "Heart Disease",
    "None",
  ];

  const handleConditionToggle = (cond: string) => {
    setFormData(prev => {
      let updated: string[];
      if (cond === "None") {
        updated = ["None"];
      } else {
        const withoutNone = prev.conditions.filter(c => c !== "None");
        if (withoutNone.includes(cond)) {
          updated = withoutNone.filter(c => c !== cond);
        } else {
          updated = [...withoutNone, cond];
        }
      }
      return { ...prev, conditions: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: PatientProfile = {
      ...formData,
      isComplete: true,
    };
    localStorage.setItem("arogya_patient_profile", JSON.stringify(finalProfile));
    // Step 4: Navigate to Chat
    setLocation("/chat");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px]">✓</span>
          <span className="text-emerald-500">Google Auth</span>
          <span>&rarr;</span>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px]">2</span>
          <span className="text-primary font-bold">Complete Profile</span>
          <span>&rarr;</span>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px]">3</span>
          <span>AI Chat</span>
        </div>

        <Card className="border-border shadow-xl backdrop-blur-md bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Complete Your Health Profile</CardTitle>
                <CardDescription className="text-sm">
                  This allows ArogyaAI to give personalized medical insights & tailored lab report analysis.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age (Years)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 32"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(val) => setFormData({ ...formData, gender: val })}
                      className="flex gap-4 pt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })}
                    >
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4 pt-2 border-t border-border">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Pre-existing Health Conditions
                </h3>
                <p className="text-xs text-muted-foreground">Select any conditions you currently have or have a medical history of:</p>

                <div className="flex flex-wrap gap-2">
                  {availableConditions.map(cond => {
                    const isSelected = formData.conditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => handleConditionToggle(cond)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card text-foreground/80 border-border hover:bg-muted"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}{cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Medications & Allergies */}
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications (Optional)</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      placeholder="e.g. Metformin 500mg, Aspirin 75mg daily"
                      rows={2}
                      className="resize-none text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies (Optional)</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                      rows={2}
                      className="resize-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Profile stored securely in your active session</span>
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 shadow-md group"
                >
                  Save &amp; Continue to Chat
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
