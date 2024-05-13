/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import copyText from '@meforma/vue-copy-to-clipboard'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(mavonEditor).use(copyText)
}
