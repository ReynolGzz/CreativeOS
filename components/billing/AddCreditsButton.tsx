"use client";

import { useState } from "react";

type Props = { credits: number; price: string; planName: string };

export default function AddCreditsButton({ credits, price, planName }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch("/api/credits/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: credits }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); window.location.reload(); }, 1500);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading || success}
      className="w-full py-2 rounded-lg text-sm font-medium transition-colors bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white"
    >
      {success ? "✓ Added!" : loading ? "Processing..." : `Buy for ${price}`}
    </button>
  );
}
