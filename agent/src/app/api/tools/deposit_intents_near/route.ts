import { headers } from "next/headers";
import { NextResponse } from 'next/server';
import { connect, keyStores, KeyPair, transactions, utils } from "near-api-js";

const CONTRACT_ID_INTENTS = "intents.near";
const CONTRACT_ID_NEAR = "wrap.near";

export async function GET(request: Request) {
    try {
        const mbMetadataHeader = (await headers()).get("mb-metadata");
        console.log("mbMetadataHeader", mbMetadataHeader);
        const mbMetadata: { accountId: string } =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);
        const { accountId } = mbMetadata || {};

        const { searchParams } = new URL(request.url);
        const near_amount = searchParams.get("near_amount");

        if (!near_amount) {
            return NextResponse.json(
                {
                    error:
                        "near_amount is required parameter",
                },
                { status: 400 }
            );
        }

        console.log("near_amount", near_amount);

        const batchTransaction = ({
            signerId: accountId as string,
            receiverId: CONTRACT_ID_NEAR,
            deposit: near_amount,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        contractName: CONTRACT_ID_NEAR,
                        methodName: "near_deposit",
                        args: {},
                        gas: "100000000000000",
                        deposit: near_amount,
                    }
                },
                {
                    type: "FunctionCall",
                    params: {
                        contractName: CONTRACT_ID_NEAR,
                        methodName: "ft_transfer_call",
                        args: {
                            receiver_id: CONTRACT_ID_INTENTS,
                            amount: near_amount,
                            msg: '',
                        },
                        gas: "100000000000000",
                        deposit: "1",
                    }
                }
            ],
        });

        console.log("batchTransaction", batchTransaction);

        return NextResponse.json(batchTransaction);
        //return NextResponse.json({msg:"DEPOSIT"});
    } catch (error) {
        console.error("Error generating NEAR transaction payload:", error);
        return NextResponse.json(
            { error: "Failed to generate NEAR transaction payload" },
            { status: 500 }
        );
    }
}