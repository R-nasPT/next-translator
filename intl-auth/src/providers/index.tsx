import SessionProvider from './SessionProvider'
interface ProvidersProps {
    children: React.ReactNode
}

export default function Providers({children}: ProvidersProps) {
  return (
      <SessionProvider>
          {children}
      </SessionProvider>
  )
}
