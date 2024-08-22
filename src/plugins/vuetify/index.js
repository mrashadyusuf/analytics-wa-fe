import { createVuetify } from 'vuetify'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'  // Global Vuetify styles

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default createVuetify({
  defaults,
  icons,
  theme,
  components,
  directives,
})
