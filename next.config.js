module.exports = {
 async rewrites() {
      return [
          {
            source: '/api/:slug*',
            destination: `http://localhost:3001/:slug*`
          },
        ]
 }
}