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
    volume_threshold?: number;
    discounted_base_rate?: number;
    has_video_slider?: boolean;     // NEW: Dynamic UI flag
    has_variant_slider?: boolean;   // NEW: Dynamic UI flag
    has_seo_addon?: boolean;        // NEW: Dynamic UI flag
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

  // 1. Fixed Package Pricing (For Websites, Branding/Logos)
  if (complexityData.fixed_base_price !== undefined) {
    
    // SCENARIO A: It is a "Package" with included units (e.g., Service Websites)
    if (complexityData.included_units !== undefined) {
      itemTotal += complexityData.fixed_base_price;
      
      const effectiveWebUnits = quantity * variants;
      if (effectiveWebUnits > complexityData.included_units && complexityData.extra_unit_price) {
        itemTotal += (effectiveWebUnits - complexityData.included_units) * complexityData.extra_unit_price;
      }
    } 
    // SCENARIO B: It is a flat-rate per item (e.g., Logos & Branding)
    else {
      let effectiveQuantity = quantity;
      
      // FIX: Force the Fixed Price to respect your Admin UI Sliders!
      if (config.custom_rules?.has_video_slider) effectiveQuantity = quantity * videoCount;
      if (config.custom_rules?.has_variant_slider) effectiveQuantity = quantity * variants;

      itemTotal += complexityData.fixed_base_price * effectiveQuantity;
    }
    
  } 
  // 2. Standard Multiplier Pricing (For Video, Graphics, UI/UX, Amazon, etc.)
  else {
    let effectiveQuantity = quantity;
    
    // Dynamic check instead of hardcoded category slug
    if (config.custom_rules?.has_video_slider) effectiveQuantity = quantity * videoCount;
    if (config.custom_rules?.has_variant_slider) effectiveQuantity = quantity * variants;

    let activeBasePrice = config.base_price;
    let volumeDiscountMultiplier = 1.0;
    
    // Check for custom rules (like a specific service volume threshold override)
    if (config.custom_rules && config.custom_rules.volume_threshold && effectiveQuantity >= config.custom_rules.volume_threshold) {
      activeBasePrice = config.custom_rules.discounted_base_rate || config.base_price;
    } else {
      // If no custom rule override, apply the generic volume tier discount
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