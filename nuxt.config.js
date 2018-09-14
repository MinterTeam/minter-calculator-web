const nodeExternals = require('webpack-node-externals');

const BASE_TITLE = 'Minter Calculator';
const BASE_DESCRIPTION = '';

module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: BASE_TITLE,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: BASE_DESCRIPTION },
            { hid: 'og-title', name: 'og:title', content: BASE_TITLE },
            { hid: 'og-description', name: 'og:description', content: BASE_DESCRIPTION },
            { hid: 'og-image', name: 'og:image', content: '/social-share.png' },
        ],
        link: [
            { rel: 'icon', href: '/favicon.png' },
            { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' },
        ],
    },
    css: [
        './static/css/style.min.css',
    ],
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#cf5c2c' },
    router: {
        linkActiveClass: '',
        linkExactActiveClass: 'is-active',
        middleware: [

        ],
    },
    plugins: [
        { src: '~/plugins/click-blur.js', ssr: false },
        { src: '~/plugins/seo-gtag.js', ssr: false },
        { src: '~/plugins/seo-ym.js', ssr: false },
        { src: '~/plugins/seo-fb.js', ssr: false },
        { src: '~/plugins/seo-vk.js', ssr: false },
        { src: '~/plugins/seo-tw.js', ssr: false },
    ],
    /*
    ** Modules
    */
    modules: [
        '@nuxtjs/pwa',
    ],
    /*
    ** PWA manifest
     */
    manifest: {
        name: BASE_TITLE,
        short_name: BASE_TITLE,
        lang: 'en',
    },
    /*
    ** PWA meta
     */
    meta: {
        mobileAppIOS: true,
        name: BASE_TITLE,
        author: 'Minter',
        favicon: false,
    },
    /*
    ** Build configuration
    */
    build: {
        extractCSS: true,
        optimization: {
            splitChunks: {
                name: true,
            },
        },
        /*
        ** Run ESLint on save
        */
        extend(config, { isDev, isClient, isServer }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                });
            }
            /*
            ** process some node_modules through webpack in server build
            */
            // if (isServer) {
            //     config.externals = [
            //         nodeExternals({
            //             whitelist: [/^v-money/]
            //         })
            //     ]
            // }
        },
    },
};
