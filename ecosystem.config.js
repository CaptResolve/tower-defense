module.exports = {
    apps: [
        {
            name: 'tower-defense',
            script: '/usr/bin/python3',
            args: '-m http.server 8084',
            cwd: '/opt/workflows/tower-defense/public',
            autorestart: true,
            watch: false,
            max_memory_restart: '100M',
            error_file: '/opt/workflows/tower-defense/logs/error.log',
            out_file: '/opt/workflows/tower-defense/logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
