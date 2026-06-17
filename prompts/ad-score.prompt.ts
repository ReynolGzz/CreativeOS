export function buildAdScorePrompt(ad: {
  headline: string;
  hook: string;
  primaryText: string;
  cta: string;
  adType: string;
  platform: string;
}): string {
  return `You are a senior performance marketing analyst specializing in paid social creative evaluation. Score this ad creative objectively based on best practices for direct-response advertising.

AD CREATIVE TO SCORE:
- Ad Type: ${ad.adType}
- Platform: ${ad.platform}
- Hook: "${ad.hook}"
- Headline: "${ad.headline}"
- Body Copy: "${ad.primaryText}"
- CTA: "${ad.cta}"

SCORING CRITERIA:

1. hookStrength (1-10): Does the hook immediately grab attention? Does it create curiosity, urgency, or emotional resonance within the first 3 seconds? 10 = immediately scroll-stopping, 1 = generic and ignorable.

2. clarity (1-10): Is the value proposition crystal clear? Can the reader immediately understand what's being offered and why they should care? 10 = instantly understood, 1 = confusing or vague.

3. scrollStop (1-10): Combined assessment of whether hook + headline would stop a thumb mid-scroll on ${ad.platform}. Consider pattern interrupts, emotional triggers, and relevance to the platform audience. 10 = must stop and read, 1 = easily ignored.

4. ctaStrength (1-10): How compelling is the CTA? Does it create urgency, reduce friction, and match the offer? 10 = irresistible next step, 1 = generic or mismatched.

5. overallScore (0-100): Weighted composite score. Weight: hookStrength x 0.30 + clarity x 0.20 + scrollStop x 0.25 + ctaStrength x 0.25, then multiply by 10. Round to nearest integer.

6. policyRisk: Assess risk of violating Meta/TikTok advertising policies. Look for: before/after claims, guaranteed results, excessive urgency, health claims without disclaimers, misleading superlatives. Return exactly one of: "low", "medium", or "high".

7. summary: 1-2 sentences summarizing the overall creative quality and its likely performance.

8. suggestions: Array of exactly 3 specific, actionable improvements that would increase performance. Each suggestion should be concrete (e.g., "Replace the CTA 'Learn More' with 'Get 30% Off Today' to create urgency" not just "improve the CTA").

Return ONLY valid JSON:
{
  "hookStrength": <1-10>,
  "clarity": <1-10>,
  "scrollStop": <1-10>,
  "ctaStrength": <1-10>,
  "overallScore": <0-100>,
  "policyRisk": "low" | "medium" | "high",
  "summary": "...",
  "suggestions": ["...", "...", "..."]
}`;
}
