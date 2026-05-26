export default defineAppConfig({
    logo: '',
    menu: [],
    ui: {
        primary: 'blue',
        button: {
            slots: {
                base: 'font-bold cursor-pointer',
            },
            defaultVariants: {
                size: 'xl',
                color: 'primary',
            },
        },
        notification: {
            slots: {
                root: 'ring-0',
                title: 'text-base font-semibold',
            },
        },
    },
})
