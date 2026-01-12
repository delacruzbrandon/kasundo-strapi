export default ({ env }) => ({
    graphql: {
        config: {
            endpoint: '/graphql',
            shadowCRUD: true,
            playgroundAlways: true, // Optional: keeps the web UI active
            apolloServer: {
                introspection: true, // <--- THIS IS THE FIX
            },
        },
    },
});