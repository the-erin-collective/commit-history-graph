import './globals.css'

export const metadata = {
  title: 'commit history graph',
  description: 'commit history graph',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className=".body">
          {children}
      </body>
    </html>
  )
}
