import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Movies</h2>
          <p className="text-muted-foreground">Movies cads</p>
        </div>
        <Button asChild className="">
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>
    </div>
  );
}
