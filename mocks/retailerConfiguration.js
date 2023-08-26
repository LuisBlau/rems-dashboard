export default {
  "configuration": [
    {
      "storeDownWhenControllerDown": {
        "configName": "storeDownWhenControllerDown",
        "configValue": false,
        "configValueType": "boolean",
        "configDisplay": "Store is considered down when any controller is down",
        "configCategory": "Misc"
      }
    },
    {
      "storesOnlineWidgetErrorPercentage": {
        "configName": "storesOnlineWidgetErrorPercentage",
        "configValue": 60,
        "configValueType": "numeric",
        "configDisplay": "Stores Online Widget turns red when % of stores online is below this percentage",
        "configCategory": "Misc"
      }
    },
    {
      "pullStorePeriodically": {
        "configName": "pullStorePeriodically",
        "configValue": 2000000,
        "configValueType": "numeric",
        "configDisplay": "Store Refresh Delay (in ms)",
        "configCategory": "Misc"
      }
    },
    {
      "openTelemetry": {
        "configName": "openTelemetry",
        "configValue": "true",
        "configValueType": "boolean",
        "configDisplay": "Open Telemetry",
        "configCategory": "Misc"
      }
    },
    {
      "laneWidgetRedWhenAbovePercent": {
        "configName": "laneWidgetRedWhenAbovePercent",
        "configValue": 50,
        "configValueType": "numeric",
        "configDisplay": "Lane Widget will show as red when above X% lanes are down",
        "configCategory": "Misc"
      }
    },
    {
      "elasticSearchToken": {
        "configName": "elasticSearchToken",
        "configValue": "Basic MzQ1OTg0OmV5SnJJam9pTmpRMU5XUTFZamt5TVRVMU16SmxOemszTkRobE5USm1aVEk0WTJJeFpHSTFOekV5WlRWaU5pSXNJbTRpT2lKUFZFdGxlU0lzSW1sa0lqbzNOalEwTnpCOQ==",
        "configValueType": "string",
        "configDisplay": "Elastic Search Secret Token",
        "configCategory": "Elastic Search"
      }
    },
    {
      "assetInventoryUrl": {
        "configName": "assetInventoryUrl",
        "configValue": "https://bi-analytics-dev.toshiba-solutions.com/#/site/TGCS/views/BJsInventoryreport/InventoryReporting",
        "configValueType": "string",
        "configDisplay": "Asset Inventory Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "extractsUrl": {
        "configName": "extractsUrl",
        "configValue": "http://analytics.tabs.toshiba.com/t/TGCS/views/EXTRACTSReportrolling4-week/PASExtractsReport?:showAppBanner=false&:display_count=n&:showVizHome=n&:embed=true",
        "configValueType": "string",
        "configDisplay": "Extracts Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "registerReloadsUrl": {
        "configName": "registerReloadsUrl",
        "configValue": "http://analytics.tabs.toshiba.com/t/TGCS/views/RegisterReloadTrendsReport/ReloadTrends?:showAppBanner=false&:display_count=n&:showVizHome=n&:embed=true",
        "configValueType": "string",
        "configDisplay": "Register Reloads Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "softwareVersionsUrl": {
        "configName": "softwareVersionsUrl",
        "configValue": "http://analytics.tabs.toshiba.com/#/site/TGCS/views/DemoSoftwareVersionsReport/SoftwareVersions?:showAppBanner=false&:display_count=n&:showVizHome=n&:embed=true",
        "configValueType": "string",
        "configDisplay": "Software Versions Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "systemEventsUrl": {
        "configName": "systemEventsUrl",
        "configValue": "http://analytics.tabs.toshiba.com/t/TGCS/views/PASMediumRetailerEventsReportsdemo/MediumRetailerEventsReport?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:embed=true",
        "configValueType": "string",
        "configDisplay": "System Events Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "storeCloseUrl": {
        "configName": "storeCloseUrl",
        "configValue": "http://analytics.tabs.toshiba.com/t/TGCS/views/DemoOperationalReportX223Azure/StoreCloseReport?:showAppBanner=false&:display_count=n&:showVizHome=n&:embed=true",
        "configValueType": "string",
        "configDisplay": "Store Close Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "incidentsUrl": {
        "configName": "incidentsUrl",
        "configValue": "Under Construction",
        "configValueType": "string",
        "configDisplay": "Incidents Tableau URL",
        "configCategory": "Tableau"
      }
    },
    {
      "enterpriseOverviewStoreOnlineWidget": {
        "configName": "enterpriseOverviewStoreOnlineWidget",
        "configValue": true,
        "configValueType": "boolean",
        "configDisplay": "Show Store Online Widget on Enterprise Overview",
        "configCategory": "Enterprise Overview"
      }
    },
    {
      "elasticSearchEndpointUrl": {
        "configName": "elasticSearchEndpointUrl",
        "configValue": "",
        "configValueType": "string",
        "configDisplay": "Elastic Search Endpoint URL",
        "configCategory": "Elastic Search"
      }
    },
    {
      "commandCenterOverviewStoreOnlineWidget": {
        "configName": "commandCenterOverviewStoreOnlineWidget",
        "configValue": "false",
        "configValueType": "boolean",
        "configDisplay": "Show Store Online Widget on Command Center Overview",
        "configCategory": "Command Center Overview"
      }
    },
    {
      "enterpriseOverviewAttendedLanesUpWidget": {
        "configName": "enterpriseOverviewAttendedLanesUpWidget",
        "configValue": true,
        "configValueType": "boolean",
        "configDisplay": "Show Attended Lane Widget on Enterprise Overview",
        "configCategory": "Enterprise Overview"
      }
    },
    {
      "commandCenterOverviewAttendedLanesUpWidget": {
        "configName": "commandCenterOverviewAttendedLanesUpWidget",
        "configValue": "false",
        "configValueType": "boolean",
        "configDisplay": "Show Attended Lane Widget on Command Center Overview",
        "configCategory": "Command Center Overview"
      }
    },
    {
      "pas_subscription_tier": {
        "configName": "pas_subscription_tier",
        "configValue": "advanced",
        "configValueType": "string",
        "configDisplay": "Subscription Tier (none, lite, advanced)",
        "configCategory": "Command Center Overview"
      }
    },
    {
      "openTelemetryOnSky": {
        "configName": "openTelemetryOnSky",
        "configValue": "true",
        "configValueType": "boolean",
        "configDisplay": "Open Telemetry On Sky",
        "configCategory": "Misc"
      }
    },
    {
      "monitorDockerOnSky": {
        "configName": "monitorDockerOnSky",
        "configValue": "false",
        "configValueType": "boolean",
        "configDisplay": "Monitor Docker on Sky",
        "configCategory": "Misc"
      }
    },
    {
      "monitorSystemPerformanceOnSky": {
        "configName": "monitorSystemPerformanceOnSky",
        "configValue": "false",
        "configValueType": "boolean",
        "configDisplay": "Monitor System Performance on Sky",
        "configCategory": "Misc"
      }
    },
    {
      "b2b_subscription_active": {
        "configName": "b2b_subscription_active",
        "configValue": true,
        "configValueType": "boolean",
        "configDisplay": "B2B Subscription",
        "configCategory": "Command Center Overview"
      }
    },
    {
      "retailerTableauEmail": {
        "configName": "retailerTableauEmail",
        "configValue": "tgcs_pas_con_apps@toshibagcs.com",
        "configValueType": "string",
        "configDisplay": "Retailer Tableau Email",
        "configCategory": "Tableau"
      }
    },
    {
      "snmpdevicecount": {
        "configName": "snmpdevicecount",
        "configValue": false,
        "configValueType": "boolean",
        "configDisplay": "Show SNMP device count",
        "configCategory": "Misc"
      }
    },
    {
      "eleraDashboardurl": {
        "configName": "eleraDashboardurl",
        "configValue": "https://pas-apm.kb.us-central1.gcp.cloud.es.io:9243/app/dashboards?auth_provider_hint=anonymous1#/view/adc9dbd0-744b-11ed-a2f3-7763c1be2fed?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-7d%2Cto%3Anow))&show-time-filter=true",
        "configValueType": "string",
        "configDisplay": "Elera Health Page URL",
        "configCategory": "Misc"
      }
    },
    {
      "PoorStoreStatusPercentage": {
        "configName": "PoorStoreStatusPercentage",
        "configValue": 50,
        "configValueType": "numeric",
        "configDisplay": "Store Status is poor when % of agent online is below this percentage",
        "configCategory": "Enterprise Overview"
      }
    },
    {
      "GoodStoreStatusPercentage": {
        "configName": "GoodStoreStatusPercentage",
        "configValue": 90,
        "configValueType": "numeric",
        "configDisplay": "Store Status is good when % of agent online is above this percentage",
        "configCategory": "Enterprise Overview"
      }
    }
  ]
};
