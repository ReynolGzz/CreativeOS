export function buildImageGenerationPrompt(
  adType: string,
  imagePrompt: string,
  productType: string,
  colors: string[],
  format: string
): string {
  const formatInstructions: Record<string, string> = {
    SQUARE_1080: "square format (1:1 aspect ratio)",
    STORY_1080x1920: "vertical story format (9:16 aspect ratio)",
    LANDSCAPE_1200x628: "landscape banner format (1.91:1 aspect ratio)",
  };

  const styleInstructions: Record<string, string> = {
    PROBLEM_SOLUTION: "Clean, clear contrast visual. Professional lighting.",
    LUXURY_PREMIUM: "High-end editorial photography. Dramatic lighting, rich textures, minimalist composition.",
    SOCIAL_PROOF: "Authentic, real-feeling. Warm tones. People-focused.",
    OFFER_DISCOUNT: "Bold, eye-catching. High contrast. Bright accent colors.",
    BEFORE_AFTER: "Split composition or dramatic transformation. Clear visual contrast.",
    UGC_STYLE: "Raw, authentic, smartphone-quality aesthetic. Natural lighting.",
    MINIMAL_PRODUCT: "Clean white or neutral background. Product hero shot. Studio lighting.",
    LIFESTYLE: "Aspirational lifestyle photography. Natural light. Beautiful environment.",
    COMPARISON: "Side-by-side or clear comparison visual. Clean presentation.",
    URGENCY_FOMO: "Dynamic, energetic composition. Bold colors. Sense of excitement.",
  };

  return `${imagePrompt}

Product details: ${productType}. Primary colors in product: ${colors.slice(0, 3).join(", ")}.
Visual style: ${styleInstructions[adType] || "Professional advertising photography."}
Format: ${formatInstructions[format] || "square format"}.
The product must be prominently featured and instantly recognizable.
Style: Premium advertising photography. No text overlays. Photorealistic.`;
}
