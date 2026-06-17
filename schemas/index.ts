import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  productDescription: z.string().max(500).optional(),
  targetAudience: z.string().max(200).optional(),
  platform: z.enum(["META", "TIKTOK", "INSTAGRAM", "GOOGLE_DISPLAY"]).default("META"),
  visualStyle: z
    .enum(["PREMIUM", "UGC", "MINIMAL", "LUXURY", "BOLD", "FITNESS", "SKINCARE", "ECOMMERCE"])
    .default("PREMIUM"),
  productUrl: z.string().url().optional().or(z.literal("")),
  competitors: z.array(z.string()).default([]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const analyzeProductSchema = z.object({
  projectId: z.string().cuid(),
  imageUrl: z.string().url(),
});

export const generateStrategySchema = z.object({
  projectId: z.string().cuid(),
});

export const generateAdImageSchema = z.object({
  adCreativeId: z.string().cuid(),
});

export const generateFullPackSchema = z.object({
  projectId: z.string().cuid(),
});

export const regenerateAdSchema = z.object({
  adCreativeId: z.string().cuid(),
  newHeadline: z.string().optional(),
  newCopy: z.string().optional(),
  newCta: z.string().optional(),
});

export const consumeCreditsSchema = z.object({
  operation: z.enum([
    "ANALYZE_PRODUCT",
    "GENERATE_STRATEGY",
    "GENERATE_IMAGE",
    "GENERATE_FULL_PACK",
    "ANALYZE_COMPETITOR",
    "PURCHASE",
    "BONUS",
  ]),
  projectId: z.string().cuid().optional(),
});

export const analyzeCompetitorSchema = z.object({
  competitorName: z.string().min(1).max(100),
  competitorUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().max(100).optional(),
  screenshots: z.array(z.string().url()).default([]),
});

export const exportPngSchema = z.object({
  adCreativeId: z.string().cuid(),
});

export const exportZipSchema = z.object({
  projectId: z.string().cuid(),
});

export const productAnalysisResponseSchema = z.object({
  productType: z.string(),
  colors: z.array(z.string()),
  materials: z.array(z.string()),
  category: z.string(),
  benefits: z.array(z.string()),
  probableAudience: z.string(),
  recommendedStyle: z.string(),
  salesAngles: z.array(z.string()),
  customerObjections: z.array(z.string()),
  positioningOpportunities: z.array(z.string()),
});

export const adStrategyItemSchema = z.object({
  adType: z.string(),
  angle: z.string(),
  hook: z.string(),
  headline: z.string(),
  primaryText: z.string(),
  cta: z.string(),
  imagePrompt: z.string(),
  format: z.string(),
  platform: z.string(),
  reasoning: z.string(),
  platformVariants: z
    .object({
      META: z
        .object({
          headline: z.string(),
          primaryText: z.string(),
          description: z.string(),
          cta: z.string(),
        })
        .optional(),
      TIKTOK: z
        .object({
          hook: z.string(),
          caption: z.string(),
          hashtags: z.array(z.string()),
        })
        .optional(),
      INSTAGRAM: z
        .object({
          caption: z.string(),
          storyText: z.string(),
        })
        .optional(),
      GOOGLE_DISPLAY: z
        .object({
          headline: z.string(),
          description: z.string(),
          longHeadline: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export const adStrategyResponseSchema = z.object({
  ads: z.array(adStrategyItemSchema).length(10),
});

export const competitorInsightResponseSchema = z.object({
  hooks: z.array(z.string()),
  offers: z.array(z.string()),
  ctas: z.array(z.string()),
  structure: z.string(),
  colors: z.array(z.string()),
  visualStyle: z.string(),
  emotions: z.array(z.string()),
  audienceType: z.string(),
  repeatedPatterns: z.array(z.string()),
  salesAngles: z.array(z.string()),
  frequentClaims: z.array(z.string()),
  unexploitedOpportunities: z.array(z.string()),
  summary: z.string(),
  winningPatterns: z.array(z.string()),
  actionableInsights: z.array(z.string()),
  creativeOpportunities: z.array(z.string()),
  generatedAdIdeas: z.array(
    z.object({
      title: z.string(),
      hook: z.string(),
      headline: z.string(),
      primaryText: z.string(),
      cta: z.string(),
      visualConcept: z.string(),
      angle: z.string(),
    })
  ),
});
