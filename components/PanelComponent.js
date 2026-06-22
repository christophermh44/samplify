import { DB } from "../db.js"

export default {
    props: [ 'index', 'mode', 'banks', 'rows', 'cols' ],

    template: /*html*/`
<section :style="{ '--rows': rows, '--cols': cols }">
    <header>
        <button type="button" @click="previousBank">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
        </button>
        <select class="header-expand" :style="{ '--color': currentBank?.color }" v-model="currentBankId">
            <option :value="bank.id" v-for="bank in banks" v-text="bank.name" :style="{ 'background-color': bank.color }"></option>
        </select>
        <button type="button" @click="nextBank">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
        </button>
    </header>
    <main class="grid">
        <template v-for="row in rows">
            <template v-for="col in cols">
                <Cart :cart="carts?.[row]?.[col]" :mode="mode" @update="updateCart(currentBankId, row, col, $event)" @delete="deleteCart(currentBankId, row, col)"></Cart>
            </template>
        </template>
    </main>
</section>
    `,

    computed: {
        currentBank() {
            return this.banks.find(b => b.id === this.currentBankId)
        }
    },

    data() {return {
        carts: [ ],
        currentBankId: null
    }},

    watch: {
        currentBankId(value) {
            localStorage.setItem(`currentBankId_${this.index}`, value)
            this.loadCarts()
        }
    },

    methods: {
        previousBank() {
            const currentIndex = this.banks.findIndex(b => b.id === this.currentBankId)
            const previousIndex = (currentIndex - 1 + this.banks.length) % (this.banks.length)
            this.currentBankId = this.banks[previousIndex].id
        },

        nextBank() {
            const currentIndex = this.banks.findIndex(b => b.id === this.currentBankId)
            const nextIndex = (currentIndex + 1) % (this.banks.length)
            this.currentBankId = this.banks[nextIndex].id
        },

        async loadCarts() {
            const carts = await DB.carts.where({ bank_id: this.currentBankId }).toArray()
            this.carts = { }
            for (const cart of carts) {
                const { row, col } = cart
                this.carts[row] = { ...(this.carts[row] ?? { }), [col]: cart }
            }
        },

        async updateCart(bank_id, row, col, cart) {
            if (!(cart.id)) {
                await DB.carts.add({
                    name: '',
                    color: '#ffffff',
                    file: cart.file,
                    row,
                    col,
                    bank_id
                })
            } else {
                await DB.carts.update(cart.id, {
                    ...(cart),
                    row,
                    col,
                    bank_id
                })
            }
            this.loadCarts()
        },

        async deleteCart(bank_id, row, col) {
            if (confirm('Empty this cart?')) {
                await DB.carts.where({ bank_id, row, col }).delete()
                this.loadCarts()
            }
        }
    },

    mounted() {
        this.currentBankId = Number(localStorage.getItem(`currentBankId_${this.index}`))
        this.loadCarts()
    }
}