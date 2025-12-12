"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, Mail } from "lucide-react";
import { getAccentClasses } from "./types";

interface ContactFormProps {
  recipientEmail: string;
  recipientName: string;
  accentColor?: string;
}

export function ContactForm({ recipientEmail, recipientName, accentColor = "amber" }: ContactFormProps) {
  const colors = getAccentClasses(accentColor);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          to: recipientEmail,
          recipientName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSent(true);
      setFormState({ name: "", email: "", message: "" });
    } catch {
      setError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Mensagem enviada!</h3>
        <p className="text-muted-foreground mb-4">
          {recipientName} recebera sua mensagem em breve.
        </p>
        <button
          onClick={() => setSent(false)}
          className={`text-sm ${colors.text} hover:underline`}
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="contact-name"
            type="text"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="Seu nome"
            required
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            placeholder="seu@email.com"
            required
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          placeholder="Sua mensagem..."
          rows={4}
          required
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className={`w-full ${colors.bg} text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2`}
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar Mensagem
          </>
        )}
      </button>
    </form>
  );
}
