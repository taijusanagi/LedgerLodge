import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Game = dynamic(() => import("../components/Game"), {
  ssr: false,
});

import { Press_Start_2P, Inter } from "next/font/google";
export const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });
export const inter = Inter({ subsets: ["latin"] });

import { Web5, Record } from "@web5/api";
import { Lodge, VerifiableCredential } from "@/types";
import { truncateString } from "@/lib/utils";

import protocol from "../../public/protocol.json";

// const dingerProtocolDefinition = {
//   protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
//   published: true,
//   types: {
//     ding: {
//       schema: "https://blackgirlbytes.dev/ding",
//       dataFormats: ["application/json"],
//     },
//   },
//   structure: {
//     ding: {
//       $actions: [
//         { who: "anyone", can: "write" },
//         { who: "author", of: "ding", can: "read" },
//         { who: "recipient", of: "ding", can: "read" },
//       ],
//     },
//   },
// };

export default function Home() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [lodge, setLodge] = useState<Lodge>({});
  const [web5, setWeb5] = useState<Web5>();
  const [did, setDid] = useState("");
  const [privateRecordId, setPrivateRecordId] = useState("");

  useEffect(() => {
    (async () => {
      const { web5, did } = await Web5.connect();
      setDid(did);
      setWeb5(web5);
      console.log(did);
      const privateRecordId = window.localStorage.getItem("privateRecordId");
      let fetchedRecord: Record | undefined;

      if (!privateRecordId) {
        const { record } = await web5.dwn.records.create({
          data: {},
          message: {
            dataFormat: "application/json",
          },
        });
        fetchedRecord = record;
      } else {
        const { record } = await web5.dwn.records.read({
          message: {
            filter: {
              recordId: privateRecordId,
            },
          },
        });
        fetchedRecord = record;
      }
      if (!fetchedRecord) {
        return;
      }
      window.localStorage.setItem("privateRecordId", fetchedRecord.id);
      setPrivateRecordId(fetchedRecord.id);
      const data = await fetchedRecord.data.json();
      console.log("data", data);

      const { protocols, status: protocolStatus } = await web5.dwn.protocols.query({
        message: {
          filter: {
            protocol: "https://ledgerlodge.vercel.app/protocol.json",
          },
        },
      });

      if (protocolStatus.code !== 200 || protocols.length === 0) {
        const response = await web5.dwn.protocols.configure({
          message: {
            definition: protocol,
          },
        });
        console.log("Configure protocol status", response);
      }
    })();
  }, []);

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
              <label className="text-sm block text-gray-700 mb-2">Owner DID</label>{" "}
              <p className="text-xs text-gray-70 text-gray-500">{truncateString(did, 30)}</p>
            </div>
            <div>
              <label className="text-sm block text-gray-700 mb-2">Credentials Record ID</label>
              <p className="text-xs text-gray-70 text-gray-500">{truncateString(privateRecordId, 30)}</p>
            </div>
            <div>
              <label className="text-sm block text-gray-700 mb-2">Available Credentials</label>
              <div className="space-y-2">
                {credentials.map((credential, i) => {
                  return (
                    <div
                      key={i}
                      className="relative h-52 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-lg cursor-pointer"
                      onClick={() => {
                        console.log("Click Sample Credential");
                      }}
                    >
                      <div className="absolute bottom-2 right-2">Sample Credential</div>
                    </div>
                  );
                })}
                <button
                  className="bg-cyan-500 disabled:opacity-50 text-xs text-white py-2 px-4 rounded-lg hover:enabled:bg-cyan-600 w-full"
                  onClick={async () => {
                    console.log("Click Get Sample Credential");
                    setCredentials((prev) => [...prev, {}]);
                    if (!web5) {
                      return;
                    }
                    const { record } = await web5.dwn.records.read({
                      message: {
                        filter: {
                          recordId: privateRecordId,
                        },
                      },
                    });
                    await record.update({ data: { ok: "ok" } });
                  }}
                >
                  Get Sample Credential
                </button>
                <button
                  className="bg-cyan-500 disabled:opacity-50 text-xs text-white py-2 px-4 rounded-lg hover:enabled:bg-cyan-600 w-full"
                  onClick={async () => {
                    if (!web5) {
                      return;
                    }
                    const recipientDid =
                      "did:ion:EiAgEI3XNyBtfKM38-6dVeXDD-TAVCZwRQfg19u5NLTVDg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiMlQ0LUJybmJaMnNjZWw4ZWxLcHN4NnZVSEZlcDM1RXNlSWpTWC1DSW5YWSJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJrSUdtNnYwX2RHMmpYQTdJYTc2WHNYOGUtU0xWQ3loUnZiQ3p3TWRfRlZRIiwieSI6IklzeHJJQmV6cUs4SkpiODE5VVNPdEo5SEZMdkFUQkNLS1BMMVRJSnNNWVEifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNSIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduMCJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlBb0M0M3kyX2JnclhZSi1EY2tKejlPbkVPVnN3MzBJSkkzTHRPV2hyYmZqdyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQ0RIZkwyVlduYUVDVC1fSTBzb196dXZIX0hIb3h6di1vX09adkZRLWZtUFEiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUNJTHA3Yy1xWkhZbDBGN3VSNEJjSTNSX0RmMUgxeHk4S0hXb2hsR3NDdHZ3In19";
                    // web5.dwn.protocols.
                    const { record } = await web5.dwn.records.create({
                      data: { shared: "shared" },
                      store: false,
                      message: {
                        protocol: "https://ledgerlodge.vercel.app/protocol.json",
                        protocolPath: "doc",
                        schema: "doc",
                        // recipient: recipientDid,
                        // dataFormat: "application/json",
                        recipient: recipientDid,
                        // published: true,
                      },
                    });
                    const test = await record?.send(recipientDid);
                    console.log("test", test);
                    console.log("record.id", record!.id);
                  }}
                >
                  Share Credential Lodge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
