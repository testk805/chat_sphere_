import React from "react";
import { MagicCard } from "../component/MagicCard";

export default function MagicMIanCard() {
  return (
    <div className="flex bg-black h-screen justify-center items-center">
      <MagicCard className="text-center text-xl w-80 font-bold">
        🚀 Hover to see the magic!
      </MagicCard>
    </div>
  );
}
