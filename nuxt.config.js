import i18n from './config/i18n';
import icon from './config/icon';
import pwaGetConfig from './config/pwa';
import ui from './config/ui';

const baseURL = process.env.NUXT_APP_BASE_URL || '/';

export default defineNuxtConfig({
  app: {
    baseURL,
    head: {
      title: 'Simple ITBMS Calculator',
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'SIC' },
        { name: 'theme-color', content: '#00b8db' },
      ],
      link: [
        { rel: 'icon', href: `${baseURL}favicon/favicon-96x96.png`, type: 'image/png', sizes: '96x96' },
        { rel: 'icon', href: `${baseURL}favicon/favicon.svg`, type: 'image/svg+xml' },
        { rel: 'shortcut icon', href: `${baseURL}favicon/favicon.ico` },
        { rel: 'apple-touch-icon', href: `${baseURL}favicon/apple-touch-icon.png`, sizes: '180x180' },
      ],
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  ssr: false,

  // `ssr: false` está dando problemas en Nuxt 4.4.4: https://github.com/nuxt/nuxt/issues/34957
  experimental: {
    viteEnvironmentApi: true,
  },

  css: [
    '~/assets/styles/main.css',
  ],

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
  ],

  i18n,

  icon,

  ui,

  pwa: pwaGetConfig(baseURL),

  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: false,
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'big.js',
        'idb',
      ],
    },
  },
});
