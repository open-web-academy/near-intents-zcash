import { headers } from "next/headers";
import { NextResponse } from 'next/server';
import * as crypto from 'crypto';

const CONTRACT_ID_MIXER = "tx-mixer.near";

export async function GET(request: Request) {
    try {
        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string } =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);
        const { accountId } = mbMetadata || {};

        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");
        const near_amount = searchParams.get("near_amount");

        if (!secret || !near_amount) {
            return NextResponse.json(
                {
                    error:
                        "secret and near_amount are required parameters",
                },
                { status: 400 }
            );
        }

        console.log("secret", secret);
        
        const hash = crypto.createHash('sha256').update(secret).digest('hex');

        console.log("hash", hash);

        const transaction = ({
            signerId: accountId as string,
            receiverId: CONTRACT_ID_MIXER,
            deposit: near_amount,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: "deposit",
                        args: {
                            commitment_hash: hash,
                        },
                        gas: "100000000000000",
                        deposit: near_amount,
                    }
                }
            ],
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}