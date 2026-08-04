'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion } from '@/components/ui/accordion'
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

  showHeading?: boolean
}
const CURRENT_YEAR = new Date().getFullYear()

const ALL_SECTIONS = ['genres', 'directors', 'actors', 'year', 'runtime']

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="max-w-40">
      <span className="truncate">{label}</span>
      <button
        type="button"
        data-icon="inline-end"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}

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
  showHeading = true,
}: Props) {
  const { updateParam, updateRangeParam, clearParams } = useFilterParams()

  const hasYearFilter = Boolean(yearFrom || yearTo)
  const hasRuntimeFilter = Boolean(runtimeMin || runtimeMax)

  const activeFilterCount =
    selectedGenres.length +
    selectedDirectors.length +
    selectedActors.length +
    (hasYearFilter ? 1 : 0) +
    (hasRuntimeFilter ? 1 : 0)

  const selectedGenreItems = genres.filter((g) => selectedGenres.includes(g.id))
  const selectedDirectorItems = directors.filter((d) => selectedDirectors.includes(d.id))
  const selectedActorItems = actors.filter((a) => selectedActors.includes(a.id))

  return (
    <aside className="w-full">
      <div className="space-y-4 rounded-xl border p-4">
        {(showHeading || activeFilterCount > 0) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {showHeading && <h2 className="font-semibold">Filters</h2>}

              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </div>

            {activeFilterCount > 0 && (
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
            )}
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedGenreItems.map((g) => (
              <FilterChip
                key={`genre-${g.id}`}
                label={g.name}
                onRemove={() => updateParam('genre', String(g.id), false)}
              />
            ))}

            {selectedDirectorItems.map((d) => (
              <FilterChip
                key={`director-${d.id}`}
                label={d.name}
                onRemove={() => updateParam('director', d.id, false)}
              />
            ))}

            {selectedActorItems.map((a) => (
              <FilterChip
                key={`actor-${a.id}`}
                label={a.name}
                onRemove={() => updateParam('actor', a.id, false)}
              />
            ))}

            {hasYearFilter && (
              <FilterChip
                label={`Year ${yearFrom ?? 1950}–${yearTo ?? CURRENT_YEAR}`}
                onRemove={() => clearParams(['yearFrom', 'yearTo'])}
              />
            )}

            {hasRuntimeFilter && (
              <FilterChip
                label={`Runtime ${runtimeMin ?? 60}–${runtimeMax ?? 240}m`}
                onRemove={() => clearParams(['runtimeMin', 'runtimeMax'])}
              />
            )}
          </div>
        )}

        <Accordion type="multiple" defaultValue={ALL_SECTIONS}>
          <FilterSection title="Genres" value="genres">
            <CheckboxFilter
              items={genres}
              selected={selectedGenres.map(String)}
              onChange={(id) => updateParam('genre', id, !selectedGenres.includes(Number(id)))}
            />
          </FilterSection>

          <FilterSection title="Directors" value="directors">
            <CheckboxFilter
              items={directors}
              selected={selectedDirectors}
              onChange={(id) => updateParam('director', id, !selectedDirectors.includes(id))}
            />
          </FilterSection>

          <FilterSection title="Actors" value="actors">
            <CheckboxFilter
              items={actors}
              selected={selectedActors}
              onChange={(id) => updateParam('actor', id, !selectedActors.includes(id))}
            />
          </FilterSection>

          <FilterSection title="Release Year" value="year" scroll={false}>
            <RangeSlider
              value={[Number(yearFrom ?? 1950), Number(yearTo ?? CURRENT_YEAR)]}
              min={1950}
              max={CURRENT_YEAR}
              onChange={(value) => updateRangeParam('yearFrom', 'yearTo', value)}
            />
          </FilterSection>

          <FilterSection title="Runtime" value="runtime" scroll={false}>
            <RangeSlider
              value={[Number(runtimeMin ?? 60), Number(runtimeMax ?? 240)]}
              min={60}
              max={300}
              step={5}
              onChange={(value) => updateRangeParam('runtimeMin', 'runtimeMax', value)}
            />
          </FilterSection>
        </Accordion>
      </div>
    </aside>
  )
}
