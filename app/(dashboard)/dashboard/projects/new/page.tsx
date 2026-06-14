"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Upload, Check } from "lucide-react";

const PLATFORMS = ["META", "TIKTOK", "INSTAGRAM", "GOOGLE_DISPLAY"];
const VISUAL_STYLES = ["PREMIUM", "UGC", "MINIMAL", "LUXURY", "BOLD", "FITNESS", "SKINCARE", "ECOMMERCE"];
const STEP_LABELS = ["Basics", "Targeting", "Upload", "Confirm"];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    productDescription: "",
    targetAudience: "",
    platform: "META",
    visualStyle: "PREMIUM",
    productUrl: "",
    competitors: [] as string[],
  });
  const [competitorInput, setCompetitorInput] = useState("");

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addCompetitor() {
    if (competitorInput.trim() && form.competitors.length < 5) {
      setForm((prev) => ({ ...prev, competitors: [...prev.competitors, competitorInput.trim()] }));
      setCompetitorInput("");
    }
  }

  function removeCompetitor(i: number) {
    setForm((prev) => ({ ...prev, competitors: prev.competitors.filter((_, idx) => idx !== i) }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be smaller than 4MB");
      return;
    }
    setUploadLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/product-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
      setImageKey(data.key);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productUrl: form.productUrl || undefined }),
      });
      const projectData = await projectRes.json();
      if (!projectRes.ok) throw new Error(projectData.error);

      const projectId = projectData.project.id;

      if (imageUrl) {
        await fetch("/api/upload/product-image/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, url: imageUrl, key: imageKey }),
        });
      }

      router.push(`/dashboard/projects/${projectId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const canProceed = [form.name.trim().length > 0, true, true, form.name.trim().length > 0][step];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                i < step ? "bg-violet-600 text-white" : i === step ? "bg-violet-600/20 text-violet-400 border border-violet-600/40" : "bg-zinc-800 text-zinc-500"
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "text-white" : "text-zinc-500"}`}>{label}</span>
              {i < STEP_LABELS.length - 1 && <div className="w-8 h-px bg-zinc-700 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Project Basics</h2>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Product Name *</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. HydraGlow Face Serum" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Product Description</label>
              <textarea value={form.productDescription} onChange={(e) => update("productDescription", e.target.value)} placeholder="Describe your product..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Product URL</label>
              <input value={form.productUrl} onChange={(e) => update("productUrl", e.target.value)} placeholder="https://..." type="url" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Targeting & Style</h2>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Target Audience</label>
              <textarea value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="e.g. Women 25-40 interested in skincare..." rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => update("platform", p)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${ form.platform === p ? "bg-violet-600/20 border-violet-600/40 text-violet-400" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600" }`}>{p.replace("_", " ")}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Visual Style</label>
              <div className="grid grid-cols-4 gap-2">
                {VISUAL_STYLES.map((s) => (
                  <button key={s} onClick={() => update("visualStyle", s)} className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${ form.visualStyle === s ? "bg-violet-600/20 border-violet-600/40 text-violet-400" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600" }`}>{s.charAt(0) + s.slice(1).toLowerCase()}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-1.5">Competitors (optional)</label>
              <div className="flex gap-2">
                <input value={competitorInput} onChange={(e) => setCompetitorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCompetitor()} placeholder="Add competitor brand" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                <button onClick={addCompetitor} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">Add</button>
              </div>
              {form.competitors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.competitors.map((c, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">{c}<button onClick={() => removeCompetitor(i)} className="text-zinc-500 hover:text-white">×</button></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Product Image</h2>
            <p className="text-zinc-400 text-sm">Upload a clear photo of your product.</p>
            {imageUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Product" className="w-full h-64 object-contain rounded-xl bg-zinc-800 border border-zinc-700" />
                <button onClick={() => { setImageUrl(""); setImageKey(""); }} className="absolute top-2 right-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded-full w-8 h-8 flex items-center justify-center text-sm">×</button>
                <p className="text-green-400 text-sm mt-2 flex items-center gap-1.5"><Check className="w-4 h-4" /> Image uploaded successfully</p>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${ uploadLoading ? "border-zinc-600 bg-zinc-800/50" : "border-zinc-700 hover:border-violet-600/50 bg-zinc-800/30 hover:bg-zinc-800/60" }`}>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadLoading} />
                {uploadLoading ? (
                  <div className="text-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-zinc-400 text-sm">Uploading...</p></div>
                ) : (
                  <div className="text-center"><Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" /><p className="text-zinc-300 text-sm font-medium">Drop image here or click to browse</p><p className="text-zinc-500 text-xs mt-1">PNG, JPG, WEBP up to 4MB</p></div>
                )}
              </label>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Confirm & Create</h2>
            <div className="space-y-3">
              {[
                { label: "Product", value: form.name },
                { label: "Platform", value: form.platform },
                { label: "Style", value: form.visualStyle },
                { label: "Audience", value: form.targetAudience || "Auto-detected by AI" },
                { label: "Image", value: imageUrl ? "✓ Uploaded" : "Not uploaded (can add later)" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-zinc-800 text-sm">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-violet-600/10 border border-violet-600/20 rounded-lg p-4 text-sm text-violet-300">
              After creating, you&apos;ll be taken to the project page where you can analyze your product and generate 10 AI-powered ad creatives.
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800">
          <button onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard/projects")} className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < STEP_LABELS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || !form.name.trim()} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              {loading ? "Creating..." : "Create Project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
