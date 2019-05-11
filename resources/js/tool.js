Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
            name: 'tenants',
            path: '/tenants',
            component: require('./components/Tenants'),
        },
        {
            name: 'site-settings',
            path: '/site-settings',
            component: require('./components/Settings'),
        },
    ])
})
