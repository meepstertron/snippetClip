import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, User, Settings, LogOut, LogIn, Search } from 'lucide-react'
import useExtension from "@/hooks/useExtension"
import { Separator } from "@/components/ui/separator"

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
import { Link, useNavigate } from "react-router-dom"

interface HeaderBarProps {
  username?: string
  avatarUrl?: string
  onLogin?: () => void
  onLogout?: () => void
  onCreateNew?: () => void
  onSearch?: (query: string) => void
}

export function HeaderBar({ username, avatarUrl, onLogin, onLogout, onCreateNew, onSearch }: HeaderBarProps) {
  const { connected, reconnect } = useExtension()
  const navigate = useNavigate()
  const isLoggedIn = !!username
 
  return (
    <header className="w-full bg-background border-b">
      <div className="w-full px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold flex items-center gap-2">
          <span>SnippetClip</span>
        </Link>
        <Separator className="h-6" orientation="vertical" />

        <div className="flex items-center gap-4 flex-1 justify-between">
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
                  <Link to={`/u/${username}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="flex items-center" onClick={connected ? undefined : reconnect}>
                        <div className={`rounded-full w-2 h-2 ${connected ? 'bg-green-600 animate-pulse' : 'bg-red-600'} mr-2`} />
                        <span>{connected ? 'Connected' : 'Not Connected'}</span>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      {connected 
                        ? 'Connected to the VS Code extension'
                        : 'Not connected to the VS Code extension consider downloading it or click to try again'
                      }
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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

          <div className="flex-1 max-w-xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
              if (query.trim()) {
                navigate(`/search/${encodeURIComponent(query.trim())}`);
                onSearch?.(query);
              }
            }}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  className="w-full pl-8"
                  placeholder="Search snippets..."
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
            </form>
          </div>

          <Button size="sm" onClick={onCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>
    </header>
  )
}

