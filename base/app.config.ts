export default defineAppConfig({
    logo: '',
    menu: [],
    ui: {
        primary: 'blue',
        select: {
            size: {
                xl: 'text-lg'
            },
            padding: {
                xl: 'px-4 py-3'
            },
        },
        selectMenu: {
            option: {
                size: 'text-lg',
                base: 'cursor-pointer',
            },
            input: 'text-lg'
        },
        formGroup: {
            size: {
                '2xl': 'text-lg'
            },
            label: {
                required: "after:content-['*'] after:ms-0.5 after:text-inherit"
            },
            default: {
                size: '2xl'
            }
        },
        input: {
            size: {
                '2xl': 'text-lg'
            },
            padding: {
                '2xl': 'px-4 py-3'
            },
            icon: {
                size: {
                '2xl': 'h-5 w-5'
                },
                trailing: {
                padding: {
                    '2xl': 'px-3.5'
                }
                },
            },
            default: {
                size: '2xl'
            }
        },
        checkbox: {
            base: 'cursor-pointer mt-2 h-6 w-6',
            label: 'text-lg cursor-pointer',
            default: {
                color: 'primary'
            }
        },
        button: {
            slots: {
                base: 'font-bold cursor-pointer',
            },
            variant: {
                solid: 'shadow-sm text-white dark:text-gray-900 bg-{color}-600 hover:bg-{color}-700 disabled:bg-{color}-600 aria-disabled:bg-{color}-600 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 dark:aria-disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-600 dark:focus-visible:outline-{color}-400'
            },
            color: {
                white: {
                    solid: 'disabled:bg-gray-50 disabled:ring-gray-50 disabled:text-gray-400'
                }
            },
            default: {
                size: 'xl',
                color: 'green',
                cursor: 'pointer',
            },
        },
        notification: {
            background: 'bg-{color}-100',
            title: 'text-base font-semibold',
            ring: 'ring-0',
        },
    },
})
