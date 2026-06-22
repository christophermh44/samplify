export default {
    props: [ 'name', 'color' ],

    emits: [ 'update', 'update:name', 'update:color', 'delete' ],

    template: /*html*/`
<div class="dialog-row">
    <div class="form-field">
        <label class="form-field__label">Name</label>
        <input class="form-field__input" type="text" :value="name" @input="updateName($event.target.value)">
    </div>
    <div class="form-field">
        <label class="form-field__label">Color</label>
        <input class="form-field__input" type="color" :value="color" @input="updateColor($event.target.value)" list="color-presets">
    </div>
    <button class="mis-a mbe-a" type="button" @click="$emit('delete')">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
    </button>
</div>
    `,

    methods: {
        updateName(name) {
            this.$emit('update:name', name)
            this.$emit('update', { name, color: this.color })
        },

        updateColor(color) {
            this.$emit('update:color', color)
            this.$emit('update', { name: this.name, color })
        }
    }
}