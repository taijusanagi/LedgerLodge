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

export default function Home() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [lodge, setLodge] = useState<Lodge>({});
  const [did, setDid] = useState("");
  const [web5, setWeb5] = useState<Web5>();
  const [privateRecordId, setPrivateRecordId] = useState("");

  const initWeb5 = async () => {
    const { web5, did } = await Web5.connect();
    setDid(did);
    setWeb5(web5);
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
        <Game lodge={lodge} />
      </div>
      <div className="flex justify-center mb-8">
        <div id="formSection" className="w-full max-w-md">
          <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Identity Wallet</h2>
          <div className="centered-form bg-white p-4 rounded-lg shadow-md space-y-4">
            <div>
              <label className="text-sm form-label block text-gray-700 font-bold mb-2">Available Credentials</label>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
