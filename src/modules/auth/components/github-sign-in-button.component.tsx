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
      className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
    >
      <Github className="size-5 transition-transform group-hover:scale-110" />
      <span className="font-mono text-xs uppercase tracking-widest font-bold">{label}</span>
    </Button>
  )
}
