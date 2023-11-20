import dynamic from "next/dynamic";

import { Web5 } from "@web5/api";

import { use } from "matter";
import { useEffect } from "react";

const PhaserGame = dynamic(() => import("../components/PhaserGame"), {
  ssr: false,
});

export default function Home() {
  const initWeb5 = async () => {
    const { web5, did: aliceDid } = await Web5.connect();
    console.log("Alice DID:", aliceDid);
  };

  useEffect(() => {
    initWeb5();
  }, []);

  return (
    <main>
      <PhaserGame />
    </main>
  );
}
