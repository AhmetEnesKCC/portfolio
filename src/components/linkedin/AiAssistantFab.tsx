"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Loader2, Send, Trash2, X } from "lucide-react";

import type { Locale } from "@/src/i18n/locales";
import { cn } from "@/src/lib/utils";

type ChatMsg = { role: "user" | "assistant"; content: string };

function presets(locale: Locale) {
  if (locale === "en") {
    return [
      "Summarize your profile in 3 bullet points.",
      "Which technologies did you use most in your latest experience?",
      "What are your most notable hackathon achievements?",
    ];
  }
  return [
    "Profilini 3 maddeyle özetler misin?",
    "En son deneyiminde en çok hangi teknolojileri kullandın?",
    "Öne çıkan hackathon başarılarını özetler misin?",
  ];
}

export function AiAssistantFab({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const typingRef = useRef<{
    idx: number;
    full: string;
    cursor: number;
    done: boolean;
    raf: number | null;
    lastTs: number;
  } | null>(null);

  const presetQs = useMemo(() => presets(locale), [locale]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length, loading]);

  function stopTyping() {
    const t = typingRef.current;
    if (t?.raf) cancelAnimationFrame(t.raf);
    typingRef.current = null;
  }

  function ensureTypingLoop() {
    if (reduce) return;
    const cur0 = typingRef.current;
    if (!cur0) return;
    if (cur0.raf) return;

    const charsPerSec = 55; // sober typing speed
    const tick = (ts: number) => {
      const cur = typingRef.current;
      if (!cur) return;
      const dt = cur.lastTs ? ts - cur.lastTs : 16;
      cur.lastTs = ts;

      const step = Math.max(1, Math.round((dt / 1000) * charsPerSec));
      cur.cursor = Math.min(cur.full.length, cur.cursor + step);
      const shown = cur.full.slice(0, cur.cursor);

      setMessages((m) => {
        const next = [...m];
        const msg = next[cur.idx];
        if (msg && msg.role === "assistant") {
          next[cur.idx] = { ...msg, content: shown };
        }
        return next;
      });

      const finished = cur.done && cur.cursor >= cur.full.length;
      if (finished) {
        cur.raf = null;
        return;
      }
      cur.raf = requestAnimationFrame(tick);
    };

    cur0.raf = requestAnimationFrame(tick);
  }

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    // Follow-up context: son ~5 exchange (10 mesaj)
    const ctx = messages.slice(-10);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, locale, history: ctx }),
      });

      if (!res.ok || !res.body) {
        const fallback =
          locale === "en"
            ? "Sorry—AI is not available right now."
            : "Üzgünüm—AI şu an kullanılamıyor.";
        setMessages((m) => [
          ...m,
          { role: "user", content: q },
          { role: "assistant", content: fallback },
        ]);
        setInput("");
        return;
      }

      // Add user message + assistant placeholder, then stream into assistant
      stopTyping();
      let idx = 0;
      setMessages((m) => {
        idx = m.length + 1; // assistant index after pushing user
        return [...m, { role: "user", content: q }, { role: "assistant", content: "" }];
      });
      setInput("");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      typingRef.current = {
        idx,
        full: "",
        cursor: 0,
        done: false,
        raf: null,
        lastTs: 0,
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });

        if (reduce) {
          // reduced-motion: show instantly
          setMessages((m) => {
            const next = [...m];
            const msg = next[idx];
            if (msg && msg.role === "assistant") {
              next[idx] = { ...msg, content: full };
            }
            return next;
          });
        } else if (typingRef.current) {
          typingRef.current.full = full;
          ensureTypingLoop();
        }
      }

      if (!reduce && typingRef.current) {
        typingRef.current.full = full;
        typingRef.current.done = true;
        ensureTypingLoop();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100 shadow-lg backdrop-blur transition hover:bg-white/10"
        aria-label="AI Asistan"
      >
        <Bot className="size-4" />
        <span className="hidden sm:block">AI</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              className="absolute bottom-4 left-1/2 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur"
              initial={reduce ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
              animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
              transition={
                reduce
                  ? undefined
                  : { type: "spring", stiffness: 320, damping: 34, mass: 0.6 }
              }
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-sm font-semibold text-zinc-100">
                  {locale === "en" ? "AI Assistant" : "AI Asistan"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 transition hover:bg-white/10"
                    aria-label={locale === "en" ? "Clear" : "Temizle"}
                    title={locale === "en" ? "Clear chat" : "Sohbeti temizle"}
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-200 transition hover:bg-white/10"
                    aria-label="Kapat"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {presetQs.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div
                  ref={scrollRef}
                  className="mt-4 max-h-[42vh] space-y-4 overflow-auto pr-1"
                >
                  {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={idx}
                        className={cn("flex", isUser ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "w-fit max-w-[88%] rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-100 shadow-sm",
                            isUser ? "bg-white/8" : "bg-black/30",
                          )}
                        >
                          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-zinc-300">
                            {isUser ? (
                              <span>{locale === "en" ? "You" : "Sen"}</span>
                            ) : (
                              <>
                                <Bot className="size-3.5" />
                                <span>AI</span>
                              </>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap leading-6">
                            {m.content || (!isUser && loading ? "…" : "")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  className="mt-4 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(input);
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      locale === "en"
                        ? "Ask a question about this CV..."
                        : "CV hakkında bir soru sor..."
                    }
                    className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/20"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 disabled:opacity-60",
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span className="hidden sm:block">
                          {locale === "en" ? "Sending" : "Gönderiliyor"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span className="hidden sm:block">
                          {locale === "en" ? "Send" : "Gönder"}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

