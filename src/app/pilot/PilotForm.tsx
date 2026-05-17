"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type FormState = "idle" | "submitting" | "sent" | "error";

export function PilotForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/pilot-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setState("sent");
      event.currentTarget.reset();
      return;
    }

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setError(result?.error ?? "Something went wrong. Please email us directly.");
    setState("error");
  }

  return (
    <form className="rounded-lg border border-[#d7d1c4] bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Your name</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="name"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Work email</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Business name</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="businessName"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Business type</span>
          <select
            className="h-11 rounded-md border border-[#cfcabf] bg-white px-3 outline-none focus:border-[#123c69]"
            name="businessType"
            defaultValue="Plumbing"
          >
            <option>Plumbing</option>
            <option>Cleaning</option>
            <option>Med spa or salon</option>
            <option>Landscaping</option>
            <option>Roofing</option>
            <option>Other local service</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Website</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="website"
            placeholder="https://"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Phone</span>
          <input
            className="h-11 rounded-md border border-[#cfcabf] px-3 outline-none focus:border-[#123c69]"
            name="phone"
            type="tel"
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-semibold">What should we help with first?</span>
        <textarea
          className="min-h-28 rounded-md border border-[#cfcabf] px-3 py-3 outline-none focus:border-[#123c69]"
          name="message"
          placeholder="Example: We get quote forms after hours and want an instant text-back."
        />
      </label>

      <button
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#d94f30] px-5 font-semibold text-white transition hover:bg-[#bf4227] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "Sending..." : "Request pilot"}
        <Send size={17} aria-hidden="true" />
      </button>

      {state === "sent" ? (
        <p className="mt-4 rounded-md bg-[#e6f2ec] px-3 py-2 text-sm font-semibold text-[#1f7049]">
          Request sent. We will reply with next setup steps.
        </p>
      ) : null}

      {state === "error" ? (
        <p className="mt-4 rounded-md bg-[#fff4ed] px-3 py-2 text-sm font-semibold text-[#9b341f]">
          {error}{" "}
          <a className="underline" href="mailto:hello@localleadreply.com?subject=Pilot%20request">
            Email us here.
          </a>
        </p>
      ) : null}
    </form>
  );
}
