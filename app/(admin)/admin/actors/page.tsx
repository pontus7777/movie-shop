import prisma from "@/lib/prisma"
import { ActorsTable } from "./_components/actorsTbl"

export default async function AdminActorsPage(){
      const actors = await prisma.actor.findMany({
        include:{
            movies :true
        }
      })
    return(
    <>
        <h1>Hello Actors!</h1>
       <ActorsTable actors={actors}/>
    </>
    )
}