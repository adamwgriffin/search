import type { Metadata } from 'next'
import '../styles/globals.css'
import SessionProvider from '../providers/SessionProvider'
import StyledJsxRegistry from '../providers/StyledJsxRegistry'
import ReduxProvider from '../providers/ReduxProvider'
import ThemeProvider from '../providers/ThemeProvider'
import ModalRoot from '../containers/modals/ModalRoot/ModalRoot'

export const metadata: Metadata = {
  title: 'Awsom',
  description: "Search That Doesn't Suck™"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    // Using suppressHydrationWarning per next-themes docs because next-themes updates <html>, which will always cause a
    // warning
    <html lang='en' suppressHydrationWarning>
      <body>
        <SessionProvider>
          <StyledJsxRegistry>
            <ReduxProvider>
              <ThemeProvider>
                {children}
                <ModalRoot />
              </ThemeProvider>
            </ReduxProvider>
          </StyledJsxRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}
