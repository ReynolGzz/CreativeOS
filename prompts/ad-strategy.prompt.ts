import type { ProductAnalysisResult } from "@/types";

export function buildAdStrategyPrompt(
  analysis: ProductAnalysisResult,
  projectName: string,
  platform: string,
  visualStyle: string,
  targetAudience?: string
): string {
  return `You are a world-class performance marketing strategist and creative director.

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

TASK: Generate exactly 10 distinct ad creatives using these AD TYPES in order:
1. PROBLEM_SOLUTION 2. LUXURY_PREMIUM 3. SOCIAL_PROOF 4. OFFER_DISCOUNT 5. BEFORE_AFTER
6. UGC_STYLE 7. MINIMAL_PRODUCT 8. LIFESTYLE 9. COMPARISON 10. URGENCY_FOMO

Return ONLY valid JSON:
{
  "ads": [
    {
      "adType": "PROBLEM_SOLUTION",
      "angle": "specific creative angle",
      "hook": "attention-grabbing opening (max 15 words)",
      "headline": "powerful headline (max 10 words)",
      "primaryText": "full ad copy body (2-4 sentences)",
      "cta": "CTA button text (2-4 words)",
      "imagePrompt": "detailed visual prompt for image generation (50-80 words)",
      "format": "SQUARE_1080 or STORY_1080x1920 or LANDSCAPE_1200x628",
      "platform": "${platform}",
      "reasoning": "why this angle works for this product"
    }
  ]
}

Do not use placeholder text. Write real, production-ready copy. Do not include text outside the JSON.`;
}
