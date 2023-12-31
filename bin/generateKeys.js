import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

import { generateKeypair } from "midori/util/keys.js";

if (!existsSync('./keys')) {
    await mkdir('./keys');
}

const { publicKey: jwsPublicKey, privateKey: jwsPrivateKey } = generateKeypair('rsa');
await writeFile('./keys/jws_public.pem', jwsPublicKey, { encoding: 'utf8' });
await writeFile('./keys/jws_private.pem', jwsPrivateKey, { encoding: 'utf8' });

const { publicKey: jwePublicKey, privateKey: jwePrivateKey } = generateKeypair('rsa');
await writeFile('./keys/jwe_public.pem', jwePublicKey, { encoding: 'utf8' });
await writeFile('./keys/jwe_private.pem', jwePrivateKey, { encoding: 'utf8' });
