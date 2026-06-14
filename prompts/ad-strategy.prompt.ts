import type { ProductAnalysisResult } from "@/types";

export function buildAdStrategyPrompt(
  analysis: ProductAnalysisResult,
  projectName: string,
  platform: string,
  visualStyle: string,
  targetAudience?: string
): string {
  return `You are a world-class performance marketing strategist and creative director. You specialize in creating high-converting ad creatives for DTC brands across Meta, TikTok, Instagram, and Google.

PRODUCT BRIEF:
- Product: ${projectName}
- Category: ${analysis.category}
- Product Type: ${analysis.productType}
- Key Benefits: ${analysis.benefits.join(", ")}
- Target Audience: ${targetAudience || analysis.probableAudience}
- Sales Angles: ${analysis.salesAngles.join("; ")}
- Customer Objections: ${analysis.customerObjections.join("; ")}
- Positioning Opportunities: ${analysis.positioningOpportunities.join("; ")}
- Platform: ${platform}
- Visual Style Preference: ${visualStyle}

TASK:
Generate exactly 10 distinct ad creatives, each using a different angle. Each ad must be crafted for maximum performance on the specified platform.

AD TYPES (use exactly these, in this order):
1. PROBLEM_SOLUTION
2. LUXURY_PREMIUM
3. SOCIAL_PROOF
4. OFFER_DISCOUNT
5. BEFORE_AFTER
6. UGC_STYLE
7. MINIMAL_PRODUCT
8. LIFESTYLE
9. COMPARISON
10. URGENCY_FOMO

Return ONLY valid JSON matching this exact structure:
{
  "ads": [
    {
      "adType": "PROBLEM_SOLUTION",
      "angle": "specific creative angle for this ad",
      "hook": "attention-grabbing opening line (max 15 words, scroll-stopping)",
      "headline": "powerful headline (max 10 words)",
      "primaryText": "full ad copy body (2-4 sentences, persuasive, benefit-focused, with implicit or explicit CTA)",
      "cta": "call-to-action button text (2-4 words)",
      "imagePrompt": "detailed visual prompt for image generation (describe scene, lighting, mood, product placement, style — 50-80 words)",
      "format": "SQUARE_1080 or STORY_1080x1920 or LANDSCAPE_1200x628",
      "platform": "${platform}",
      "reasoning": "1-2 sentences explaining why this creative angle works for this product and audience"
    }
    // ... 9 more ads
  ]
}

Rules:
- Each ad must feel completely different in tone and approach
- Hooks must be native to platform (TikTok = casual/fast, Meta = direct/benefit-led, Instagram = aspirational)
- Image prompts must be highly specific and describe scenes that naturally feature the product
- Do not use placeholder text — write real, production-ready copy
- Do not include any text outside the JSON object`;
}
