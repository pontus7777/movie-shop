'use client'

import { Button } from '@/components/ui/button'
import { FilterSection } from './filter-selection'
import { CheckboxFilter } from './checkbox-filter'
import { useFilterParams } from './use-filter-params'
import { RangeSlider } from './range-slider'

type Props = {
  genres: { id: number; name: string }[]
  directors: { id: string; name: string }[]
  actors: { id: string; name: string }[]

  selectedGenres: number[]
  selectedDirectors: string[]
  selectedActors: string[]

  yearFrom?: string
  yearTo?: string
  runtimeMin?: string
  runtimeMax?: string
}
const CURRENT_YEAR = new Date().getFullYear()

export function MoviesSidebar({
  genres,
  directors,
  actors,
  selectedGenres,
  selectedDirectors,
  selectedActors,
  yearFrom,
  yearTo,
  runtimeMin,
  runtimeMax,
}: Props) {
  const { updateParam, updateRangeParam, clearParams } = useFilterParams()
  return (
    <aside className="w-full lg:w-64">
      <div className="space-y-5 rounded-xl border p-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Filters</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              clearParams([
                'genre',
                'director',
                'actor',
                'yearFrom',
                'yearTo',
                'runtimeMin',
                'runtimeMax',
              ])
            }
          >
            Clear
          </Button>
        </div>

        <FilterSection title="Genres">
          <CheckboxFilter
            items={genres}
            selected={selectedGenres.map(String)}
            onChange={(id) => updateParam('genre', id, !selectedGenres.includes(Number(id)))}
          />
        </FilterSection>

        <FilterSection title="Directors">
          <CheckboxFilter
            items={directors}
            selected={selectedDirectors}
            onChange={(id) => updateParam('director', id, !selectedDirectors.includes(id))}
          />
        </FilterSection>

        <FilterSection title="Actors">
          <CheckboxFilter
            items={actors}
            selected={selectedActors}
            onChange={(id) => updateParam('actor', id, !selectedActors.includes(id))}
          />
        </FilterSection>

        <FilterSection title="Release Year" scroll={false}>
          <RangeSlider
            value={[Number(yearFrom ?? 1950), Number(yearTo ?? CURRENT_YEAR)]}
            min={1950}
            max={CURRENT_YEAR}
            onChange={(value) => updateRangeParam('yearFrom', 'yearTo', value)}
          />
        </FilterSection>

        <FilterSection title="Runtime" scroll={false}>
          <RangeSlider
            value={[Number(runtimeMin ?? 60), Number(runtimeMax ?? 240)]}
            min={60}
            max={300}
            step={5}
            onChange={(value) => updateRangeParam('runtimeMin', 'runtimeMax', value)}
          />
        </FilterSection>
      </div>
    </aside>
  )
}
