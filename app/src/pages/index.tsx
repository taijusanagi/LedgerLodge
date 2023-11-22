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

import { FaRegCopy } from "react-icons/fa";

import protocol from "../../public/protocol.json";

const verifiableCredentialTemplate = {
  "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
  type: ["VerifiableCredential", "SampleCredential"],
  issuer: "did:example:1",
  credentialSubject: {
    id: "",
    name: "",
  },
  proof: {},
};

import { objects } from "@/lib/objects";

export default function Home() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [lodge, setLodge] = useState<Lodge>({});
  const [web5, setWeb5] = useState<Web5>();
  const [did, setDid] = useState("");
  const [privateRecordId, setPrivateRecordId] = useState("");
  const [lodgeRecoredId, setLodgeRecordId] = useState("");

  const [isCredentialModalOpen, setCredentialModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selecrtedCredentialIndex, setSelectedCredentialIndex] = useState(0);
  const [recipientDid, setRecipientDid] = useState("");

  useEffect(() => {
    (async () => {
      const { web5, did } = await Web5.connect();
      setDid(did);
      setWeb5(web5);
      console.log("myDid", did);
      console.log("Test configuration");
      const { protocols, status: protocolStatus } = await web5.dwn.protocols.query({
        message: {
          filter: {
            protocol: protocol.protocol,
          },
        },
      });
      console.log("protocolStatus", protocolStatus);
      if (protocolStatus.code !== 200 || protocols.length === 0) {
        const response = await web5.dwn.protocols.configure({
          message: {
            definition: protocol,
          },
        });
        console.log("Configure protocol status", response);
        await response.protocol?.send(did);
        console.log("Protocol sent");
      }

      console.log("Fetch Credential from DWN");
      const privateRecordId = window.localStorage.getItem("privateRecordId");
      let fetchedRecord: Record | undefined;

      if (!privateRecordId) {
        const { record } = await web5.dwn.records.create({
          data: { credentials: [] },
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
      if (data && data.credentials && data.credentials.length > 0) {
        setCredentials(data.credentials);
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
        <Game lodge={lodge} setLodge={setLodge} mode="edit" />
      </div>
      <div className="flex justify-center mb-8">
        <div id="formSection" className="w-full max-w-md">
          <div className="centered-form bg-white p-4 rounded-lg shadow-md space-y-8">
            <div>
              <div className="flex justify-between">
                <label className="text-sm block text-gray-700 mb-2">Owner DID</label>
                <FaRegCopy
                  className="cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    navigator.clipboard.writeText(did);
                  }}
                />
              </div>
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
                        setSelectedCredentialIndex(i);
                        setCredentialModalOpen(true);
                      }}
                    >
                      <div className="absolute bottom-2 right-2">Sample Credential</div>
                    </div>
                  );
                })}
                <button
                  className="bg-cyan-500 disabled:opacity-50 text-xs text-white py-2 px-4 rounded-lg hover:enabled:bg-cyan-600 w-full"
                  disabled={credentials.length > 0}
                  onClick={async () => {
                    console.log("Click Get Sample Credential");
                    const credentials = [
                      {
                        ...verifiableCredentialTemplate,
                        credentialSubject: { id: did, name: "Sample Credential 1" },
                      },
                      {
                        ...verifiableCredentialTemplate,
                        credentialSubject: { id: did, name: "Sample Credential 1" },
                      },
                      {
                        ...verifiableCredentialTemplate,
                        credentialSubject: { id: did, name: "Sample Credential 1" },
                      },
                    ];
                    setCredentials(credentials);
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
                    await record.update({
                      data: {
                        credentials,
                      },
                    });
                  }}
                >
                  Get Sample Credential
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm block text-gray-700 mb-2">Share Credentials Lodge</label>
              <input
                type="text"
                value={recipientDid}
                onChange={(e) => setRecipientDid(e.target.value)}
                className="py-3 px-2 mb-4 w-full border rounded-lg text-xs text-gray-500"
                placeholder="Recipient Did"
              />
              <button
                className="bg-cyan-500 disabled:opacity-50 text-xs text-white py-2 px-4 rounded-lg hover:enabled:bg-cyan-600 w-full"
                onClick={async () => {
                  if (!web5 || !recipientDid) {
                    return;
                  }
                  const { record } = await web5.dwn.records.write({
                    data: { creator: did },
                    store: true,
                    message: {
                      protocol: protocol.protocol,
                      protocolPath: "doc",
                      schema: "doc",
                      recipient: recipientDid,
                      published: true,
                    },
                  });
                  const sendResponse = await record?.send(recipientDid);
                  console.log("sendResponse", sendResponse);
                  console.log("record.id", record!.id);
                  setLodgeRecordId(record!.id);
                  setShareModalOpen(true);
                }}
              >
                Share My Credential Lodge
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCredentialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setCredentialModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700">Credential</h2>
              <button
                onClick={() => setCredentialModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </header>
            <pre
              className="p-2 rounded border border-gray-200 bg-gray-50 overflow-x-auto overflow-y-auto max-h-80 mb-4"
              style={{ fontSize: "10px" }}
            >
              {JSON.stringify(credentials[selecrtedCredentialIndex], null, "\t")}
            </pre>
            <label className="text-sm block text-gray-700 mb-4">Select Lodge Furniture</label>
            <div className="grid grid-cols-6 gap-4">
              {Object.entries(objects).map(([k, v], i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg"
                  onClick={() => {
                    console.log(k);
                    setLodge((prev) => {
                      return { ...prev, [k]: credentials[selecrtedCredentialIndex] };
                    });
                    setCredentialModalOpen(false);
                  }}
                >
                  <img
                    src={`/images/${v.name}.png`}
                    alt={`image-${i}`}
                    className="w-full h-auto object-cover cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShareModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700">Share Preview</h2>
              <button onClick={() => setShareModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            {lodgeRecoredId}
            <button
              className="bg-cyan-500 disabled:opacity-50 text-white py-2 px-4 rounded-lg hover:enabled:bg-cyan-600 w-full mb-4"
              onClick={async () => {}}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
