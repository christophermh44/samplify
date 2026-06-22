export default {
    props: [ 'cart', 'mode' ],

    template: /*html*/`
<div class="cart-wrapper">
    <button type="button" class="cart" @click="touch" :disabled="loading" :style="{ '--color': cart?.color, color: cart?.color ? 'black' : 'revert' }">
        <span class="cart__status" v-if="cart && routine">Playing</span>
        <span class="cart__status" v-else-if="loading">Loading...</span>
        <span class="cart__name" v-text="cart?.name"></span>
        <span class="cart__current" v-text="format(currentTime)"></span>
        <span class="cart__duration" v-text="format(duration)"></span>
        <progress class="cart__progress" :value="currentTime" :max="duration"></progress>
    </button>
    <dialog ref="editor">
        <header>
            <h2>Cart editor</h2>
            <button type="button" @click="closeEditor">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
        </header>
        <main>
            <template v-if="cart">
                <div class="form-field">
                    <label class="form-field__label">Name</label>
                    <input class="form-field__input" type="text" :value="name" @input="updateName($event.target.value)">
                </div>
                <div class="form-field">
                    <label class="form-field__label">Color</label>
                    <input class="form-field__input" type="color" :value="color" @input="updateColor($event.target.value)" list="color-presets">
                </div>
                <div class="form-field">
                    <label class="form-field__label">File</label>
                    <input class="form-field__input" type="file" :value="file" @input="updateFile($event.target.files)" ref="file" accept="audio/*">
                </div>
                <button type="button" @click="deleteCart">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
                    Remove
                </button>
            </template>
            <template v-else>
                <div class="form-field">
                    <label class="form-field__label">Add a file</label>
                    <input class="form-field__input" type="file" :value="file" @input="updateFile($event.target.files)" ref="file" accept="audio/*">
                </div>
            </template>
        </main>
    </dialog>
</div>
    `,

    data() {return {
        name: '',
        color: '',
        file: null,
        audio: null,
        routine: null,
        currentTime: 0,
        duration: 0,
        cartGain: null,
        previewGain: null,
        loading: false,
        loadPromise: null
    }},

    watch: {
        'cart.name'() {
            this.name = this.cart?.name
        },

        'cart.color'() {
            this.color = this.cart?.color
        },

        'cart.file'() {
            if (this.cart?.file) {
                if (this.audio) {
                    this.audio.pause()
                    URL.revokeObjectURL(this.audio.src)
                }
                this.audio = new Audio(URL.createObjectURL(this.cart.file))
                this.audio.addEventListener('loadedmetadata', () => {
                    this.duration = this.audio.duration
                })
            }
        }
    },

    methods: {
        touch() {
            switch (this.mode) {
                case 'play': {
                    if (this.audio.paused) {
                        this.play()
                    } else {
                        this.pause()
                    }
                    break
                }
                case 'edit': {
                    this.edit()
                    break
                }
            }
        },

        startRoutine() {
            this.routine = setTimeout(() => {
                this.startRoutine()
            }, 100)
            this.currentTime = this.audio.currentTime
            if (this.audio.ended) {
                this.stopRoutine()
                this.currentTime = 0
            }
        },

        stopRoutine() {
            clearTimeout(this.routine)
            this.routine = null
        },

        play() {
            this.audio.currentTime = 0
            this.audio.play()
            this.startRoutine()
        },

        pause() {
            this.audio.pause()
            this.stopRoutine()
        },

        edit() {
            this.$refs.editor.showModal()
        },

        closeEditor() {
            this.$refs.editor.close()
        },

        updateName(name) {
            this.$emit('update', { ...(this.cart), name })
        },

        updateColor(color) {
            this.$emit('update', { ...(this.cart), color })
        },
        
        updateFile([ file ]) {
            console.log('updateFile called with file:', file?.name, 'size:', file?.size, 'type:', file?.type)
            const fileReader = new FileReader
            fileReader.onloadend = ({ target }) => {
                try {
                    const blob = new Blob([ target.result ], { type: file.type })
                    console.log('File converted to blob, size:', blob.size)
                    this.$emit('update', { ...(this.cart), file: blob })
                } catch (e) {
                    console.error('Error converting file to blob:', e)
                }
            }
            fileReader.onerror = (err) => {
                console.error('FileReader error:', err)
            }
            fileReader.readAsArrayBuffer(file)
        },

        deleteCart() {
            this.$emit('delete')
        },

        format(seconds) {
            const mm = Math.floor(seconds / 60)
            const [ s0, s1, s2 ] = ('' + Math.round((seconds - mm * 60) * 10)).padStart(3, '0')
            return `${mm}:${s0}${s1}.${s2}`
        }
    }, 

    mounted() {
        this.name = this.cart?.name
        this.color = this.cart?.color

        if (this.cart?.file) {
            this.audio = new Audio(URL.createObjectURL(this.cart.file))
            this.audio.addEventListener('loadedmetadata', () => {
                this.duration = this.audio.duration
            })
        }
    }
}