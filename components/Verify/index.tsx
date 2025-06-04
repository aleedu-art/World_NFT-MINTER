
"use client";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

const verifyPayload: VerifyCommandInput = {
  action: "acao_wld102", // This is your action ID from the Developer Portal
  signal: "",
  verification_level: VerificationLevel.Device, // Orb | Device
};

export const VerifyBlock = () => {
  const [handleVerifyResponse, setHandleVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | IVerifyResponse | null
  >(null);
  const [verified, setVerified] = useState<boolean>(false);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("Tried to invoke 'verify', but MiniKit is not installed.");
      return;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    if (finalPayload.status === "error") {
      console.log("Command error");
      console.log(finalPayload);
      setHandleVerifyResponse(finalPayload);
      return finalPayload;
    }

    const verifyResponse = await fetch(`/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload as ISuccessResult,
        action: verifyPayload.action,
        signal: verifyPayload.signal,
      }),
    });

    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      console.log("Verification success!");
      console.log(finalPayload);
      setVerified(true);

      // ✅ Redirecionamento adicionado aqui:
      window.location.href = "https://world-ver-nft.vercel.app/";

      //setTimeout(() => {
     //   window.location.href = "https://world-ver-nft.vercel.app/";
      //}, 2000); // redireciona após 2 segundos

    }
   
    setHandleVerifyResponse(verifyResponseJson);
    return verifyResponseJson;
  }, []);

  return (
    <div className="flex flex-col items-center">
      {!handleVerifyResponse ? (
        <Button onClick={handleVerify}>
          Verify with World ID
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          {verified ? (
            <>
              <div className="text-green-600 font-medium">✓ Verified</div>
              <div className="bg-black text-white p-4 rounded-md max-w-md overflow-auto">
                <pre className="text-xs">{JSON.stringify(handleVerifyResponse, null, 2)}</pre>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-600 font-medium">✗ Verification Failed</div>
              <div className="bg-black text-white p-4 rounded-md max-w-md overflow-auto">
                <pre className="text-xs">{JSON.stringify(handleVerifyResponse, null, 2)}</pre>
              </div>
            </>
          )}
          <Button onClick={() => setHandleVerifyResponse(null)}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
