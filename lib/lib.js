const fetcher = (api) => fetch('/api' + api).then((r) => r.json())
export default fetcher
