// const fetcher = (api) => fetch("http://osel4401.wal-mart.com:3001" + api).then((r) => r.json());
 const fetcher = (api) => fetch("http://localhost:3001" + api).then((r) => r.json());
//const fetcher = (api) => fetch("http://wmpos2:3001" + api).then((r) => r.json());
export default fetcher;
