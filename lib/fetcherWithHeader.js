// const fetcher = (api) => fetch("http://osel4401.wal-mart.com:3001" + api).then((r) => r.json());
//const fetcher = (api, headers) => fetch("http://localhost:3001" + api, {
const fetcher = (api, headers) => fetch("http://wmpos2:3001" + api, {
  headers: headers
}).then((r) => r.json());
export default fetcher;
