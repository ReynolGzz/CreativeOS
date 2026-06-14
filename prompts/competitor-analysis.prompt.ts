export function buildCompetitorAnalysisPrompt(
  competitorName: string,
  category?: string,
  competitorUrl?: string
): string {
  return `You are an expert competitive intelligence analyst specializing in digital advertising, performance marketing, and creative strategy.

COMPETITOR BRIEF:
- Competitor: ${competitorName}
${competitorUrl ? `- Website: ${competitorUrl}` : ""}
${category ? `- Product Category: ${category}` : ""}

TASK:
Analyze this competitor's advertising strategy and generate a comprehensive competitive intelligence report. Base your analysis on your knowledge of this brand and category, combined with any visual analysis of provided screenshots.

Return ONLY valid JSON matching this exact structure:
{
  "hooks": ["hook pattern 1", "hook pattern 2", "hook pattern 3", "hook pattern 4", "hook pattern 5"],
  "offers": ["offer type 1", "offer type 2", "offer type 3"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3", "CTA 4"],
  "structure": "description of typical ad structure and flow used by this competitor",
  "colors": ["primary brand color", "secondary color", "accent color"],
  "visualStyle": "description of their overall visual aesthetic",
  "emotions": ["emotion 1", "emotion 2", "emotion 3"],
  "audienceType": "description of who they're targeting based on their ads",
  "repeatedPatterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "salesAngles": ["angle 1", "angle 2", "angle 3"],
  "frequentClaims": ["claim 1", "claim 2", "claim 3", "claim 4"],
  "unexploitedOpportunities": [
    "opportunity 1: what they're NOT doing that could work",
    "opportunity 2",
    "opportunity 3",
    "opportunity 4"
  ],
  "summary": "2-3 paragraph executive summary of their creative strategy and what's working",
  "winningPatterns": ["pattern 1", "pattern 2", "pattern 3"],
  "actionableInsights": [
    "insight 1: what you can learn and apply",
    "insight 2",
    "insight 3",
    "insight 4",
    "insight 5"
  ],
  "creativeOpportunities": [
    "opportunity 1: differentiation angle",
    "opportunity 2",
    "opportunity 3"
  ],
  "generatedAdIdeas": [
    {
      "title": "Ad concept title",
      "hook": "Opening hook (inspired by competitor patterns, but original)",
      "headline": "Headline",
      "primaryText": "Full ad copy (2-3 sentences)",
      "cta": "CTA button text",
      "visualConcept": "Describe the visual/image concept (original, not copying their exact ads)",
      "angle": "The strategic angle this ad uses"
    }
    // exactly 10 ad ideas
  ]
}

IMPORTANT: Generate ORIGINAL ad ideas inspired by market patterns — do NOT copy competitor ads exactly. The goal is strategic inspiration, not plagiarism.
Do not include any text outside the JSON object.`;
}
