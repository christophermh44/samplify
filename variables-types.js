import { ref, computed } from './vue.js'

export function NumberVariable(key, initValue) {
    const _internalValue = ref(localStorage.getItem(key) ?? null)
    const obj = {
        get() {
            return Number(_internalValue.value)
        },

        set(value) {
            _internalValue.value = value
            localStorage.setItem(key, value ?? null)
        }
    }
    if (_internalValue.value === null) {
        obj.set(initValue)
    }
    return obj
}

export function TextVariable(key) {
    const _internalValue = ref(localStorage.getItem(key) ?? '')
    return {
        get() {
            return _internalValue.value
        },

        set(value) {
            _internalValue.value = value
            localStorage.setItem(key, value ?? null)
        }
    }
}

export function ArrayVariable(key) {
    const _internalValue = ref(JSON.parse(localStorage.getItem(key) ?? '[]'))
    return computed({
        get() {
            return _internalValue.value
        },

        set(value) {
            _internalValue.value = value
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}

export function ObjectVariable(key) {
    const _internalValue = ref(JSON.parse(localStorage.getItem(key) ?? '{}'))
    return computed({
        get() {
            return _internalValue.value
        },

        set(value) {
            _internalValue.value = value
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}