export function buildProductAnalysisPrompt(
  productDescription?: string,
  targetAudience?: string
): string {
  return `You are an expert product analyst and advertising strategist with deep expertise in e-commerce, DTC brands, and performance marketing.

Analyze the product image provided and return a comprehensive product analysis in valid JSON format.

${productDescription ? `Additional product context: ${productDescription}` : ""}
${targetAudience ? `Target audience hint: ${targetAudience}` : ""}

Return ONLY valid JSON matching this exact structure:
{
  "productType": "specific product type (e.g., Hydrating Face Serum, Wireless Earbuds)",
  "colors": ["primary color", "secondary color"],
  "materials": ["material 1", "material 2"],
  "category": "product category (e.g., Skincare, Electronics, Apparel)",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "probableAudience": "detailed description of the ideal customer",
  "recommendedStyle": "best visual ad style for this product",
  "salesAngles": [
    "angle 1: emotional hook",
    "angle 2: functional benefit",
    "angle 3: social proof potential",
    "angle 4: problem/solution",
    "angle 5: lifestyle aspiration"
  ],
  "customerObjections": ["objection 1", "objection 2", "objection 3"],
  "positioningOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
}

Be specific, actionable, and marketing-focused. Do not include any text outside the JSON object.`;
}
