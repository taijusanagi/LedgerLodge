import dynamic from "next/dynamic";
import { useEffect } from "react";

const Game = dynamic(() => import("../components/Game"), {
  ssr: false,
});

import { Press_Start_2P } from "next/font/google";
export const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });

import { Web5 } from "@web5/api";

export default function Home() {
  const initWeb5 = async () => {
    const { web5, did: aliceDid } = await Web5.connect();
    console.log("Alice DID:", aliceDid);
  };

  useEffect(() => {
    initWeb5();
  }, []);

  return (
    <main
      className={`min-h-screen bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col break-all ${pressStart2P.className} `}
    >
      <header className={`w-full bg-gray-800 text-white p-4 mb-8`}>LedgerLodge</header>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Verifiable Credentials Lodge</h2>
        <Game />
      </div>
      <div className="flex justify-center mb-8">
        <div id="formSection" className="w-full max-w-md">
          <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Identity Wallet</h2>
          <div className="centered-form bg-white p-4 rounded-lg shadow-md"></div>
        </div>
      </div>
    </main>
  );
}
