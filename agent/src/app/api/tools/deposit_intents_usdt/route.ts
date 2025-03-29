import { headers } from "next/headers";
import { NextResponse } from 'next/server';

const CONTRACT_ID_INTENTS = "intents.near";
const CONTRACT_ID_USDT = "usdt.tether-token.near";

export async function GET(request: Request) {
    try {
        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string } =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);
        const { accountId } = mbMetadata || {};

        const { searchParams } = new URL(request.url);
        const usdt_amount = searchParams.get("usdt_amount");

        if (!usdt_amount) {
            return NextResponse.json(
                {
                    error:
                        "usdt_amount is required parameter",
                },
                { status: 400 }
            );
        }

        console.log("usdt_amount", usdt_amount);

        const [integerPart, decimalPart = ""] = usdt_amount.split(".");
        const fullAmount = integerPart + decimalPart.padEnd(6, "0");
        const yoctoAmount = BigInt(fullAmount).toString();

        console.log("yoctoAmount", yoctoAmount);

        const batchTransaction = ({
            signerId: accountId as string,
            receiverId: CONTRACT_ID_USDT,
            deposit: yoctoAmount,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        contractName: CONTRACT_ID_USDT,
                        methodName: "ft_transfer_call",
                        args: {
                            receiver_id: CONTRACT_ID_INTENTS,
                            amount: yoctoAmount,
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