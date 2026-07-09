import { Head, Html, pixelBasedPreset, Tailwind } from 'react-email'

type Props = {
  children: React.ReactNode
}
export default function EmailLayout({ children }: Props) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <body className="font-sans">{children}</body>
      </Html>
    </Tailwind>
  )
}
