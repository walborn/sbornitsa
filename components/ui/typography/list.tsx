import { cn } from '@/lib/utils'

interface Props {
  values: { id: string; children: React.ReactNode }[]
  ordered?: boolean
}
export function TypographyList({ values, ordered = false }: Props) {
  return (
    <ul className={cn('ml-6 [&>li]:mt-2', ordered ? 'list-decimal' : 'list-disc')}>
      {values.map(({ id, children }) => (
        <li key={id}>{children}</li>
      ))}
    </ul>
  )
}
