import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Game = dynamic(() => import("../../components/Game"), {
  ssr: false,
});

import { Press_Start_2P, Inter } from "next/font/google";
export const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });
export const inter = Inter({ subsets: ["latin"] });

import { Web5, Record } from "@web5/api";
import { Lodge, VerifiableCredential } from "@/types";
import { truncateString } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Home() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [lodge, setLodge] = useState<Lodge>({});
  const [web5, setWeb5] = useState<Web5>();
  const [did, setDid] = useState("");
  const [lodgeRecordId, setLodgeRecordId] = useState("");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { web5, did } = await Web5.connect();
      console.log(did);
      setWeb5(web5);
      if (typeof router.query.lodgeId != "string") {
        return;
      }
      const lodgeRecordId = router.query.lodgeId;
      setLodgeRecordId(lodgeRecordId);
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            recordId: lodgeRecordId,
          },
        },
      });
      console.log(response);
      // if (!record) {
      //   return;
      // }
      // setDid(record.author);
      // console.log(await record.data.json());
    })();
  }, [router]);

  return (
    <main
      className={`min-h-screen bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col break-all ${pressStart2P.className} `}
    >
      <header className={`w-full bg-gray-800 text-white p-4 mb-8`}>LedgerLodge</header>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Verifiable Credentials Lodge</h2>
        <Game lodge={lodge} />
      </div>
      <div className="flex justify-center mb-8">
        <div id="formSection" className="w-full max-w-md">
          <div className="centered-form bg-white p-4 rounded-lg shadow-md space-y-8">
            <div>
              <label className="text-sm block text-gray-700 mb-2">Creator DID</label>{" "}
              <p className="text-xs text-gray-70 text-gray-500">{truncateString(did, 30)}</p>
            </div>
            <div>
              <label className="text-sm block text-gray-700 mb-2">Lodge Record ID</label>
              <p className="text-xs text-gray-70 text-gray-500">{truncateString(lodgeRecordId, 30)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
