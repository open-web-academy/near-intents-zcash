import { NextResponse } from 'next/server';
import {  KeyPair, utils, providers, InMemorySigner, Connection, Account } from "near-api-js";
import { addMinutes, formatISO } from 'date-fns';
import { randomBytes, createHash } from 'crypto';
import { BorshSchema, borshSerialize } from 'borsher';
import bs58 from 'bs58';
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";

const CONTRACT_ID_INTENTS = "intents.near";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId_sender = searchParams.get("accountId_sender");
        const accountId_receiver = searchParams.get("accountId_receiver");
        const near_amount = searchParams.get("near_amount");

        if (!near_amount || !accountId_receiver || !accountId_sender) {
            return NextResponse.json(
                {
                    error:
                        "near_amount, accountId_receiver and accountId_sender are required parameters",
                },
                { status: 400 }
            );
        }

        const [integerPart, decimalPart = ""] = near_amount.split(".");
        const fullAmount = integerPart + decimalPart.padEnd(24, "0");
        const yoctoAmount = BigInt(fullAmount).toString();


        const standard = "nep413";
        const message = {
            deadline: formatISO(addMinutes(new Date(), 2)),
            signer_id: accountId_sender,
            intents: [
                {
                    intent: "native_withdraw",
                    receiver_id: accountId_receiver,
                    amount: yoctoAmount,
                },
            ],
        };

        const messageStr = JSON.stringify(message);

        const nonce = await generateNonce();

        const intent = serializeIntent(messageStr, CONTRACT_ID_INTENTS, nonce, standard);

        const privateKey = "ed25519:3wwRdhvWvpVEQNGtKCUKYizPcH2z1hyjj7sDWHivvQTmpXdJ4SjrENi3L4itvTWskreQNJwNfkj6BnrpQqHy4mM2";

        const provider = new providers.JsonRpcProvider({
            url: "https://rpc.mainnet.near.org",
          });
        
          const keyPair = KeyPair.fromString(privateKey);
        
          const keyStore = new InMemoryKeyStore();
          await keyStore.setKey("mainnet", accountId_sender, keyPair);
          const signer = new InMemorySigner(keyStore);
        
          const connection = new Connection("mainnet", provider, signer, "");

        const account = new Account(connection, accountId_sender);

        const state = await account.state(); // Obtener el estado de la cuenta (balance, estado de cuenta, etc.)
    
        console.log("Cuenta conectada exitosamente. Estado de la cuenta:", state);
        console.log("Balance:", utils.format.formatNearAmount(state.amount, 2), "NEAR");
          
        const { signature, publicKey } = keyPair.sign(intent);

        console.log("Signature:", signature);
        console.log("Public Key:", publicKey);

        const RPC_URL = "https://solver-relay-v2.chaindefuser.com/rpc";

        const signedData = {
            standard,
            payload: {
                message: messageStr,
                nonce,
                recipient: CONTRACT_ID_INTENTS,
            },
            signature: `ed25519:${bs58.encode(signature)}`,
            public_key: publicKey.toString(),
        };

        const body = {
            id: "dontcare",
            jsonrpc: "2.0",
            method: "publish_intent",
            params: [
                {
                    quote_hashes: [], // this array is empty as we're withdrawing
                    signed_data: signedData,
                },
            ],
        };
        
        const response = await fetch(RPC_URL, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json: any = await response.json();

        if (!response.ok) {
            throw new Error(
              `Request failed ${response.status} ${
                response.statusText
              } - ${JSON.stringify(json)}`
            );
        }

        const result = json.result;

        console.log("Result:", result);

        //return NextResponse.json();
        return NextResponse.json(true);
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}

const generateNonce = async (): Promise<string> => {
    const randomArray = randomBytes(32);
    return randomArray.toString('base64');
}


const standardNumber: { [key: string]: number } = {
    ["nep413"]: 413,
};

const Nep413PayloadSchema = BorshSchema.Struct({
    message: BorshSchema.String,
    nonce: BorshSchema.Array(BorshSchema.u8, 32),
    recipient: BorshSchema.String,
    callback_url: BorshSchema.Option(BorshSchema.String),
});

const serializeIntent = (
    intentMessage: string,
    recipient: string,
    nonce: string,
    standard: string,
): Buffer => {
    const payload = {
        message: intentMessage,
        nonce: base64ToUint8Array(nonce),
        recipient,
    };
    const payloadSerialized = borshSerialize(Nep413PayloadSchema, payload);
    const baseInt = 2 ** 31 + standardNumber[standard];
    const baseIntSerialized = borshSerialize(BorshSchema.u32, baseInt);
    const combinedData = Buffer.concat([baseIntSerialized, payloadSerialized]);
    return createHash('sha256').update(combinedData).digest();
}

const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}