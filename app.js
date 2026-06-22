import BankComponent from './components/BankComponent.js'
import CartComponent from './components/CartComponent.js'
import PanelComponent from './components/PanelComponent.js'
import { DB } from './db.js'
import { NumberVariable, TextVariable } from './variables-types.js'
import * as Vue from './vue.js'

const app = Vue.createApp({
    data() {return {
        banks: [ ],
        mode: 'play',
    }},

    computed: {
        sectionsCount: NumberVariable('sectionsCount', 2),
        rowsCount: NumberVariable('rowsCount', 6),
        colsCount: NumberVariable('colsCount', 4),
    },

    methods: {
        openSettings() {
            this.$refs.settings.showModal()
        },

        openBanks() {
            this.$refs.banks.showModal()
        },

        closeSettings() {
            this.$refs.settings.close()
        },

        closeBanks() {
            this.$refs.banks.close()
        },

        async reloadBanks() {
            this.banks = await DB.banks.toArray()
        },

        async addBank() {
            await DB.banks.add({ name: '', color: '#ffffff' })
            this.reloadBanks()
        },

        async updateBank(id, data) {
            await DB.banks.update(id, data)
            this.reloadBanks()
        },

        async deleteBank(id) {
            if (confirm('Remove this bank?')) {
                await DB.banks.delete(id)
                this.reloadBanks()
            }
        },
    },

    mounted() {
        this.reloadBanks()
    }
})

app.component('Bank', BankComponent)
app.component('Cart', CartComponent)
app.component('Panel', PanelComponent)

app.mount('[data-app]')