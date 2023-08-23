import { keccak256 } from "ethereum-cryptography/keccak"
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"

export async function hashMessage(message){
    return toHex(keccak256(utf8ToBytes(message)))
}