import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type Props = {
  title: string
  genres: { id: number; name: string }[]
  value: number[]
  onChange: (value: number[]) => void
}

export function GenreSelector({ title, genres, value, onChange }: Props) {
  const toggleGenre = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((g) => g !== id))
    } else {
      onChange([...value, id])
    }
  }

  const selectedGenres = genres.filter((g) => value.includes(g.id)).map((g) => g.name)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{title}</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedGenres.length > 0 ? selectedGenres.join(', ') : 'Select genres'}

            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-2">
          <div className="space-y-2">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent cursor-pointer"
                onClick={() => toggleGenre(genre.id)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={value.includes(genre.id)}
                    onCheckedChange={() => {
                      // prevent double toggle when clicking checkbox
                      toggleGenre(genre.id)
                    }}
                    onClick={(e) => e.stopPropagation()} // important!
                  />

                  <span>{genre.name}</span>
                </div>

                {value.includes(genre.id) && <Check className="h-4 w-4 text-primary" />}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
