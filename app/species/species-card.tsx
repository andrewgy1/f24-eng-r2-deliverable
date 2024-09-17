"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, currentUser, authorName }: {species: Species, currentUser: string, authorName: string | null}) {
  //Change state of learn more button from open/closed
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow flex flex-col justify-between">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className="flex-grow">
        <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
        <h4 className="text-lg font-light italic">{species.common_name}</h4>
        <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full" variant="secondary">
            <Icons.add className="mr-3 h-5 w-5" />
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="mt-3 text-2xl font-semibold">{species.scientific_name}</DialogTitle>
            <DialogDescription>
              <div>
                <h3 className="text-lg font-light italic">{species.common_name}</h3>
                <h4><b>Author:</b> {authorName}</h4>
                <h5><b>Population:</b> {species.total_population}</h5>
                <h5><b>Kingdom:</b> {species.kingdom}</h5>
                <p>{species.description}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          {currentUser === species.author && <EditSpeciesDialog species = {species} currentId = {currentUser}/>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
