// store/useEstimatorStore.ts
import { create } from 'zustand';
import { ServiceSelection } from '@/lib/pricingEngine';

interface EstimatorState {
  selections: Record<string, ServiceSelection>;

  setSelection: (serviceId: string, payload: ServiceSelection) => void;
  toggleAddon: (serviceId: string, addonKey: string) => void;
  removeSelection: (serviceId: string) => void;
  resetEstimator: () => void;
}

export const useEstimatorStore = create<EstimatorState>((set) => ({
  selections: {},

  setSelection: (serviceId, payload) =>
    set((state) => {
      if (payload.quantity <= 0) {
        const newSelections = { ...state.selections };
        delete newSelections[serviceId];
        return { selections: newSelections };
      }
      
      // Preserve existing addons if they are just changing the quantity/complexity slider
      const existingAddons = state.selections[serviceId]?.addons || {};
      
      return {
        selections: {
          ...state.selections,
          [serviceId]: { ...payload, addons: payload.addons || existingAddons },
        },
      };
    }),

  // Dedicated function for clicking the SEO checkbox
  toggleAddon: (serviceId, addonKey) =>
    set((state) => {
      const currentSelection = state.selections[serviceId];
      if (!currentSelection) return state; // Can't add SEO if they haven't selected a website yet!

      const currentAddons = currentSelection.addons || {};
      const isCurrentlyActive = !!currentAddons[addonKey];

      return {
        selections: {
          ...state.selections,
          [serviceId]: {
            ...currentSelection,
            addons: {
              ...currentAddons,
              [addonKey]: !isCurrentlyActive, // Flips true to false, or false to true
            },
          },
        },
      };
    }),

  removeSelection: (serviceId) =>
    set((state) => {
      const newSelections = { ...state.selections };
      delete newSelections[serviceId];
      return { selections: newSelections };
    }),

  resetEstimator: () => set({ selections: {} }),
}));