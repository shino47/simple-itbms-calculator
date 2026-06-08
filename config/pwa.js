export default function pwaGetConfig(baseURL='/') {
  return {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Simple ITBMS Calculator',
      short_name: 'SIC',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: baseURL,
      start_url: baseURL,
      icons: [
        {
          src: `${baseURL}favicon/web-app-manifest-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: `${baseURL}favicon/web-app-manifest-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff2}'],
      navigateFallback: `${baseURL}index.html`,
    },
  }
}
