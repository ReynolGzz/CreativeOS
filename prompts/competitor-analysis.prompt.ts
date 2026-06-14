export function buildCompetitorAnalysisPrompt(
  competitorName: string,
  category?: string,
  competitorUrl?: string
): string {
  return `You are an expert competitive intelligence analyst specializing in digital advertising and performance marketing.

COMPETITOR BRIEF:
- Competitor: ${competitorName}
${competitorUrl ? `- Website: ${competitorUrl}` : ""}
${category ? `- Product Category: ${category}` : ""}

Analyze this competitor's advertising strategy and return ONLY valid JSON:
{
  "hooks": ["hook pattern 1", "hook pattern 2", "hook pattern 3", "hook pattern 4", "hook pattern 5"],
  "offers": ["offer type 1", "offer type 2", "offer type 3"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3", "CTA 4"],
  "structure": "description of typical ad structure",
  "colors": ["primary brand color", "secondary color", "accent color"],
  "visualStyle": "description of their overall visual aesthetic",
  "emotions": ["emotion 1", "emotion 2", "emotion 3"],
  "audienceType": "description of who they're targeting",
  "repeatedPatterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "salesAngles": ["angle 1", "angle 2", "angle 3"],
  "frequentClaims": ["claim 1", "claim 2", "claim 3", "claim 4"],
  "unexploitedOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"],
  "summary": "2-3 paragraph executive summary of their creative strategy",
  "winningPatterns": ["pattern 1", "pattern 2", "pattern 3"],
  "actionableInsights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "creativeOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "generatedAdIdeas": [
    {
      "title": "Ad concept title",
      "hook": "Opening hook (original, inspired by market patterns)",
      "headline": "Headline",
      "primaryText": "Full ad copy (2-3 sentences)",
      "cta": "CTA button text",
      "visualConcept": "Describe the visual/image concept",
      "angle": "The strategic angle this ad uses"
    }
  ]
}

Generate ORIGINAL ad ideas inspired by market patterns — do NOT copy competitor ads exactly.
Do not include any text outside the JSON object.`;
}
