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

export function UserTable({}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Showing 7 of 1,248 users</CardDescription>
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
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">sarah@email.com</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>Admin</TableCell>

              <TableCell>
                <Badge>Active</Badge>
              </TableCell>

              <TableCell>32</TableCell>

              <TableCell>Jul 1, 2026</TableCell>

              <TableCell>
                <Button variant="ghost" size="icon">
                  ⋮
                </Button>
              </TableCell>
            </TableRow>

            {/* More rows... */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
