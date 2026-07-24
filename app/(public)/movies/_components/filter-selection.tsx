import { ReactNode } from 'react'

export function FilterSection({
  title,
  children,
  scroll = true,
}: {
  title: string
  children: ReactNode
  scroll?: boolean
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      {scroll ? (
        <div
          className="
            flex gap-2 overflow-x-auto pb-2
            lg:block lg:max-h-56 lg:space-y-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0
          "
        >
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
