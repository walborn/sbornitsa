import Script from 'next/script'

interface Props {
  id: string
  schema: object
}

export const SchemaScript = ({ id, schema }: Props) => (
  <Script
    id={id}
    type="application/ld+json"
    strategy="afterInteractive"
    // oxlint-disable-next-line react/no-danger -- schema is safe
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
)
