// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  plugins: [
      '~/plugins/vue-query.ts',
      '~/plugins/virtualScroller.ts'
  ]
})
