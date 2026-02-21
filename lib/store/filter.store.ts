import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const FILTER_KEY = 'sbornitsa-filter'

interface FilterState {
  selectedCategoryIds: string[]
  toggleCategory: (id: string) => void
  reset: () => void
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    set => ({
      selectedCategoryIds: [],

      toggleCategory: (id: string) => {
        set(state => {
          const activeIds = new Set(state.selectedCategoryIds)
          if (activeIds.has(id)) {
            activeIds.delete(id)
          } else {
            activeIds.add(id)
          }
          return { selectedCategoryIds: Array.from(activeIds).sort() }
        })
      },

      reset: () => {
        set({ selectedCategoryIds: [] })
      },

      hydrated: false,
      setHydrated: (state: boolean) => {
        set({ hydrated: state })
      },
    }),
    {
      name: FILTER_KEY,
      onRehydrateStorage: () => state => {
        state?.setHydrated(true)
      },
    }
  )
)

export const useSelectedCategoryIds = () => useFilterStore(state => state.selectedCategoryIds)
export const useToggleCategory = () => useFilterStore(state => state.toggleCategory)
export const useFilterHydrated = () => useFilterStore(state => state.hydrated)
