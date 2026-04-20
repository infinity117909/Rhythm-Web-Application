import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OptionType } from "@/lib/rhythm/types"
import Dropdown from "@/components/notation/RhythmSelect";

export const Route = createFileRoute("/visualization/rhythms/$rhythmId")({
   component: RhythmPage,
   loader: async ({ params }) => {
      return params.rhythmId;
   },
});

function RhythmPage() {
   return (
      <>
         <div>
            <Dropdown />
         </div>
      </>
   );
}