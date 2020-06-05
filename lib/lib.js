const fetcher = (api) => fetch("http://wmpos2:3001" + api).then((r) => r.json());
export default fetcher;
