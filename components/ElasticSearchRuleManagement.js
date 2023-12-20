/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import UserContext from '../pages/UserContext';
import base64 from 'base-64';
import { Modal, Typography, Button, TextField, Switch, Chip, Select, MenuItem, FormControl, InputLabel, Tooltip, CircularProgress, Snackbar, Alert, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

const LabelWithTooltip = ({ label, tooltip }) => (
  <div>
    {label}
    <Tooltip title={tooltip} arrow>
      <IconButton size="small">
        <HelpIcon />
      </IconButton>
      <style>{`
        .MuiTooltip-tooltip {
          font-size: 14px;
        }
      `}</style>
    </Tooltip>
  </div>
);

const ElasticSearchRuleComponent = () => {
  const context = useContext(UserContext);
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data is loaded
  const [token, setToken] = useState(''); // Initialize with empty string
  const [baseURI, setBaseURI] = useState(''); // Initialize with empty string
  const [minInterval, setMinInterval] = useState(''); // Initialize with empty string
  const [selectedRowData, setSelectedRowData] = useState(null); // State to store the data of the selected row for updating
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [tagInput, setTagInput] = useState(''); // State to manage individual tags
  const [tags, setTags] = useState([]); // State to store tags as an array
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  //Set defaults
  const [newRowData, setNewRowData] = useState({ Comparator: '>=', AggType: 'count', FilterQuery: 'labels.http_route: "/pos/order/{orderId}/{version}/complete" and http.response.status_code: 200 and url.path: *', Interval: '', Name: '', Threshold: '', Last: '', CreateSNOW: 'false' });
  const [selectedRowDeepCopy, setSelectedRowDataCopy] = useState(null);

  //Validations
  const [isIntervalValid, setIsIntervalValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isThresholdValid, setIsThresholdValid] = useState(false);
  const [isLastValid, setIsLastValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  //These are my select options
  const filterQueries = [
    { name: 'Aborted Transactions', query: 'labels.http_route: "/pos/order/{orderId}/{version}/void" and url.path : *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/void\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Successfully Completed Transactions', query: 'labels.http_route: "/pos/order/{orderId}/{version}/complete" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/complete\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Suspended Transaction', query: 'labels.http_route: "/pos/order/{orderId}/{version}/suspend" and url.path : *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/suspend\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Tender Error', query: 'labels.http_route: "/pos/order/{orderId}/{version}/payment/add" and http.response.status_code: * and NOT http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/payment/add\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"http.response.status_code\"}}],\"minimum_should_match\":1}},{\"bool\":{\"must_not\":{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}}}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Till Opened', query: 'labels.http_route :"/cash-management/till/open" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/cash-management/till/open\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Till Picked Up', query: 'labels.http_route :"/cash-management/till/{tillId}/pickup" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/cash-management/till/{tillId}/pickup\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Till Closed', query: 'labels.http_route :"/cash-management/till/{id}/close" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/cash-management/till/{id}/close\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Till Suspended', query: 'labels.http_route :"/cash-management/till/{id}/suspend" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/cash-management/till/{id}/suspend\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Till Loaned', query: 'labels.http_route :"/cash-management/till/{tillId}/loan" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/cash-management/till/{tillId}/loan\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Authorization/Manager Override Successful', query: 'labels.http_route: "/authorization/login" and http.response.status_code: * and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/authorization/login\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"http.response.status_code\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Failed Authorization', query: 'labels.http_route: "/authorization/login" and http.response.status_code: * and NOT http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/authorization/login\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"http.response.status_code\"}}],\"minimum_should_match\":1}},{\"bool\":{\"must_not\":{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}}}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Operator Sign-In', query: 'labels.http_route :"/endpoint-status/{deviceId}/operator-sign-in" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/endpoint-status/{deviceId}/operator-sign-in\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Operator Sign-Out', query: 'labels.http_route :"/endpoint-status/{deviceId}/operator-sign-out" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/endpoint-status/{deviceId}/operator-sign-out\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Refund Transactions Processed', query: 'labels.http_route : "/pos/order/{orderId}/{version}/process-payment-refunds" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/process-payment-refunds\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Items Couponed/Price Reduced', query: 'labels.http_route: "/pos/order/{orderId}/{version}/item/{orderItemId}/{orderItemPriceId}/price-modification/manual/add" and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/item/{orderItemId}/{orderItemPriceId}/price-modification/manual/add\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Order Couponed/Price Reduced', query: 'labels.http_route: "/pos/order/{orderId}/{version}/price-modification/manual/add" AND http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/price-modification/manual/add\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' },
    { name: 'Items Added to Order', query: '(labels.http_route :"/pos/order/{orderId}/{version}/barcode/add" or labels.http_route: "/pos/order/barcode/add") and http.response.status_code: 200 and url.path: *', jsonQuery: '{\"bool\":{\"filter\":[{\"bool\":{\"should\":[{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/{orderId}/{version}/barcode/add\"}}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"term\":{\"labels.http_route\":{\"value\":\"/pos/order/barcode/add\"}}}],\"minimum_should_match\":1}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"match\":{\"http.response.status_code\":\"200\"}}],\"minimum_should_match\":1}},{\"bool\":{\"should\":[{\"exists\":{\"field\":\"url.path\"}}],\"minimum_should_match\":1}}]}}' }
  ];

  const comparators = [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '>=', label: 'Greater than or equal to' },
    { value: '<=', label: 'Less than or equal to' },
  ];

  //Created a ticket to expand these
  const aggTypeOptions = [
    { value: 'count', label: 'Count' },
  ];

  const snowEventOptions = [
    { value: 'false', label: 'False' },
    { value: 'true', label: 'True' }
  ]

  useEffect(() => {
    if (context?.retailerConfigs.length > 0 && context?.selectedRetailer) {
      const configurationArray = context.retailerConfigs;
      const configurationInfo = [];
      configurationArray.forEach(configObject => {
        const innerArray = Object.values(configObject)[0];
        configurationInfo.push(innerArray);
      });

      //Need to do create the encoded credentials
      const user = configurationInfo.find(item => item.configName === 'elasticSearchServiceAccName').configValue;
      const pass = configurationInfo.find(item => item.configName === 'elasticSearchServiceAccPass').configValue;
      const encodedToken = base64.encode(`${user}:${pass}`)

      //Grab the baseURI from the config, we'll use this for our API calls
      const configBaseURI = configurationInfo.find(item => item.configName === 'elasticSearchBaseURI').configValue;

      //Grab the min allowable interval from the config
      const configMinInterval = configurationInfo.find(item => item.configName === 'elasticSearchRuleMinInterval').configValue;

      //Set values
      setToken(encodedToken);
      setBaseURI(configBaseURI);
      setMinInterval(configMinInterval);

      //Set flag to let us know that the data loaded
      setDataLoaded(true);
    }
  }, [context?.selectedRetailer, context?.retailerConfigs]);

  const fetchDataFromElasticsearch = () => {
    setIsLoading(true); // Set loading state to true when fetching data
    axios
      .get(`/api/esalert/rules?baseURI=${baseURI}&token=${token}`)
      .then(function (response) {
        const metricThresholdAlerts = response.data.filter(o => o.rule_type_id === 'metrics.alert.threshold');

        const initRowsData = new Set();
        const initRowsIdSet = new Set();
        let hasDuplicates = false;

        metricThresholdAlerts.forEach((alert) => {
          var alertEmail;
          for (var i = 0; i < alert.actions.length; i++) {
            var actionsObj = alert.actions[i];

            //Grab the first email address associated with this alert
            if (actionsObj.id === 'elastic-cloud-email') {
              alertEmail = actionsObj.params.to[0];
              break;
            }
          }

          const data = {
            id: alert.id,
            Name: alert.name,
            FilterQuery: alert.params.filterQueryText,
            AggType: alert.params.criteria[0].aggType,
            Comparator: alert.params.criteria[0].comparator,
            Threshold: alert.params.criteria[0].threshold[0],
            TimeSize: alert.params.criteria[0].timeSize,
            TimeUnit: alert.params.criteria[0].timeUnit,
            Tags: alert.tags.join(', '),
            ConnectorName: alert.actions.map(i => i.connector_type_id).join(', '),
            Type: alert.rule_type_id,
            Enabled: alert.enabled,
            Interval: alert.schedule.interval,
            LastExec: formatTimeAgo(alert.execution_status.last_execution_date),
            Last: alert.params.criteria[0].timeSize + alert.params.criteria[0].timeUnit,
            Email: alertEmail ? alertEmail : ''
          }

          //This handles my conversion between key/value. I need these data to be in certain forms depending on what I'm doing
          //If I'm presenting the information, I want that in a form that is readable. Example: Less than or equal to instead of <=
          var matchingQuery = filterQueries.find((queryObj) => queryObj.query === data.FilterQuery.trim());
          var foundMatch = true;
          if (matchingQuery) {
            data.FilterQueryLabel = matchingQuery.name;
          } else {
            foundMatch = false;
          }

          var comparatorObj = comparators.find((queryObj) => queryObj.value === data.Comparator);
          if (comparatorObj) {
            data.Comparator = comparatorObj.label;
          } else {
            foundMatch = false;
          }

          if (foundMatch && addUniqueItem(data, initRowsData, initRowsIdSet)) {
            hasDuplicates = true;
          }
        });

        if (hasDuplicates) {
          // If duplicates were found, call the function again to fetch the data.
          // Looks like ES has a bug where it will sometimes send a duplicated rule
          // Rather than handling that duplicated id, i'd rather re-pull to ensure that our data is good
          fetchDataFromElasticsearch();
        } else {
          // Set the state with the data for multiple rows
          setRows(Array.from(initRowsData));
          setIsLoading(false); // Set loading state to false when the operation is completed to remove loading animation
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
        setIsLoading(false); // Set loading state to false when the operation is completed to remove loading animation
      })
  };

  useEffect(() => {
    if (dataLoaded) {
      // Fetch data from Elasticsearch initially
      fetchDataFromElasticsearch();
    }
  }, [baseURI, token, dataLoaded, context?.retailerConfigs]);

  const addUniqueItem = (item, initRowsData, initRowsIdSet) => {
    const id = item.id;
    if (!initRowsIdSet.has(id)) {
      initRowsIdSet.add(id);
      initRowsData.add(item);
      return false;
    }
    return true;
  };

  const columns = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'AggType',
      headerName: 'Aggregate Type',
      flex: 1,
    },
    {
      field: 'Comparator',
      headerName: 'Comparator',
      flex: 1,
    },
    {
      field: 'Threshold',
      headerName: 'Threshold',
      flex: 1,
    },
    {
      field: 'Last',
      headerName: 'During Last',
      flex: 1,
    },
    {
      field: 'Interval',
      headerName: 'Periodic Check',
      flex: 1,
    },

    {
      field: 'Tags',
      headerName: 'Tags',
      flex: 1,
    },
    {
      field: 'ConnectorName',
      headerName: 'Action',
      flex: 1,
    },
    {
      field: 'LastExec',
      headerName: 'Last Executed',
      flex: 1,
    },
    {
      field: 'Enabled',
      headerName: 'Enabled',
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.Enabled}
          onChange={() => handleToggleEnable(params.row.id, !params.row.Enabled)}
          name={`enabled-${params.row.id}`}
          color="primary"
        />
      ),
    },
    {
      field: 'Edit',
      headerName: 'Edit',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEditRow(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteRow(params.row.id)}
        >
          Delete
        </Button>
      ),
    }
  ];

  const handleIntervalChange = (value) => {
    if (selectedRowData) {
      setSelectedRowData({ ...selectedRowData, Interval: value })
    } else {
      setNewRowData({ ...newRowData, Interval: value });
    }
    setIsIntervalValid(isValidInterval(value));
  };

  const handleNameChange = (value) => {
    if (selectedRowData) {
      setSelectedRowData({ ...selectedRowData, Name: value })
    } else {
      setNewRowData({ ...newRowData, Name: value });
    }

    setIsNameValid(value.trim() !== '');
  };

  const handleThresholdChange = (value) => {
    if (selectedRowData) {
      setSelectedRowData({ ...selectedRowData, Threshold: value })
    } else {
      setNewRowData({ ...newRowData, Threshold: value });
    }

    var isValid = true;
    if (value === "" || isNaN(Number(value))) {
      isValid = false;
    }
    setIsThresholdValid(isValid);
  };

  const handleLastChange = (value) => {
    if (selectedRowData) {
      setSelectedRowData({ ...selectedRowData, TimeSize: value })
    } else {
      setNewRowData({ ...newRowData, TimeSize: value });
    }
    setIsLastValid(isValidLast(value));
  };

  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is not empty and matches the expected format
    return email === '' || emailRegex.test(email);
  };

  const handleEmailChange = (value) => {
    if (selectedRowData) {
      setSelectedRowData({ ...selectedRowData, Email: value })
    } else {
      setNewRowData({ ...newRowData, Email: value });
    }
    setIsEmailValid(isValidEmail(value));
  };


  const handleOpenSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    sanitizeForms();
  };

  const handleDeleteRow = (id) => {
    setIsLoading(true);
    axios
      .delete(`/api/esalert/rules?ruleId=${id}&baseURI=${baseURI}&token=${token}`)
      .then(function (response) {
        if (response.status === 204) {
          // Remove the deleted row from the state
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
          handleOpenSnackbar(`Rule has been successfully deleted.`, 'success');
        } else {
          console.error(`Failed to delete rule`);
          handleOpenSnackbar(`Failed to delete rule`, 'error');
        }

      })
      .catch(function (error) {
        console.error('Error:', error.response.data);
        handleOpenSnackbar(`Error: ${error.response.data}`, 'error');
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const sanitizeForms = () => {
    setTags([]);
    setTagInput('');
    setSelectedRowData(null);
    setSelectedRowDataCopy(null);
    setNewRowData({ Comparator: '>=', AggType: 'count', FilterQuery: 'labels.http_route: "/pos/order/{orderId}/{version}/complete" and http.response.status_code: 200 and url.path: *', Interval: '', Name: '', Threshold: '', Last: '', CreateSNOW: 'false' });

    setIsNameValid(false);
    setIsIntervalValid(false);
    setIsLastValid(false);
    setIsThresholdValid(false);
    setIsEmailValid(true);
  }

  const handleAddRow = () => {
    //Append the tags
    var appendedTags;
    if (tagInput.trim() === '') {
      appendedTags = tags;
    } else {
      appendedTags = [...tags, tagInput.trim()];
    }
    setTags(appendedTags);

    //Convert to more readable forms 
    var matchingQuery = filterQueries.find((queryObj) => queryObj.query === newRowData.FilterQuery.trim());

    //Prepare the object 
    const requestData = {
      id: '',
      name: newRowData.Name,
      connectorName: 'ServiceBus Alert',
      interval: newRowData.Interval,
      aggType: newRowData.AggType,
      timeUnit: newRowData.TimeUnit,
      comparator: newRowData.Comparator,
      timeSize: newRowData.TimeSize,
      threshold: newRowData.Threshold,
      tags: appendedTags,
      filterQueryBodyText: matchingQuery.query,
      filterQueryBodyJson: matchingQuery.jsonQuery,
      groupByFields: ['labels.storeName', 'labels.retailer'],
      esToken: token,
      esBaseURI: baseURI,
      email: newRowData.Email,
      type: 'metrics.alert.threshold',
      snow: newRowData.CreateSNOW
    };

    // Use a regular expression to split the string
    const match = requestData.timeSize.match(/^(\d+)([hm])$/);

    //TimeSize and TimeUnit are not in forms that ES will accept. We need to perform some parsing
    //Number is placed at index 1, and the unit is placed at index 2
    requestData.timeSize = match[1];
    requestData.timeUnit = match[2];

    //Show the loading animation
    setIsLoading(true);

    // Make the HTTP request
    axios.post('/api/esalert/rules/upsert', requestData)
      .then(response => {
        //Adjustments before placing into the grid
        newRowData.id = response.data.id;
        newRowData.Enabled = true;
        newRowData.Tags = appendedTags.join(',');
        newRowData.Last = requestData.timeSize + requestData.timeUnit;

        //Convert to more readable forms
        var matchingQuery = filterQueries.find((queryObj) => queryObj.query === requestData.filterQueryBodyText.trim());
        newRowData.FilterQueryLabel = matchingQuery.name;

        var comparatorObj = comparators.find((queryObj) => queryObj.value === requestData.comparator);
        newRowData.Comparator = comparatorObj.label;

        newRowData.ConnectorName = '.webhook' + `${newRowData.Email ? ', .email' : ''}`

        setRows((prevRows) => [...prevRows, newRowData]);
        handleOpenSnackbar(`Rule has been successfully created.`, 'success');
      })
      .catch(error => {
        console.error('Error:', error.response.data);
        handleOpenSnackbar(`Failed to create rule ${error.response.data}`, 'error');
      }).finally(() => {
        sanitizeForms();
        setIsLoading(false);
      });

    //I don't want this to be async
    handleCloseModal();
  };

  const handleEditRow = (rowData) => {
    //Let's reset our validations
    //For an edit, we know that these will all be true by default
    setIsIntervalValid(true);
    setIsLastValid(true);
    setIsNameValid(true);
    setIsThresholdValid(true);
    setIsEmailValid(true);

    //Make a deep copy of the rowData so we can revert to it as needed
    setSelectedRowDataCopy(JSON.parse(JSON.stringify(rowData)));

    //Convert the compator to use its value instead of label
    var comparatorObj = comparators.find((queryObj) => queryObj.label === rowData.Comparator);
    rowData.Comparator = comparatorObj.value;

    //Trim any whitespaces. Doing this so that the string matches what's in the array
    rowData.FilterQuery = rowData.FilterQuery.trim();

    //We want the TimeSize to take the value of Last here, so that it populates appropriately on the modal
    rowData.TimeSize = rowData.Last;

    //Set
    setSelectedRowData(rowData);
    setIsEditModalOpen(true);

    // Set the tags state with the tags from the selected row
    if (rowData.Tags === '') {
      setTags([]);
    } else {
      setTags(rowData.Tags.split(','));
    }
  };

  const handleCloseEditModal = () => {
    const rowIndex = rows.findIndex(row => row.id === selectedRowData.id);
    if (rowIndex !== -1) {

      // Create a copy of the rows
      const updatedRows = [...rows];

      // Revert the row data back to the deep copy we made earlier since we're not committing any changes
      updatedRows[rowIndex] = selectedRowDeepCopy;

      // Update the state with the new rows
      setRows(updatedRows);
    }

    setIsEditModalOpen(false);

    // Reset our forms to default
    sanitizeForms();
  };

  const handleUpdateRow = () => {
    var appendedTags;
    if (tagInput.trim() === '') {
      appendedTags = tags;
    } else {
      appendedTags = [...tags, tagInput.trim()];
    }

    setTags(appendedTags);

    var matchingQuery = filterQueries.find((queryObj) => queryObj.query === selectedRowData.FilterQuery.trim());

    const updatedData = {
      id: selectedRowData.id,
      name: selectedRowData.Name,
      filterQueryBodyText: matchingQuery.query,
      filterQueryBodyJson: matchingQuery.jsonQuery,
      aggType: selectedRowData.AggType,
      comparator: selectedRowData.Comparator,
      threshold: selectedRowData.Threshold,
      timeSize: selectedRowData.TimeSize,
      timeUnit: selectedRowData.TimeUnit,
      tags: appendedTags,
      connectorName: 'ServiceBus Alert',
      type: selectedRowData.Type,
      enabled: selectedRowData.Enabled,
      interval: selectedRowData.Interval,
      groupByFields: ['labels.storeName', 'labels.retailer'],
      esToken: token,
      esBaseURI: baseURI,
      email: selectedRowData.Email,
      snow: selectedRowData.CreateSNOW
    };

    // Use a regular expression to split the string
    const match = updatedData.timeSize.match(/^(\d+)([hm])$/);

    //Number is placed at index 1, and the unit is placed at index 2
    updatedData.timeSize = match[1];
    updatedData.timeUnit = match[2];

    //Show the loading animation
    setIsLoading(true);

    // Make the HTTP request to update the row
    axios.post('/api/esalert/rules/upsert', updatedData)
      .then(response => {
        try {
          const rowIndex = rows.findIndex(row => row.id === selectedRowData.id);
          if (rowIndex !== -1) {
            // Create a copy of the rows
            const updatedRows = [...rows];

            var matchingQuery = filterQueries.find((queryObj) => queryObj.query === updatedData.filterQueryBodyText.trim());
            var comparatorObj = comparators.find((queryObj) => queryObj.value === updatedData.comparator);

            // Update the row with the new data
            updatedRows[rowIndex] = {
              id: updatedData.id,
              Name: updatedData.name,
              FilterQuery: matchingQuery.query,
              AggType: updatedData.aggType,
              Comparator: comparatorObj.label,
              Threshold: updatedData.threshold,
              TimeSize: updatedData.timeSize,
              TimeUnit: updatedData.timeUnit,
              Tags: appendedTags.join(','),
              ConnectorName: '.webhook' + `${updatedData.email ? ', .email' : ''}`,
              Type: updatedData.type,
              Enabled: updatedData.enabled,
              Interval: updatedData.interval,
              LastExec: formatTimeAgo(selectedRowData.LastExec),
              Last: updatedData.timeSize + updatedData.timeUnit,
              FilterQueryLabel: matchingQuery.name,
              Email: updatedData.email
            };

            // Update the state with the new rows
            setRows(updatedRows);

            console.log(`Rule with ID ${response.data.id} has been successfully updated.`);
            handleOpenSnackbar(`Rule with ID ${response.data.id} has been successfully updated.`, 'success');
          } else {
            handleOpenSnackbar(`Row with ID ${response.data.id} not found in the rows.`, 'error');
          }
        } catch (ex) {
          console.log(ex)
          handleOpenSnackbar(`Failed to update rule ${ex}`, 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error.response.data);
        handleOpenSnackbar(`Failed to update rule ${error.response.data}`, 'error');
      }).finally(() => {
        sanitizeForms();
        setIsLoading(false);
      });

    // Close the update modal. I don't want this to be async
    setIsEditModalOpen(false);
  };

  const handleToggleEnable = (id, enabled) => {
    setIsLoading(true);
    axios
      .post(`/api/esalert/rules/toggle?ruleId=${id}&baseURI=${baseURI}&token=${token}`, { enabled })
      .then((response) => {
        if (response.status === 204) {
          setRows((prevRows) =>
            prevRows.map((row) => (row.id === id ? { ...row, Enabled: enabled } : row))
          );
          console.log(`Rule with ID ${id} has been successfully ${enabled ? 'enabled' : 'disabled'}.`);
        } else {
          console.error('Unexpected response status:', response.status);
          handleOpenSnackbar(`Failed to change rule status: Unexpected response status ${response.status}`, 'error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response) {
          handleOpenSnackbar(`Failed to change rule status: ${error.response.data}`, 'error');
        } else {
          handleOpenSnackbar('Failed to change rule status: Network error', 'error');
        }
      }).finally(() => {
        setIsLoading(false);
      });
  };


  const handleRemoveTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const isValidLast = (value) => {
    const regex = /^[0-9]+[hm]$/;
    return regex.test(value);
  }

  const isValidInterval = (value) => {
    const regex = /^[0-9]+[mh]$/;
    if (!regex.test(value)) {
      return false; // Must match the format
    }

    const [valueNumber, valueUnit] = value.match(/(\d+)([mh])/).slice(1);
    const [minIntervalValue, minIntervalUnit] = minInterval.match(/(\d+)([mh])/).slice(1);

    if (valueUnit === 'h' && minIntervalUnit === 'm') {
      // Convert hours to minutes for comparison
      const valueInMinutes = parseInt(valueNumber, 10) * 60;
      return valueInMinutes >= parseInt(minIntervalValue, 10);
    } else if (valueUnit === 'm' && minIntervalUnit === 'h') {
      // Convert minutes to hours for comparison
      const valueInHours = parseInt(valueNumber, 10) / 60;
      return valueInHours >= parseInt(minIntervalValue, 10);
    } else {
      // Units are the same, perform a regular comparison
      return parseInt(valueNumber, 10) >= parseInt(minIntervalValue, 10);
    }
  };

  function formatTimeAgo(timestamp) {
    if (timestamp === null || timestamp === undefined) {
      return;
    }

    // Regular expression to match the various time formats
    const timeAgoRegex = /^(\d+)\s(seconds|minutes|hours|days)\sago$/;
    const match = timestamp.match(timeAgoRegex);

    if (match) {
      // If it matches the format, return the timestamp as is
      return timestamp;
    }

    // If it doesn't match the format, proceed with the conversion logic
    const currentDate = new Date();
    const date = new Date(timestamp);
    const timeDifference = currentDate - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
      return `${days} days ago`;
    } else if (hours > 1) {
      return `${hours} hours ago`;
    } else if (minutes > 1) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ marginTop: 50, marginLeft: 20 }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </div>
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        headerHeight={60}
        components={{
          Toolbar: () => (
            <div style={{ position: 'relative' }}>
              <Typography
                variant="h5"
                textAlign="center"
                marginBottom="10px"
                fontSize="1.5rem"
                style={{ padding: '10px' }}
              >
                Elastic Search Rules
              </Typography>
              <Button
                variant="outlined"
                onClick={handleOpenModal}
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 75,
                }}
              >
                Create Rule
              </Button>
            </div>
          ),
        }}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            background: 'white',
            padding: 20,
          }}
        >
          <Typography sx={{ margin: 1 }} variant='h5'>Add New Rule</Typography>

          <TextField
            label="Name"
            fullWidth
            style={{ marginBottom: '16px' }}
            value={newRowData.Name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={!isNameValid}
            helperText={isNameValid ? '' : 'Name is required'}
          />
          <Tooltip title="Select the filter query" arrow>
            <FormControl fullWidth>
              <InputLabel id="filterQuery-label">Filter Query</InputLabel>
              <Select
                label='Filter Query'
                labelId="filterQuery-label"
                id="filterQuery"
                value={newRowData.FilterQuery}
                onChange={(e) => setNewRowData({ ...newRowData, FilterQuery: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {filterQueries.map((queryItem) => (
                  <MenuItem key={queryItem.name} value={queryItem.query}>
                    {queryItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <Tooltip title="Select the aggregation type" arrow>
            <FormControl fullWidth>
              <InputLabel id="aggType-label">Agg Type</InputLabel>
              <Select
                label='Agg Type'
                labelId="aggType-label"
                id="aggType"
                value={newRowData.AggType}
                onChange={(e) => setNewRowData({ ...newRowData, AggType: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {aggTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <Tooltip title="Select the comparator" arrow>
            <FormControl fullWidth>
              <InputLabel>Comparator</InputLabel>
              <Select
                label='Comparator'
                value={newRowData.Comparator}
                onChange={(e) => setNewRowData({ ...newRowData, Comparator: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {comparators.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <TextField
            label={
              <LabelWithTooltip
                label="Threshold"
                tooltip="Threshold is the value that you define for when the alert will fire"
              />
            }
            fullWidth
            value={newRowData.Threshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            error={!isThresholdValid}
            helperText={isThresholdValid ? '' : 'Invalid Threshold value'}
            style={{ marginBottom: '16px' }}
          />

          <TextField
            label={
              <LabelWithTooltip
                label="During last"
                tooltip="Enter a number that will represent the period of interest. For example, last 2 hours"
              />
            }
            fullWidth
            value={newRowData.TimeSize}
            onChange={(e) => handleLastChange(e.target.value)}
            style={{ marginBottom: '16px' }}
            error={!isLastValid}
            helperText={isLastValid ? '' : 'Enter the time period and the time unit (h or m). For example, 2h for the last 2 hours'}
          />

          {minInterval !== null && (
            <TextField
              label={
                <LabelWithTooltip
                  label="Interval"
                  tooltip="Enter the interval and the time unit (h or m). This indicates how often this rule will execute its check. For example 5m for every 5 minutes"
                />
              }
              fullWidth
              value={newRowData.Interval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              style={{ marginBottom: '16px' }}
              error={!isIntervalValid}
              helperText={isIntervalValid ? '' : `Invalid Interval provided. The minimum allowable interval is configured to ${minInterval}.`}
            />
          )}

          <Tooltip title="Choose whether to automatically create a SNOW event to prompt incident creation" arrow>
            <FormControl fullWidth>
              <InputLabel id="snowType-label">Automatic SNOW Event Creation</InputLabel>
              <Select
                label='SNOW'
                labelId="SNOW-label"
                id="SNOW"
                value={newRowData.CreateSNOW}
                onChange={(e) => setNewRowData({ ...newRowData, CreateSNOW: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {snowEventOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <TextField
            label={
              <LabelWithTooltip
                label="Optional Tag(s)"
                tooltip="For more than one tag, separate by space"
              />
            }
            fullWidth
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            style={{ marginBottom: '16px' }}
            onKeyDown={(e) => {
              if (e.key === ' ' && tagInput) {
                setTags([...tags, tagInput]);
                setTagInput(''); // Clear the input field
              }
            }}
            InputProps={{
              endAdornment: tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(index)}
                />
              ))
            }}
          />

          <TextField
            label={
              <LabelWithTooltip
                label="Email Notification (Optional)"
                tooltip="If would also like to receive an email notification, please provide a valid email address"
              />
            }
            fullWidth
            value={newRowData.Email}
            onChange={(e) => handleEmailChange(e.target.value)}
            style={{ marginBottom: '16px' }}
            error={!isEmailValid}
            helperText={isEmailValid ? '' : 'Invalid email address format. Please provide a valid email address format, otherwise leave empty'}
          />

          <Button
            variant="outlined"
            onClick={handleAddRow}
            disabled={!isIntervalValid || !isNameValid || !isThresholdValid || !isLastValid || !isEmailValid}
            sx={{ marginRight: 2 }}
          >
            Add Rule
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </div>
      </Modal >
      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            background: 'white',
            padding: 20,
          }}
        >
          <Typography sx={{ margin: 1 }} variant='h5'>Edit Rule</Typography>
          <Tooltip title="Enter the name of the alert" arrow>
            <TextField
              label="Name"
              fullWidth
              value={selectedRowData ? selectedRowData.Name : ''}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{ marginBottom: '16px' }}
              error={!isNameValid}
              helperText={isNameValid ? '' : 'Name is required'}
            />
          </Tooltip>

          <Tooltip title="Select the filter query" arrow>
            <FormControl fullWidth>
              <InputLabel id="filterQuery-label">Filter Query</InputLabel>
              <Select
                label='Filter Query'
                labelId="filterQuery-label"
                id="filterQuery"
                value={selectedRowData ? selectedRowData.FilterQuery : ''}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, FilterQuery: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {filterQueries.map((queryItem) => (
                  <MenuItem key={queryItem.name} value={queryItem.query}>
                    {queryItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <Tooltip title="Select the aggregation type" arrow>
            <FormControl fullWidth>
              <InputLabel id="aggType-label">Agg Type</InputLabel>
              <Select
                label='Agg Type'
                labelId="aggType-label"
                id="aggType"
                value={selectedRowData ? selectedRowData.AggType : ''}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, AggType: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {aggTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <Tooltip title="Select the comparator" arrow>
            <FormControl fullWidth>
              <InputLabel>Comparator</InputLabel>
              <Select
                label='Comparator'
                value={selectedRowData ? selectedRowData.Comparator : ''}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, Comparator: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {comparators.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <TextField
            label={
              <LabelWithTooltip
                label="Threshold"
                tooltip="Threshold is the value that you define for when the alert will fire"
              />
            }
            fullWidth
            value={selectedRowData ? selectedRowData.Threshold : ''}
            onChange={(e) => handleThresholdChange(e.target.value)}
            style={{ marginBottom: '16px' }}
            error={!isThresholdValid}
            helperText={isThresholdValid ? '' : 'Invalid Threshold value'}
          />

          <TextField
            label={
              <LabelWithTooltip
                label="During last"
                tooltip="Enter a number that will represent the period of interest. For example, last 2 hours"
              />
            }
            fullWidth
            value={selectedRowData ? selectedRowData.TimeSize : ''}
            onChange={(e) => handleLastChange(e.target.value)}
            style={{ marginBottom: '16px' }}
            error={!isLastValid}
            helperText={isLastValid ? '' : 'Invalid time period. Ensure that a number is provided'}
          />

          {minInterval !== null && (
            <TextField
              label={
                <LabelWithTooltip
                  label="Interval"
                  tooltip="Enter the interval and the time unit (h or m). This indicates how often this rule will execute its check. For example 5m for every 5 minutes"
                />
              }
              fullWidth
              value={selectedRowData ? selectedRowData.Interval : ''}
              onChange={(e) => handleIntervalChange(e.target.value)}
              style={{ marginBottom: '16px' }}
              error={!isIntervalValid}
              helperText={isIntervalValid ? '' : `Invalid Interval provided. The minimum allowable interval is configured to ${minInterval}.`}
            />
          )}

          <Tooltip title="Choose whether to automatically create a SNOW event to prompt incident creation" arrow>
            <FormControl fullWidth>
              <InputLabel>Automatic SNOW Event Creation</InputLabel>
              <Select
                label='SNOW'
                value={selectedRowData ? selectedRowData.CreateSNOW : ''}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, CreateSNOW: e.target.value })}
                style={{ marginBottom: '16px' }}
              >
                {snowEventOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <TextField
            label={
              <LabelWithTooltip
                label="Optional Tag(s)"
                tooltip="For more than one tag, separate by space"
              />
            }
            fullWidth
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            style={{ marginBottom: '16px' }}
            onKeyDown={(e) => {
              if (e.key === ' ' && tagInput) {
                setTags([...tags, tagInput]);
                setTagInput(''); // Clear the input field
              }
            }}
            InputProps={{
              endAdornment: tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(index)}
                />
              ))
            }}
          />

          <TextField
            label={
              <LabelWithTooltip
                label="Email Notification (Optional)"
                tooltip="If would also like to receive an email notification, please provide a valid email address"
              />
            }
            fullWidth
            value={selectedRowData ? selectedRowData.Email : ''}
            onChange={(e) => handleEmailChange(e.target.value)}
            style={{ marginBottom: '16px' }}
            error={!isEmailValid}
            helperText={isEmailValid ? '' : 'Invalid email address format. Please provide a valid email address format, otherwise leave empty'}
          />

          <Button
            sx={{ marginRight: 2 }}
            variant="outlined"
            onClick={handleUpdateRow}
            disabled={!isIntervalValid || !isNameValid || !isThresholdValid || !isLastValid || !isEmailValid}>
            Update Rule
          </Button>
          <Button variant="outlined" onClick={handleCloseEditModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div >
  );
};

export default ElasticSearchRuleComponent;
