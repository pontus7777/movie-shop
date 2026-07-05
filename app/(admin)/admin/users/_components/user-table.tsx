import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import Link from 'next/link'
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
import { useState } from 'react'
import { EditUserDialog } from './edit-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true
  }
}>

type Props = {
  users: UserWithRelations[]
  totalUsers: number
  currentPage: number
  totalPages: number
}

export function UserTable({ users, totalUsers, currentPage, totalPages }: Props) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
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
                          ? 'bg-green-400 hover:bg-green-600'
                          : 'bg-red-400 hover:bg-red-600'
                      }
                    >
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
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

                    {/* <Button variant="ghost" size="icon">
                      ⋮
                    </Button> */}
                  </TableCell>
                </TableRow>
              )
            })}

            {/* More rows... */}
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
