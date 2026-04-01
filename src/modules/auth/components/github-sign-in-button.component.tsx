'use client'

import { Github } from 'lucide-react'
import { authClient } from '@/modules/auth/lib'
import { Button } from '@/core/ui/button'

interface IGitHubSignInButtonProps {
  label: string
}

export function GitHubSignInButton({ label }: IGitHubSignInButtonProps) {
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignIn}
      className="w-full h-11 rounded-lg flex items-center justify-center gap-2.5 bg-background border-border/40 text-[14px] font-medium shadow-sm hover:bg-muted/50 hover:border-border/60 transition-all duration-200"
    >
      <Github className="size-[18px]" />
      <span>{label}</span>
    </Button>
  )
}
