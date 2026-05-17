"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type State = "idle" | "submitting" | "sent" | "error";

export function LeadCaptureForm({
  businessName,
  businessSlug,
  services,
}: {
  businessName: string;
  businessSlug: string;
  services: string[];
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [autoReply, setAutoReply] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");
    setAutoReply("");

    const form = new FormData(event.currentTarget);
    const payload = {
      businessSlug,
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      service: form.get("service"),
      message: form.get("message"),
      consent: form.get("consent") === "on",
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
      | { error?: string; autoReplyPreview?: string }
      | null;

    if (response.ok) {
      setAutoReply(result?.autoReplyPreview ?? "");
      setState("sent");
      event.currentTarget.reset();
      return;
    }

    setError(result?.error ?? "The request could not be sent. Please call directly.");
    setState("error");
  }

  return (
    <form className="rounded-lg border border-[#d7d1c4] bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Name</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="name"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Phone</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="phone"
            required
            type="tel"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Email</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="email"
            type="email"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">What do you need help with?</span>
          <select
            className="h-11 rounded-md border border-[#cfcabf] bg-white px-3 outline-none focus:border-[#123c69]"
            name="service"
            required
          >
            {services.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-semibold">Short description</span>
        <textarea
          className="min-h-28 rounded-md border border-[#cfcabf] px-3 py-3 outline-none focus:border-[#123c69]"
          name="message"
          placeholder="Tell us what happened and when you are available."
        />
      </label>

      <label className="mt-4 flex gap-3 rounded-md bg-[#f4f1ea] p-3 text-sm leading-6 text-[#4f514b]">
        <input className="mt-1" name="consent" required type="checkbox" />
        <span>
          I agree that {businessName} may contact me by call or text about this
          request. Message and data rates may apply. Reply STOP to opt out.
        </span>
      </label>

      <button
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#d94f30] px-5 font-semibold text-white transition hover:bg-[#bf4227] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "Sending..." : "Send request"}
        <Send size={17} aria-hidden="true" />
      </button>

      {state === "sent" ? (
        <div className="mt-4 rounded-md bg-[#e6f2ec] px-3 py-3 text-sm text-[#1f7049]">
          <p className="font-semibold">Request sent.</p>
          {autoReply ? <p className="mt-2 leading-6">Approved reply preview: {autoReply}</p> : null}
        </div>
      ) : null}

      {state === "error" ? (
        <p className="mt-4 rounded-md bg-[#fff4ed] px-3 py-2 text-sm font-semibold text-[#9b341f]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
