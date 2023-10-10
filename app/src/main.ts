import { App, createApp } from 'vue'
import './style.css'
import AppComponent from './App.vue'
import router from './app/router/router'
import store from './app/store/store'
import "vue-toastification/dist/index.css";
import Toast, { POSITION } from "vue-toastification";


function main() {
    const app: App<Element> = createApp(AppComponent)
    settings(app)
    app.mount('#app')
}

function settings(app: App<Element>) {
    app.use(router)
    app.use(store)
    app.use(Toast, {
        position: POSITION.TOP_RIGHT,
        timeout: 4000,
        transition: "Vue-Toastification__slideBlurred",
    })
    setListeners()
}

function setListeners() {
    window.addEventListener("resize", () => { store.commit("SET_ISMOBILE", document.body.offsetWidth < 1024) })
}

main()