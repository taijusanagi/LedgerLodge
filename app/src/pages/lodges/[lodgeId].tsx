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
      const { records } = await web5.dwn.records.query({
        // from: "did:ion:EiBJrO9QsurK9uVw0JBwwOrLZhS9eYFUv2KstIdjpXsDmA:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiaHNyVGttVVoza2N1bmhocXpZZTlaUWJTUGg3ZzNJRFNoc0ZwR0NXaVJzYyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI4MU5yc0E1UW1wajkzMngtdjduU20yS1BTWTJtWFhXOG5FRnotZEZOaXhRIiwieSI6ImNJQm50ZHBFLXBRSnlLVEhNNS0zZUVRODZTTDczTXIxOG5HbmtTa3N6d2sifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduMiIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduMSJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCcFN4azNPTXBkTVkxLVdqanV0QUFfNUlUY0JFY24za2RwR1JnR0NEczlXQSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQk51dnN0RzFwMVF5LXNUckdfM0N1RHNTYTFPWS03NzFYVjJiWE1weUt1LUEiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaURjSzEwUVNIcU1mYWt3R3NHSnNsajBDSEpPSWljREJ1TEU5OERiUG85NUx3In19",
        // from: did,
        message: {
          filter: {
            // protocol: "http://localhost:3000",
            recordId: lodgeRecordId,
          },
        },
      });
      console.log("records", records);
      if (!records || records.length == 0) {
        return;
      }
      const [record] = records;

      // if (!record) {
      //   return;
      // }
      setDid(record.author);
      console.log(await record.data.json());
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
