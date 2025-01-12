import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Settings, LogOut, LogIn } from 'lucide-react'
import useExtension from "@/hooks/useExtension"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderBarProps {
  username?: string
  avatarUrl?: string
  onLogin?: () => void
  onLogout?: () => void
  onCreateNew?: () => void
}

export function HeaderBar({ username, avatarUrl, onLogin, onLogout, onCreateNew }: HeaderBarProps) {
  const { connected, reconnect } = useExtension()
  const isLoggedIn = !!username
 
  return (
    <header className="w-full bg-background border-b">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm hidden sm:inline">{username}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" onClick={onLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            {connected ? (
                <>
                  <TooltipTrigger onClick={() => {  }}>
                    <span className="text-muted-foreground text-sm flex items-center">
                    <div className="rounded-full w-2 h-2 bg-green-600 mr-2 animate-pulse"></div>
                    Connected
                    </span>
                    <TooltipContent>Connected to the VS Code extension</TooltipContent>
                  </TooltipTrigger>
                </>

            ) : (
                <>
                  <TooltipTrigger onClick={() => { reconnect() }}>
                    <span className="text-muted-foreground text-sm flex items-center">
                    <div className="rounded-full w-2 h-2 bg-red-600 mr-2"></div>
                    Not Connected
                    </span>
                    <TooltipContent>Not connected to the VS Code extension consider downloading it or click to try again</TooltipContent>
                  </TooltipTrigger>
                </>
              )}
            </Tooltip>
        </TooltipProvider>
        <Button size="sm" onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
    </header>
  )
}

