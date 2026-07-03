import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Prisma } from '@/generated/prisma/client'

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true
  }
}>

type Props = {
  users: UserWithRelations[]
  totalUsers: number
  admins: number
  verifiedUsers: number
  newUsers: number
}

export function UserTable({ users, totalUsers, admins, verifiedUsers, newUsers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Showing {users.length} of {totalUsers} users
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-15" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, index) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.role}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        user.emailVerified
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      }
                    >
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </TableCell>

                  <TableCell>{user.orders.length}</TableCell>

                  <TableCell>
                    {/* {user.createdAt.toLocaleDateString('SV-se')} */}
                    {newUsers ? new Date(user.createdAt).toLocaleDateString('SV-se') : 'N/A'}
                  </TableCell>

                  <TableCell>
                    <Button variant="ghost" size="icon">
                      ⋮
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}

            {/* More rows... */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
