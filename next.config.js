module.exports = {
  async rewrites () {
    // var server = "https://dashboard-express-server.azurewebsites.net:443"
    let server = process.env.NEXT_PUBLIC_NODE_ENDPOINT

    // for development
    if (process.env.RMA_DEV === 'true') {
      server = 'http://localhost:3001'
    }

    if (process.env.NODE_ENV === 'test') {
      server = 'https://dashboard-express-server-test.azurewebsites.net:443'
    }

    return [
      {
        source: '/api/:slug*',
        destination: server + '/:slug*'
      }
    ]
  }
}
