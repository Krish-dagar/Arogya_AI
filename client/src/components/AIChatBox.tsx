import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Sparkles, Paperclip, X, Image as ImageIcon, FileText, UploadCloud } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";

/**
 * Message type matching server-side LLM Message interface with image & quick-replies support
 */
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  image?: string; // base64 or URL or sample report marker
  imageName?: string;
  quickReplies?: string[];
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string, image?: string, imageName?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  height?: string | number;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
};

// Preset Sample Lab Reports for easy 1-click testing
export const SAMPLE_LAB_REPORTS = [
  {
    id: "cbc",
    title: "🧪 Sample CBC Blood Report",
    fileName: "cbc_report_john_doe.png",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='100%' height='100%' fill='%23f8fafc'/><text x='20' y='30' font-family='sans-serif' font-size='16' font-weight='bold' fill='%230f172a'>LABORATORY BLOOD REPORT (CBC)</text><text x='20' y='70' font-family='sans-serif' font-size='14' fill='%23ef4444'>Hemoglobin (Hb): 11.2 g/dL (LOW 🔽)</text><text x='20' y='100' font-family='sans-serif' font-size='14' fill='%23eab308'>Fasting Glucose: 142 mg/dL (HIGH ⚠️)</text><text x='20' y='130' font-family='sans-serif' font-size='14' fill='%2322c55e'>WBC Count: 7,500 /mcL (NORMAL ✅)</text><text x='20' y='160' font-family='sans-serif' font-size='14' fill='%2322c55e'>Platelets: 250,000 /mcL (NORMAL ✅)</text></svg>",
    prompt: "I am attaching my CBC blood report image. Please read the test values, highlight any high/low results, explain what they mean in simple terms, and ask any necessary medical follow-up questions."
  },
  {
    id: "thyroid",
    title: "📊 Sample Thyroid (TSH) Report",
    fileName: "thyroid_panel.png",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='100%' height='100%' fill='%23f8fafc'/><text x='20' y='30' font-family='sans-serif' font-size='16' font-weight='bold' fill='%230f172a'>THYROID PANEL REPORT</text><text x='20' y='70' font-family='sans-serif' font-size='14' fill='%23ef4444'>TSH (Ultra sensitive): 7.4 uIU/mL (ELEVATED ⚠️)</text><text x='20' y='100' font-family='sans-serif' font-size='14' fill='%2322c55e'>Free T4: 1.10 ng/dL (NORMAL ✅)</text><text x='20' y='130' font-family='sans-serif' font-size='14' fill='%2322c55e'>Free T3: 3.1 pg/mL (NORMAL ✅)</text></svg>",
    prompt: "Please analyze my uploaded Thyroid test report image. My TSH seems elevated. What does this mean for hypothyroid risk?"
  },
  {
    id: "lipid",
    title: "🩸 Sample Lipid Profile",
    fileName: "lipid_profile.png",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><rect width='100%' height='100%' fill='%23f8fafc'/><text x='20' y='30' font-family='sans-serif' font-size='16' font-weight='bold' fill='%230f172a'>LIPID PROFILE TEST REPORT</text><text x='20' y='70' font-family='sans-serif' font-size='14' fill='%23ef4444'>Total Cholesterol: 245 mg/dL (HIGH ⚠️)</text><text x='20' y='100' font-family='sans-serif' font-size='14' fill='%23ef4444'>Triglycerides: 210 mg/dL (HIGH ⚠️)</text><text x='20' y='130' font-family='sans-serif' font-size='14' fill='%2322c55e'>HDL (Good): 48 mg/dL (NORMAL ✅)</text><text x='20' y='160' font-family='sans-serif' font-size='14' fill='%23eab308'>LDL (Bad): 155 mg/dL (BORDERLINE ⚠️)</text></svg>",
    prompt: "Can you read my attached Lipid Profile report image and let me know diet recommendations to lower total cholesterol?"
  }
];

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Ask about symptoms, or attach a lab report image...",
  className,
  height = "600px",
  emptyStateMessage = "Start a conversation with ArogyaAI",
  suggestedPrompts,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleReport = (sample: typeof SAMPLE_LAB_REPORTS[0]) => {
    setAttachedImage(sample.dataUrl);
    setAttachedImageName(sample.fileName);
    if (!input.trim()) {
      setInput(sample.prompt);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if ((!trimmedInput && !attachedImage) || isLoading) return;

    const finalContent = trimmedInput || (attachedImageName ? `Uploaded lab report: ${attachedImageName}` : "Analyzing lab report image...");
    
    onSendMessage(finalContent, attachedImage || undefined, attachedImageName || undefined);
    
    setInput("");
    setAttachedImage(null);
    setAttachedImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Helper to extract quick reply options if assistant ended with follow-up questions
  const getQuickRepliesForMessage = (msg: Message): string[] => {
    if (msg.quickReplies && msg.quickReplies.length > 0) {
      return msg.quickReplies;
    }
    // Default interactive health quick replies if last assistant message asks questions
    return [];
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col bg-card text-card-foreground rounded-xl border border-border shadow-md overflow-hidden",
        className
      )}
      style={{ height }}
    >
      {/* Messages Area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden relative">
        {displayMessages.length === 0 ? (
          <div className="flex h-full flex-col p-4 overflow-y-auto">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-muted-foreground my-auto py-8">
              <div className="flex flex-col items-center gap-3 text-center max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <Sparkles className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">ArogyaAI Clinical Assistant</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{emptyStateMessage}</p>
              </div>

              {/* Sample Lab Report Quick Chips */}
              <div className="w-full max-w-2xl space-y-2 text-center">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" /> Quick Lab Report Vision Test
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_LAB_REPORTS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSampleReport(sample)}
                      disabled={isLoading}
                      className="rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary px-3.5 py-1.5 text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{sample.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Questions */}
              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="flex max-w-2xl flex-wrap justify-center gap-2 pt-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-lg border border-border bg-card hover:bg-muted px-3.5 py-2 text-xs font-medium text-foreground/80 transition-colors shadow-xs"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-5 p-4 sm:p-6">
              {displayMessages.map((message, index) => {
                const isLastAssistantMessage =
                  message.role === "assistant" && index === displayMessages.length - 1;
                const quickReplies = getQuickRepliesForMessage(message);

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user"
                        ? "justify-end items-start"
                        : "justify-start items-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-sm">
                        <Sparkles className="size-4" />
                      </div>
                    )}

                    <div className="space-y-2 max-w-[85%] sm:max-w-[78%]">
                      {/* Image preview inside message bubble if present */}
                      {message.image && (
                        <div className="p-2 rounded-xl bg-background border border-border shadow-xs space-y-1">
                          <img
                            src={message.image}
                            alt="Attached Lab Report"
                            className="max-h-48 rounded-lg object-contain bg-slate-100 dark:bg-slate-900 border"
                          />
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <FileText className="w-3 h-3 text-primary" /> {message.imageName || "Lab Report Image"}
                            </span>
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Lab Vision</span>
                          </div>
                        </div>
                      )}

                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm shadow-xs leading-relaxed",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted/80 text-foreground border border-border/50 rounded-tl-none"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {/* Render Interactive Quick Reply Pills under latest Assistant message */}
                      {isLastAssistantMessage && !isLoading && quickReplies.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          <p className="w-full text-[11px] font-semibold text-primary uppercase tracking-wider mb-0.5">
                            💡 Tap to reply directly:
                          </p>
                          {quickReplies.map((reply, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => onSendMessage(reply)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-xs"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-sm font-bold text-xs">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="size-8 shrink-0 mt-1 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-muted/80 px-4 py-3 border border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span>ArogyaAI is analyzing health context &amp; medical guidelines...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Attached Image Preview Bar before sending */}
      {attachedImage && (
        <div className="px-4 py-2 bg-muted/60 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={attachedImage} alt="Preview" className="w-9 h-9 object-cover rounded-md border" />
            <div className="text-xs truncate">
              <p className="font-semibold text-foreground truncate">{attachedImageName || "Attached Lab Report Image"}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Ready for OCR Vision Analysis</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setAttachedImage(null);
              setAttachedImageName(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Input Form Bar */}
      <form
        ref={inputAreaRef}
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 sm:p-4 border-t border-border bg-background/80 items-end"
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Lab Report Image (CBC, Lipid, Thyroid, etc.)"
          className={cn(
            "shrink-0 h-[38px] w-[38px] border-border rounded-xl",
            attachedImage ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" : "text-muted-foreground"
          )}
        >
          <Paperclip className="size-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 max-h-32 resize-none min-h-[38px] py-2 text-sm rounded-xl"
          rows={1}
        />

        <Button
          type="submit"
          size="icon"
          disabled={(!input.trim() && !attachedImage) || isLoading}
          className="shrink-0 h-[38px] w-[38px] bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
