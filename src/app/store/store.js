import { createStore } from "vuex";

export default createStore({
    state: {
        isMobile: document.body.offsetWidth < 1024,
    },
    mutations: {
        SET_ISMOBILE(state, payload) {
            state.isMobile = payload
        }
    },
    modules: {

    }
})