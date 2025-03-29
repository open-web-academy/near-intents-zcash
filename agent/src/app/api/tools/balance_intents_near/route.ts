import { headers } from "next/headers";
import { NextResponse } from 'next/server';
import { connect, keyStores, KeyPair, transactions, utils } from "near-api-js";

const CONTRACT_ID_INTENTS = "intents.near";

export async function GET(request: Request) {
    try {
        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string } =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);
        const { accountId } = mbMetadata || {};

        const { searchParams } = new URL(request.url);
        const account_id = searchParams.get("account_id");

        if (!account_id) {
            return NextResponse.json(
                {
                    error:
                        "account_id is required parameter",
                },
                { status: 400 }
            );
        }

        const params = {
            token_id : "nep141:wrap.near",
            account_id : account_id
        }

        const response = await fetch("https://rpc.mainnet.near.org", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: "dontcare",
              method: "query",
              params: {
                request_type: "call_function",
                finality: "final",
                account_id: CONTRACT_ID_INTENTS,
                method_name: "mt_balance_of",
                args_base64: Buffer.from(JSON.stringify(params)).toString("base64"),
              },
            }),
          });

          const data = await response.json();

          let deserializedResult = Array.isArray(data.result.result)
          ? String.fromCharCode(...data.result.result)
          : data.result.result;

          deserializedResult = deserializedResult.replace(/"/g, '');

          const balanceInBase6 = Number(deserializedResult) / 1e24;
        
        return NextResponse.json(balanceInBase6);
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}