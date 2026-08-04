import { ReactNode } from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function FilterSection({
  title,
  value,
  children,
  scroll = true,
}: {
  title: string
  value: string
  children: ReactNode
  scroll?: boolean
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
        {title}
      </AccordionTrigger>

      <AccordionContent>
        {scroll ? (
          <div className="max-h-56 space-y-1.5 overflow-y-auto overflow-x-hidden pr-1">
            {children}
          </div>
        ) : (
          children
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
