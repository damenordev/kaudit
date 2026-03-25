import { Badge } from '@/core/ui/primitives/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/primitives/card'
import { type IUser } from '../../types/user.types'

export interface IUserCardProps {
  user: IUser
}

/**
 * Grid card for a single user (used in grid view mode).
 * Demonstrates how to render items in a card layout.
 */
export const UserCard = ({ user }: IUserCardProps) => {
  const roleVariant = user.role === 'admin' ? 'default' : 'secondary'
  const statusVariant = user.status === 'active' ? 'default' : user.status === 'inactive' ? 'destructive' : 'outline'

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </CardTitle>
          <Badge variant={statusVariant} className="capitalize text-xs">
            {user.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 text-sm">
        <p className="text-muted-foreground">{user.email}</p>
        <div className="flex items-center gap-2">
          <Badge variant={roleVariant} className="capitalize text-xs">
            {user.role}
          </Badge>
          <span className="text-xs text-muted-foreground">{user.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
