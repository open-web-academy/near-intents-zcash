import {
  deserializeSignMessageParams,
  serializeSignMessageParams,
} from "@src/utils/myNearWalletAdapter"
import { expect, it } from "vitest"

it("should serialize/deserialize message to sign", () => {
  const obj = {
    message: "Hey",
    recipient: "wrap.near",
    nonce: Buffer.from("random"),
    callbackUrl: "https://example.com",
    state: "foo",
  }

  expect(deserializeSignMessageParams(serializeSignMessageParams(obj))).toEqual(
    obj
  )
})
