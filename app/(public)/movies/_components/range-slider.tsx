'use client'

import { Slider } from '@/components/ui/slider'
import { useRef, useState } from 'react'

type Props = {
  value: [number, number]
  min: number
  max: number
  step?: number
  onChange: (value: [number, number]) => void
}

export function RangeSlider({ value, min, max, step = 1, onChange }: Props) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const timer = useRef<NodeJS.Timeout | null>(null)

  function handleChange(newValue: [number, number]) {
    setLocalValue(newValue)

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      onChange(newValue)
    }, 400)
  }

  return (
    <div className="space-y-2 px-2 py-3">
      <Slider
        value={localValue}
        min={min}
        max={max}
        step={step}
        onValueChange={(value) => handleChange(value as [number, number])}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{localValue[0]}</span>
        <span>{localValue[1]}</span>
      </div>
    </div>
  )
}
