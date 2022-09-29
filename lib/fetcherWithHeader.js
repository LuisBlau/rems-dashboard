const fetcher = (api, headers) => fetch('/api' + api, {
  headers
}).then((r) => r.json())
export default fetcher
