import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "NEAR Intents ZCash API",
            description: "API to interact with NEAR Intents and ZCash",
            version: "1.0.0",
        },
        servers: [
            {
                url: "https://near-intents-zcash.vercel.app",
            },
        ],
        "x-mb": {
            "account-id": ACCOUNT_ID,
            assistant: {
                name: "NEAR Intents ZCash Assistant",
                description: "API to interact with NEAR Intents and ZCash",
                instructions : `
                    You are an assistant designed to interact with NEAR Intents and ZCash. 
                    Your main functions are: 
                    1.- Deposit NEAR token to Intents: /api/tools/deposit_intents_near: follow these steps:
                        1. Ensure the amount of NEAR is correctly attached to the transaction.
                        2. If the user requests a deposit, **always include the exact \`amount\` in yoctos**. Convert NEAR to yoctos (1 NEAR = 10^24 yoctos).
                        3. If the attached deposit amount is \`0\` or missing, **do not proceed with the transaction** and instead ask the user to retry.
                        4. Before responding, print the transaction details to verify correctness.
                        5. Send the information to path /api/tools/deposit_intents_near
                        6. Create  NEAR transaction and attach the deposit amount in the transaction data**

                    2.- Deposit USDT to Intents Contract: /api/tools/deposit_intents_usdt

                    3.- Get Balance of USDT from Intents Contract: /api/tools/balance_intents_usdt: Take the NEAR account ID as a parameter and return the balance of USDT tokens for that account. (Take the account_id automatically from the wallet);

                    4.- Get Balance of NEAR from Intents Contract:  /api/tools/balance_intents_near: Take the NEAR account ID as a parameter and return the balance of NEAR tokens for that account. (Take the account_id automatically from the wallet);

                    5.- Withdraw NEAR from Intents Contract/api/tools/withdraw_intents_near

                    6.- Deposit NEAR to Mixer Contract: /api/tools/deposit_mixer_near: follow these steps:
                        1. Notify the user that once the deposit has been made, must wait 24 hours to make the withdrawal before proceeding with the transaction.
                        2. Show the hash of the secret to the user.
                        3. Notify the user that the same secret is used to withdraw the NEAR tokens.

                    7.- Withdraw NEAR from Mixer Contract: /api/tools/withdraw_mixer_near
                        
                `,
                tools: [{ type: "generate-transaction" }, { type: "generate-evm-tx" }, { type: "sign-message" }],
                image: "https://z.cash/wp-content/uploads/2023/03/zcash-logo.gif",
                categories: ["DeFi"],
            }
        },
        paths: {
            "/api/tools/deposit_intents_near": {
                get: {
                    summary: "Deposit NEAR to NEAR Intents Contract",
                    description: "This endpoint allows you to deposit NEAR tokens to Intents Contract.",
                    operationId: "deposit_intents_near",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID",
                        },
                        {
                            name: "near_amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of NEAR tokens to deposit, (attached to the transaction)",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            "/api/tools/deposit_intents_usdt": {
                get: {
                    summary: "Deposit USDT to NEAR Intents Contract",
                    description: "This endpoint allows you to deposit USDT tokens to the NEAR Intents Contract",
                    operationId: "deposit_intents_usdt",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID",
                        },
                        {
                            name: "usdt_amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of USDT tokens to deposit",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            "/api/tools/balance_intents_usdt": {
                get: {
                    summary: "Get Balance of USDT",
                    description: "This endpoint allows you to get the balance of USDT tokens for a given NEAR account ID",
                    operationId: "balance_intents_usdt",
                    parameters: [
                        {
                            name: "account_id",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            "/api/tools/balance_intents_near": {
                get: {
                    summary: "Get Balance of NEAR",
                    description: "This endpoint allows you to get the balance of NEAR tokens for a given NEAR account ID",
                    operationId: "balance_intents_near",
                    parameters: [
                        {
                            name: "account_id",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            "/api/tools/deposit_mixer_near": {
                get: {
                    summary: "Deposit NEAR to Mixer Contract",
                    description: "This endpoint allows you to deposit NEAR tokens to the Mixer Contract and transfer anonymously",
                    operationId: "deposit_mixer_near",
                    parameters: [
                        {
                            name: "secret",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "secret to create a commitment_hash",
                        },
                        {
                            name: "near_amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of NEAR tokens to deposit, (attached to the transaction)",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            "/api/tools/withdraw_mixer_near": {
                get: {
                    summary: "Withdraw NEAR from NEAR Intents Contract",
                    description: "This endpoint allows you to withdraw NEAR tokens from the NEAR Intents Contract",
                    operationId: "withdraw_mixer_near",
                    parameters: [
                        {
                            name: "secret",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "secret to create a commitment_hash",
                        },
                        {
                            name: "recipient",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID of the recipient",
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    signerId: {
                                                        type: "string",
                                                        description: "The signer's NEAR account ID",
                                                    },
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                }
            }
        },
    };

    return NextResponse.json(pluginData);
}