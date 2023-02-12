import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider, createTheme } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Light Theme
const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // brand colors
      // primaryBG: '#00acc0',
      // primaryLight: '#00c8df',
    }, // light theme
  }
})

// Dark Theme
const darkTheme = createTheme({type: "dark"});

export default function App({ Component, pageProps }: AppProps) {
  return (
  <NextThemesProvider
    defaultTheme="lightTheme"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
    >
      <NextUIProvider theme={darkTheme}>

        <Component {...pageProps} >
        </Component>
      </NextUIProvider>
  </NextThemesProvider>
  )
}
