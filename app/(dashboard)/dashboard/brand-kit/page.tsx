"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const TONE_OPTIONS = [
  { value: "PROFESSIONAL", label: "Professional", description: "Polished and authoritative" },
  { value: "CASUAL", label: "Casual", description: "Relaxed and approachable" },
  { value: "PLAYFUL", label: "Playful", description: "Fun and light-hearted" },
  { value: "BOLD", label: "Bold", description: "Confident and impactful" },
  { value: "LUXURIOUS", label: "Luxurious", description: "Refined and high-end" },
  { value: "TECHNICAL", label: "Technical", description: "Precise and detail-oriented" },
  { value: "INSPIRATIONAL", label: "Inspirational", description: "Uplifting and motivating" },
  { value: "FRIENDLY", label: "Friendly", description: "Warm and welcoming" },
];

const defaultForm = {
  brandName: "",
  tagline: "",
  primaryColor: "#7C3AED",
  secondaryColor: "#18181B",
  accentColor: "#A78BFA",
  toneOfVoice: "PROFESSIONAL",
  brandValues: [] as string[],
  allowedClaims: [] as string[],
  prohibitedClaims: [] as string[],
  targetAudience: "",
};

export default function BrandKitPage() {
  const [form, setForm] = useState(defaultForm);
  const [valueInput, setValueInput] = useState("");
  const [hasSavedKit, setHasSavedKit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Textarea display values (joined strings)
  const [allowedClaimsText, setAllowedClaimsText] = useState("");
  const [prohibitedClaimsText, setProhibitedClaimsText] = useState("");

  useEffect(() => {
    async function fetchBrandKit() {
      try {
        const res = await fetch("/api/brand-kit");
        if (res.ok) {
          const data = await res.json();
          if (data && data.brandKit && data.brandKit.brandName !== undefined) {
            setForm({
              brandName: data.brandKit.brandName ?? "",
              tagline: data.brandKit.tagline ?? "",
              primaryColor: data.brandKit.primaryColor ?? "#7C3AED",
              secondaryColor: data.brandKit.secondaryColor ?? "#18181B",
              accentColor: data.brandKit.accentColor ?? "#A78BFA",
              toneOfVoice: data.brandKit.toneOfVoice ?? "PROFESSIONAL",
              brandValues: data.brandKit.brandValues ?? [],
              allowedClaims: data.brandKit.allowedClaims ?? [],
              prohibitedClaims: data.brandKit.prohibitedClaims ?? [],
              targetAudience: data.brandKit.targetAudience ?? "",
            });
            setAllowedClaimsText((data.brandKit.allowedClaims ?? []).join("\n"));
            setProhibitedClaimsText((data.brandKit.prohibitedClaims ?? []).join("\n"));
            setHasSavedKit(true);
          }
        }
      } catch {
        // no-op: form stays at defaults
      } finally {
        setLoading(false);
      }
    }
    fetchBrandKit();
  }, []);

  function handleField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleValueKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = valueInput.trim().replace(/,$/, "");
      if (trimmed && !form.brandValues.includes(trimmed)) {
        setForm((prev) => ({ ...prev, brandValues: [...prev.brandValues, trimmed] }));
      }
      setValueInput("");
    }
  }

  function removeValue(val: string) {
    setForm((prev) => ({ ...prev, brandValues: prev.brandValues.filter((v) => v !== val) }));
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        ...form,
        allowedClaims: allowedClaimsText.split("\n").filter((s) => s.trim() !== ""),
        prohibitedClaims: prohibitedClaimsText.split("\n").filter((s) => s.trim() !== ""),
      };
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setHasSavedKit(true);
        setFeedback({ type: "success", message: "Brand kit saved successfully." });
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback({ type: "error", message: err?.error ?? "Failed to save brand kit." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Brand Kit</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Define your brand identity to make every generated ad on-brand.
            </p>
          </div>
          {hasSavedKit && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Brand Kit Active
            </span>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm ${
              feedback.type === "success"
                ? "bg-green-400/10 border-green-400/20 text-green-400"
                : "bg-red-400/10 border-red-400/20 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {feedback.message}
          </div>
        )}

        {/* Section 1: Brand Identity */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Brand Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-1.5">Brand Name</label>
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => handleField("brandName", e.target.value)}
                placeholder="e.g. CreativeOS"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-1.5">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleField("tagline", e.target.value)}
                placeholder="e.g. Create ads that convert."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Brand Colors */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Brand Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                { field: "primaryColor", label: "Primary Color" },
                { field: "secondaryColor", label: "Secondary Color" },
                { field: "accentColor", label: "Accent Color" },
              ] as const
            ).map(({ field, label }) => (
              <div key={field}>
                <label className="block text-zinc-300 text-sm font-medium mb-1.5">{label}</label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-zinc-700 shrink-0"
                    style={{ backgroundColor: form[field] }}
                  />
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleField(field, e.target.value)}
                    placeholder="#7C3AED"
                    maxLength={7}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Voice & Tone */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Voice &amp; Tone</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TONE_OPTIONS.map((tone) => {
              const active = form.toneOfVoice === tone.value;
              return (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => handleField("toneOfVoice", tone.value)}
                  className={`text-left rounded-lg border px-3 py-3 transition-colors ${
                    active
                      ? "bg-violet-600/20 border-violet-600/50 text-violet-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  <p className="text-sm font-medium">{tone.label}</p>
                  <p className={`text-xs mt-0.5 ${active ? "text-violet-400/80" : "text-zinc-500"}`}>
                    {tone.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Brand Values */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Brand Values</h2>
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-1.5">
              Add values <span className="text-zinc-500 font-normal">(press Enter or comma to add)</span>
            </label>
            {form.brandValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.brandValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-600/30"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => removeValue(val)}
                      className="text-violet-400 hover:text-violet-200 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={handleValueKeyDown}
              placeholder="e.g. Innovation, Sustainability, Trust"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </section>

        {/* Section 5: Claims Management */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Claims Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-1.5">
                Allowed Claims
                <span className="text-zinc-500 font-normal ml-1">(one per line)</span>
              </label>
              <textarea
                value={allowedClaimsText}
                onChange={(e) => setAllowedClaimsText(e.target.value)}
                placeholder={"Clinically tested\nDermatologist approved\nFDA cleared"}
                rows={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-1.5">
                Prohibited Claims
                <span className="text-zinc-500 font-normal ml-1">(one per line)</span>
              </label>
              <textarea
                value={prohibitedClaimsText}
                onChange={(e) => setProhibitedClaimsText(e.target.value)}
                placeholder={"Cures all diseases\nGuaranteed results\n100% risk-free"}
                rows={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section 6: Target Audience */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-base">Target Audience</h2>
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-1.5">
              Describe your ideal customer
            </label>
            <textarea
              value={form.targetAudience}
              onChange={(e) => handleField("targetAudience", e.target.value)}
              placeholder="e.g. Marketing professionals aged 25-45 at DTC brands looking to scale paid social campaigns without a large creative team."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
        </section>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Brand Kit"
          )}
        </button>

      </div>
    </div>
  );
}
