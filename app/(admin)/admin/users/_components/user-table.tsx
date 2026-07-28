import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Prisma } from '@/generated/prisma/client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useState, useTransition } from 'react'
import { EditUserDialog } from './edit-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { updateUserVerification } from '../_actions/update-user-verification-action'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true
  }
}>

export type UserTableProps = {
  users: UserWithRelations[]
  totalUsers: number
  currentPage: number
  totalPages: number
}

export function UserTable({ users, totalUsers, currentPage, totalPages }: UserTableProps) {
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<UserWithRelations | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [pendingId, setPendingId] = useState<string | null>(null)

  function handleVerifyToggle(user: UserWithRelations, checked: boolean) {
    setPendingId(user.id)
    startTransition(async () => {
      const result = await updateUserVerification({
        id: user.id,
        emailVerified: checked,
      })

      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success(checked ? 'User marked as verified' : 'User marked as unverified')
        router.refresh()
      }
      setPendingId(null)
    })
  }

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
            {users.map((user) => {
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
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.emailVerified}
                        disabled={isPending && pendingId === user.id}
                        onCheckedChange={(checked) => handleVerifyToggle(user, checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{user.orders.length}</TableCell>

                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('sv-SE') : 'N/A'}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setEditOpen(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedUser(user)
                            setDeleteOpen(true)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {selectedUser && (
          <>
            {/* EDIT DIALOG */}
            <EditUserDialog open={editOpen} onOpenChange={setEditOpen} user={selectedUser} />

            {/* DELETE DIALOG */}
            <DeleteUserDialog open={deleteOpen} onOpenChange={setDeleteOpen} user={selectedUser} />
          </>
        )}
      </CardContent>

      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'} />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href={`?page=${index + 1}`} isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}` : '#'} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
