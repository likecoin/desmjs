import {ProfilesExtension, setupProfilesExtension} from "./queries/profiles";
import {calculateFee, GasPrice, QueryClient} from "@cosmjs/stargate";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {DirectSecp256k1HdWallet, OfflineSigner} from "@cosmjs/proto-signing";
import {stringToPath} from "@cosmjs/crypto";
import {DesmosClient} from "./desmosclient";
import {PostsExtension, setupPostsExtension} from "./queries/posts";
import {setupSubspacesExtension, SubspacesExtension} from "./queries/subspaces";
import {OfflineAminoSigner, Secp256k1HdWallet} from "@cosmjs/amino";

export type HdPath = {
    coinType: number,
    account: number,
    change: number,
    index: number,
}

export const TEST_CHAIN_URL = "http://localhost:26657";

export const defaultGasPrice = GasPrice.fromString("0.025stake");

export const DesmosHdPath: HdPath = {
    coinType: 852,
    account: 0,
    change: 0,
    index: 0,
}

export const CosmosHdPath: HdPath = {
    coinType: 118,
    account: 0,
    change: 0,
    index: 0,
}

export const DefaultFees = {
    SaveProfile: calculateFee(100_000, defaultGasPrice),
    DeleteProfile: calculateFee(100_000, defaultGasPrice),
    DTagTransfer: calculateFee(100_000, defaultGasPrice),
    AcceptDTag: calculateFee(200_000, defaultGasPrice),
    CancelDTagTransfer: calculateFee(100_000, defaultGasPrice),
    RefuseDTagTransfer: calculateFee(100_000, defaultGasPrice),
}

export const testUser1 = {
    mnemonic: "hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet",
    dtag: "test_user_1",
    address0: "desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0",
    address1: "desmos1cywv6k7d94nyka74q7cr59yauzs690ky2ew6qx",
}

export const testUser2 = {
    mnemonic: "shine velvet envelope baby bicycle slot betray water mask cake rule useless absorb lens enable fork lake make depart slogan kiwi iron decorate relief",
    dtag: "test_user_2",
    address0: "desmos1c7ms9zhtgwmv5jy6ztj2vq0jj67zenw3gdl2gr",
    address1: "desmos1f88f8sdnt4qznzj5drnqtn279uelat402xx5yv",
}

/**
 * Creates a signer from the provided mnemonic.
 * @param mnemonic - The mnemonic passphrase used to derive the keys.
 * @param indexes - Derivation path indexes used to derive the keys.
 */
export async function signerFromMnemonic(mnemonic: string, indexes: number[] = [0]): Promise<OfflineSigner> {
    const hdPaths = indexes.map(i => `m/44'/852'/0'/${i}/0`).map(stringToPath);

    return  DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: hdPaths,
        prefix: "desmos"
    });
}

/**
 * Creates a signer from the provided mnemonic.
 * @param mnemonic - The mnemonic passphrase used to derive the keys.
 * @param paths - Derivation paths used to derive the keys.
 * @param prefix - The bech32 address prefix.
 */
export function aminoSignerFromMnemonic(mnemonic: string,
                                        paths: HdPath[] = [DesmosHdPath],
                                        prefix: string = "desmos"
): Promise<OfflineAminoSigner> {
    const hdPaths = paths.map(path => `m/44'/${path.coinType}'/${path.account}'/${path.change}/${path.index}`).map(stringToPath);

    return Secp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: hdPaths,
        prefix
    });
}

/**
 * Creates a desmos client that sign the transaction using the keys derived from the provided mnemonic.
 * @param mnemonic - The mnemonic passphrase used to derive the keys.
 * @param indexes - Derivation path indexes used to derive the keys.
 */
export async function desmosClientFromMnemonic(mnemonic: string, indexes: number[] = [0]): Promise<DesmosClient> {
    const signer = await signerFromMnemonic(mnemonic, indexes);
    const client = DesmosClient.withSigner(TEST_CHAIN_URL, signer);
    await client.connect();

    return client;
}

export async function makeProfilesClient(
    endpoint: string,
): Promise<QueryClient & ProfilesExtension> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return QueryClient.withExtensions(tmClient, setupProfilesExtension);
}

export async function makePostsClient(
    endpoint: string,
): Promise<QueryClient & PostsExtension> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return QueryClient.withExtensions(tmClient, setupPostsExtension);
}

export async function makeSubspacesClient(
    endpoint: string,
): Promise<QueryClient & SubspacesExtension> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return QueryClient.withExtensions(tmClient, setupSubspacesExtension);
}