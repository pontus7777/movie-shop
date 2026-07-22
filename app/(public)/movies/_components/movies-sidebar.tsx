'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'lucide-react'

type SidebarProps = {
  genres: { id: number; name: string }[]
  directors: { id: string; name: string }[]
  actors: { id: string; name: string }[]
  selectedGenres: number[]
  selectedDirectors: string[]
  selectedActors: string[]
}

export function MoviesSidebar({
  genres,
  directors,
  actors,
  selectedGenres,
  selectedDirectors,
  selectedActors,
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const hasActiveFilters =
    selectedGenres.length > 0 || selectedDirectors.length > 0 || selectedActors.length > 0

  function updateParam(key: string, value: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)

    if (checked) {
      if (!current.includes(value)) {
        params.append(key, value)
      }
    } else {
      params.delete(key)
      current.filter((v) => v !== value).forEach((v) => params.append(key, v))
    }

    params.delete('page')

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('genre')
    params.delete('director')
    params.delete('actor')
    params.delete('page')

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <aside className="w-full shrink-0 lg:w-64 lg:self-start lg:sticky lg:top-24">
      <div className="space-y-5 rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        <FilterSection title="Genres">
          {genres.map((genre) => (
            <CheckboxItem
              key={genre.id}
              label={genre.name}
              checked={selectedGenres.includes(genre.id)}
              onChange={(checked) => updateParam('genre', String(genre.id), checked)}
              disabled={isPending}
            />
          ))}
        </FilterSection>

        <FilterSection title="Directors">
          {directors.map((director) => (
            <CheckboxItem
              key={director.id}
              label={director.name}
              checked={selectedDirectors.includes(director.id)}
              onChange={(checked) => updateParam('director', director.id, checked)}
              disabled={isPending}
            />
          ))}
        </FilterSection>

        <FilterSection title="Actors">
          {actors.map((actor) => (
            <CheckboxItem
              key={actor.id}
              label={actor.name}
              checked={selectedActors.includes(actor.id)}
              onChange={(checked) => updateParam('actor', actor.id, checked)}
              disabled={isPending}
            />
          ))}
        </FilterSection>
      </div>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      <div
        className="
          flex gap-2 overflow-x-auto pb-2
          lg:block lg:max-h-56 lg:space-y-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0
        "
      >
        {children}
      </div>
    </section>
  )
}

function CheckboxItem({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled: boolean
}) {
  return (
    <label
      className={`
        flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2
        transition-all hover:bg-muted

        lg:rounded-md lg:border-0 lg:px-2 lg:py-1 lg:hover:bg-muted

        ${checked ? 'border-primary bg-primary/10' : 'border-border'}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden lg:block h-4 w-4 rounded border-border accent-primary"
      />

      <span
        className={`text-sm transition-colors ${
          checked ? 'font-medium text-primary' : 'text-foreground/80'
        }`}
      >
        {label}
      </span>
    </label>
  )
}
