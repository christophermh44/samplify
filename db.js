import Dexie from './dexie.js'

class DBStorage {
    #db = new Dexie('samplify')

    constructor() {
        this.#db.version(1).stores({
            banks: `
                ++id,
                name,
                color
            `,
            carts: `
                ++id,
                name,
                color,
                file,
                row,
                col,
                bank_id
            `
        })
    }

    get banks() {
        return this.#db.banks
    }

    get carts() {
        return this.#db.carts
    }
}

export const DB = new DBStorage