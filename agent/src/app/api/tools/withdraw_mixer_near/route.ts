import { headers } from "next/headers";
import { NextResponse } from 'next/server';
const crypto = require('crypto');

const CONTRACT_ID_MIXER = "tx-mixer.near";

export async function GET(request: Request) {
    try {
        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string } =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);
        const { accountId } = mbMetadata || {};

        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");
        const recipient = searchParams.get("recipient");

        if (!secret) {
            return NextResponse.json(
                {
                    error:
                        "secret and recipient are required parameters",
                },
                { status: 400 }
            );
        }

        console.log("secret", secret);

        const transaction = ({
            signerId: accountId as string,
            receiverId: CONTRACT_ID_MIXER,
            deposit: 0,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: "withdraw",
                        args: {
                                recipient: recipient,
                                secret: secret
                        },
                        gas: "100000000000000",
                        deposit: 0,
                    }
                }
            ],
        });

        return NextResponse.json(transaction);
        //return NextResponse.json({msg:"DEPOSIT"});
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}