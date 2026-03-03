import { AuthProvider } from './interface'

export class GuestAuthProvider implements AuthProvider {
    constructor() {}

    getCCID(): never {
        throw new Error('Method not implemented.')
    }

    getCKID(): never {
        throw new Error('Method not implemented.')
    }

    signMaster(_data: string): never {
        throw new Error('Method not implemented.')
    }

    signSub(_data: string): never {
        throw new Error('Method not implemented.')
    }
}
