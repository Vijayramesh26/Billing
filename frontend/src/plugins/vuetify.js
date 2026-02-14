// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const lightTheme = {
  dark: false,
  colors: {
    background: '#F4F7FA',
    surface: '#FFFFFF',
    primary: '#0F172A', // Black
    secondary: '#C5A065', // Gold
    error: '#DC2626',
    info: '#2196F3',
    success: '#10B981',
    warning: '#F59E0B',
    'primary-darken-1': '#020617',
    'secondary-darken-1': '#B08D55',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme,
    },
  },
  defaults: {
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'md',
      fontWeight: 'bold',
      letterSpacing: '0',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
  },
})
