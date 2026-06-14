import type {
  User,
  Project,
  ProductImage,
  ProductAnalysis,
  AdStrategy,
  AdCreative,
  GeneratedImage,
  CreditBalance,
  CreditUsage,
  CompetitorResearch,
  CompetitorAdInsight,
  Export,
  Platform,
  VisualStyle,
  ProjectStatus,
  AdType,
  AdStatus,
  AdFormat,
  CreditOperation,
  ResearchStatus,
  ExportType,
} from "@prisma/client";

export type {
  User,
  Project,
  ProductImage,
  ProductAnalysis,
  AdStrategy,
  AdCreative,
  GeneratedImage,
  CreditBalance,
  CreditUsage,
  CompetitorResearch,
  CompetitorAdInsight,
  Export,
  Platform,
  VisualStyle,
  ProjectStatus,
  AdType,
  AdStatus,
  AdFormat,
  CreditOperation,
  ResearchStatus,
  ExportType,
};

export type ProjectWithDetails = Project & {
  productImages: ProductImage[];
  productAnalysis: ProductAnalysis | null;
  adStrategy: (AdStrategy & { adCreatives: AdCreativeWithImage[] }) | null;
  adCreatives: AdCreativeWithImage[];
  _count?: { adCreatives: number };
};

export type AdCreativeWithImage = AdCreative & {
  generatedImage: GeneratedImage | null;
};

export type CompetitorResearchWithInsight = CompetitorResearch & {
  insight: CompetitorAdInsight | null;
};

export type ProductAnalysisResult = {
  productType: string;
  colors: string[];
  materials: string[];
  category: string;
  benefits: string[];
  probableAudience: string;
  recommendedStyle: string;
  salesAngles: string[];
  customerObjections: string[];
  positioningOpportunities: string[];
};

export type AdStrategyItem = {
  adType: string;
  angle: string;
  hook: string;
  headline: string;
  primaryText: string;
  cta: string;
  imagePrompt: string;
  format: string;
  platform: string;
  reasoning: string;
};

export type AdStrategyResult = {
  ads: AdStrategyItem[];
};

export type CompetitorInsightResult = {
  hooks: string[];
  offers: string[];
  ctas: string[];
  structure: string;
  colors: string[];
  visualStyle: string;
  emotions: string[];
  audienceType: string;
  repeatedPatterns: string[];
  salesAngles: string[];
  frequentClaims: string[];
  unexploitedOpportunities: string[];
  summary: string;
  winningPatterns: string[];
  actionableInsights: string[];
  creativeOpportunities: string[];
  generatedAdIdeas: Array<{
    title: string;
    hook: string;
    headline: string;
    primaryText: string;
    cta: string;
    visualConcept: string;
    angle: string;
  }>;
};

export type FormatDimensions = {
  width: number;
  height: number;
  label: string;
};

export const FORMAT_DIMENSIONS: Record<string, FormatDimensions> = {
  SQUARE_1080: { width: 1080, height: 1080, label: "Square 1:1" },
  STORY_1080x1920: { width: 1080, height: 1920, label: "Story 9:16" },
  LANDSCAPE_1200x628: { width: 1200, height: 628, label: "Landscape 1.91:1" },
};
