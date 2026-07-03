'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
      if (!current.includes(value)) params.append(key, value)
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
    <aside className="w-60 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filter</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Genre">
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

      <FilterSection title="Director">
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

      <FilterSection title="Actor">
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
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">{children}</div>
    </div>
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
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-border accent-purple-600"
      />
      <span className="text-sm group-hover:text-foreground text-foreground/80 truncate">
        {label}
      </span>
    </label>
  )
}
