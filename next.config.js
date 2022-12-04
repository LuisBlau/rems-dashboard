module.exports = {
  async rewrites () {
    const server = process.env.NEXT_PUBLIC_NODE_ENDPOINT

    return [
      {
        source: '/api/:slug*',
        destination: server + '/:slug*'
      }
    ]
  }
}
