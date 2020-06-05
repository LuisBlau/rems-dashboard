let labStores = new Map([["0301","10.89.192.11/12"],
  ["5869","10.89.192.34"],
  ["0743","10.89.192.50"],
  ["0043","10.89.193.2"],
  ["5566","10.89.192.66"],
  ["0001","10.89.192.82"],
  ["5516","10.89.192.114"],
  ["0458","10.89.71.66"],
  ["0001","10.89.74.11"],
  ["0005","10.89.74.34"],
  ["0482","10.89.74.66"],
  ["5831","10.89.65.162"],
  ["0455","10.89.70.231"],
  ["0416","10.89.66.2"],
  ["0415","10.89.65.226"],
  ["0453","10.89.70.162"],
  ["5516","10.89.65.130"],
  ["0451","10.89.70.98"]])

export const splunkLinker = (store, country) => "https://cpc-logsearch02.prod.us.walmart.net/en-US/app/check-out-with-mewebpos/search?display.page.search.mode=fast&dispatch.sample_ratio=1&q=search%20index%3D%22wcnp_cpc%22%20log.clientApp%3DKIOSK%20log.enterpriseId%3D%22prod%22%20log.tagName%3DCLIENT_INITIALIZATION%20log.storeId%3D" + store + "%20log.clientApp%3DKIOSK%20%20log.countryCode%3D" + country + "%20log.registerNbr%3D*%20log.message.cartHasItems%3D*%20time%3D*%20%7C%20stats%20%20count%20by%20log.countryCode%2C%20log.storeId%2C%20log.registerNbr%2C%20log.registerType%2C%20log.message.cartHasItems%2C%20time%20%20%7C%20streamstats%20%20count%20as%20%22%20%22%20%20%7C%20table%20%20%22%20%22%2C%20log.countryCode%2C%20log.storeId%2C%20log.registerNbr%2C%20log.registerType%2C%20log.message.cartHasItems%2C%20time&earliest=-1w&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1588275671.2401163_F9FCF295-CD24-43DE-A61A-7BF4055B56AA"
export const storeLinker = (store, country) => {
  if (labStores.has(store)) {
    console.log(labStores)
    return "https://" + labStores.get(store) + ":8443"
  } else {
    return "https://cpp.s0" + store + "." + country + ".wal-mart.com:8443/"
  }
}
export const registerStatusLinker = (store) => "http://wmpos2/html/register-status.html?store=" + store