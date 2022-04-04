module.exports = {
    serverRuntimeConfig: {
        secret: 'YourSecretKey'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'http://localhost:3000/api' // production api
    },
    env: {
        CLIENT_URL:
            process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000' // sheliak-client dev url
            : 'http://localhost:3000', // sheliak-client production url
        SHELIAK_URL:
            process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000' // sheliak dev api url
            : 'http://localhost:8000', // sheliak production api url
    },
    module: {
        rules: [
          //...
          {
            test: /\.(png|jp(e*)g|svg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'images/[hash]-[name].[ext]',
                },
              },
            ],
          },
        ],
      },
}
