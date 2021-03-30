export interface PassportData {
    name: string,
    passport: string,
    email: string,
    maturity: number,
    created: number
}

/**
 * Shared between server and app
 * when checking vault
 */
export interface UnlockPassportEntity {
    i: string, // id of the passport
    cs: string, // control share, may be empty string when passport is not mature
    m: number,  // passport maturity, in weeks
    ct: number,  // creation timestamp
    mts: number // maturity timestamp - date when passport becomes mature 
}

/**
 * Stored on server with both shares: 
 * keyControllShare
 * keyUnlockShare
 */
export interface CloudPassportEntity extends UnlockPassportEntity{
    us: string, //  unlock share, sent to the user when passport is matured
    e: string // unlock email
}

export interface WalletData {
    a: string, // address
    w: string, // encrypted wallet wif
    ct: number,
    mt: number
}

export interface WalletBalance {
    data: {
        address: string,
        balance: number,
        spent: number,
        received: number,
        time: number
    }
}

export interface WalletTransaction {
    _id: string,
    address:string,
    txid:string,
    value: number,
    time:number
}

export interface PendingOrder {
    _id: string,    // internal, unique id
    value: number, // amount
    oid: string,    // order id
    txid: string,   // transaction id
    ct: number  // creation timestamp
}

