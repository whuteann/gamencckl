import "../styles/globals.css"
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import RootLayout from '@/components/templates/RootLayout';

export default function App({ Component, pageProps }: AppProps) {

  return (
    // <RootLayout>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    // </RootLayout>
  )
}
