// lib/pricingEngine.ts

export type ComplexityLevel = string;

export interface ComplexityData {
  multiplier?: number;
  fixed_base_price?: number;
  included_units?: number;
  extra_unit_price?: number;
  addon_prices?: Record<string, number>;
  media_url?: string;
  media_type?: 'image' | 'video';
}

export interface PricingConfig {
  id: string;
  category_slug: string;
  display_name: string;
  base_price: number;
  base_unit: string;
  complexities: Record<string, ComplexityData>;
  custom_rules?: {
    volume_threshold: number;
    discounted_base_rate: number;
  } | null;
}

export interface ServiceSelection {
  quantity: number;
  complexity: string;
  addons?: Record<string, any>;
}

// Applies global volume discounts (10%, 15%, 25%)
function getGlobalVolumeDiscount(qty: number): number {
  if (qty >= 21) return 0.25;
  if (qty >= 11) return 0.15;
  if (qty >= 5) return 0.10;
  return 0;
}

export function calculateLineItem(
  config: PricingConfig,
  selection: ServiceSelection
): number {
  const { quantity, complexity, addons } = selection;
  if (quantity <= 0) return 0;

  const complexityData = config.complexities[complexity];
  if (!complexityData) return 0;

  let itemTotal = 0;
  
  // Extract custom units
  const videoCount = addons?.videoCount || 1;
  const variants = addons?.variants || 1;

  // 1. Fixed Package Pricing (For Websites)
  if (complexityData.fixed_base_price !== undefined) {
    itemTotal += complexityData.fixed_base_price;
    
    // Website total units = products * variants
    const effectiveWebUnits = quantity * variants;
    const included = complexityData.included_units || 1;
    
    if (effectiveWebUnits > included && complexityData.extra_unit_price) {
      itemTotal += (effectiveWebUnits - included) * complexityData.extra_unit_price;
    }
  } 
  // 2. Standard Multiplier Pricing (For Video, Graphics, UI/UX, Amazon)
  else {
    let effectiveQuantity = quantity;
    if (config.category_slug === 'video_editing') effectiveQuantity = quantity * videoCount;
    if (config.category_slug === 'amazon_listing') effectiveQuantity = quantity * variants;

    let activeBasePrice = config.base_price;
    let volumeDiscountMultiplier = 1.0;
    
    // Check for custom rules (like Video Editing drops to 800)
    if (config.custom_rules && effectiveQuantity >= config.custom_rules.volume_threshold) {
      activeBasePrice = config.custom_rules.discounted_base_rate;
    } else {
      // If no custom rule, apply the generic volume tier discount
      const discountPercentage = getGlobalVolumeDiscount(effectiveQuantity);
      volumeDiscountMultiplier = 1 - discountPercentage;
    }

    const tierMultiplier = complexityData.multiplier || 1.0;
    itemTotal = (activeBasePrice * tierMultiplier * effectiveQuantity) * volumeDiscountMultiplier;
  }

  // 3. APPLY ADD-ONS (Like Advanced SEO)
  if (addons && complexityData.addon_prices) {
    for (const [addonKey, isSelected] of Object.entries(addons)) {
      if (isSelected === true && complexityData.addon_prices[addonKey]) {
        itemTotal += complexityData.addon_prices[addonKey];
      }
    }
  }

  return itemTotal;
}

export function applyBundleDiscount(subtotal: number, isBundleUnlocked: boolean): number {
  if (!isBundleUnlocked) return subtotal;
  return subtotal - (subtotal * 0.05); 
}