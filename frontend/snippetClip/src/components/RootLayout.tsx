import { HeaderBar } from "./HeaderBar"

interface RootLayoutProps {
  children: React.ReactNode
  username?: string
  avatarUrl?: string
  onLogin?: () => void
  onLogout?: () => void
  onCreateNew?: () => void
}

export function RootLayout({
  children,
  username,
  avatarUrl,
  onLogin,
  onLogout,
  onCreateNew
}: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <HeaderBar
        username={username}
        avatarUrl={avatarUrl}
        onLogin={onLogin}
        onLogout={onLogout}
        onCreateNew={onCreateNew}
      />
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  )
}

