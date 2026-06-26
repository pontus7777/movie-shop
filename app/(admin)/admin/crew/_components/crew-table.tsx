
import  { Crew } from "@/generated/prisma/client"


type Props = {
    crewMembers: Crew[] 
}

export function CrewTable({crewMembers}: Props){



    return (
        <div>
        {crewMembers.map((crewMember) => (
            <div key={crewMember.id}>
                
                <p>{crewMember.name}</p>
                <p>{crewMember.role}</p>
                
                </div>
        ))}
    </div>
    )
    
}