module.exports = {
    apps: [{
        name: 'intrior', // Replace with your desired app name
        script: 'index.js', // Replace with the path to your main server file
        watch: false, // Set to true if you want PM2 to automatically restart on file changes
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};