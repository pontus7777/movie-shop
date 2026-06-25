"use client"

import type { Prisma } from "@/generated/prisma/client"
import Link from "next/link"
import { MoveRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = {
    actors: Prisma.ActorGetPayload<{ include: { movies: true } }>[],
}

function ActorsTable({actors}: Props){

      return (
        <>
    <div className="rounded-xl bg-card p-6 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
                Name
            </TableHead>
            <TableHead>
                Movies
            </TableHead>
        

            <TableHead className="text-right">...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actors.map((actor) => {
            return(
            <TableRow key={actor.id}>
              <TableCell>
            
              </TableCell>
              <TableCell className="font-medium">{actor.name}</TableCell>
              <TableCell>
                  {actor.movies.length > 0 ? actor.movies.map((movie) => movie.title).join(", ")
                    : "No movies"}
            </TableCell>

              <TableCell className="text-right">
                <Button
                  asChild
                  variant="secondary"
                >
                  <Link href={`/admin/actors/${actor.id}`}>
                    view
                    <MoveRight className="ml-2" />
                  </Link>
                </Button>
              </TableCell>

              <TableCell className="text-right">
                <Dialog>
                  <form onSubmit={(e) => { e.preventDefault(); /* TODO: save actor */ }}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Edit actor</DialogTitle>
                        <DialogDescription>
                          Edit actor name and movies.
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <Label htmlFor={`actor-name-${actor.id}`}>Name</Label>
                          <Input id={`actor-name-${actor.id}`} name="name" defaultValue={actor.name} />
                        </Field>
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
    </div>

      
    </>
  )
}

export { ActorsTable }