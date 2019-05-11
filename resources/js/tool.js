Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
            name: 'tenants',
            path: '/tenants',
            component: require('./components/Tenants'),
        },
        {
            name: 'tenant-settings',
            path: '/tenant-settings',
            component: require('./components/Settings'),
        },
    ])
})
