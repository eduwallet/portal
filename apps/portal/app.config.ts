import * as packageJson from './package.json'

export default defineAppConfig({
    appName: packageJson.name,
    appType: 'portal',
    logo: () => '/images/logo.svg',
    menu: () => [],
    ui: {
        primary: 'green',
    },
})
