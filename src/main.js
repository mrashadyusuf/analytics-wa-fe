/* eslint-disable import/order */
import '@/@mock-api'
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import { swal, swalOptions } from '@/plugins/vue-sweetalert2'
import ability from '@/plugins/casl/ability'
import constants from '@/plugins/casl/constants'
import { abilitiesPlugin } from '@casl/vue'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'vuetify/styles'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(swal, swalOptions)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

// Provide
app.provide('$constants', constants)

app.component('VueDatePicker', VueDatePicker);

// Mount vue app
app.mount('#app')

export default app
