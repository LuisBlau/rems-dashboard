import MockAdapter from "axios-mock-adapter";
import stores from './stores';
import retailers from './retailers';
import deployConfigs from "./deployConfigs";
import deploys from "./deploys";

export default function mockAxios(axios) {
  const mock = new MockAdapter(axios, { delayResponse: 300 });
  let userDetail = {
    "_id": "63ea4c9bd6e19c0470d6e403",
    "firstName": "Cirrus",
    "lastName": "Hazard",
    "email": "cirrus.hazard@toshibagcs.com",
    "retailer": [
      "All"
    ],
    "role": [
      "user",
      "admin",
      "devops",
      "support",
      "commandCenterViewer",
      "toshibaAdmin"
    ],
    "userDefinedMapConfig": {
      "userMapZoom": 5,
      "userMapCenter": {
        "lat": 3.508305940347976,
        "lng": -64.6462559143135
      }
    }
  };

  mock.onGet(/REMS\/getAllRetailerDetails/g).reply(() => {
    return [200, retailers];
  });

  mock.onGet(/REMS\/allStores/g).reply(() => {
    return [200, stores];
  });

  mock.onGet(/stores?retailerId=/g).reply(() => {
    return [200, stores.filter(o => o.retailer_id === 'T0BW8U2')];
  });

  mock.onGet(/REMS\/getUserDetails/g).reply(() => {
    return [200, userDetail];
  });

  mock.onPost(/REMS\/userSettingsSubmission/g).reply(() => {
    return [200, {}];
  });

  mock.onGet(/retailerId=common/g).reply(() => {
    return [200, deployConfigs.filter(x=>x.retailer_id === 'common')];
  });

  mock.onGet(/retailerId=T0USAVE/g).reply(() => {
    return [200, deployConfigs.filter(x=>x.retailer_id !== 'common')];
  });

  mock.onGet(/REMS\/deploys/g).reply(() => {
    return [200, deploys];
  });

  return mock;
}
