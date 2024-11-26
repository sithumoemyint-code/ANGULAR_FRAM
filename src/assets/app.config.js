const BASE_URL = "https://apis-uat.mytelpay.com.mm:8000/fbb-onu";

export const SERVICE_URLS = {
  LOGIN: `${BASE_URL}/login/request`,
  CONFIRM_LOGIN: `${BASE_URL}/login/confirm`,
  STATISTIC: `${BASE_URL}/data/statistic`,
  BRANCH: `${BASE_URL}/data/branch`,
  GET_ALL_IMPORT_FILE: `${BASE_URL}/file`,
  IMPORT_FILE: `${BASE_URL}/file/import`,
  // GET_CUSTOMERS: `${BASE_URL}/data/all`,
  TOWNSHIP: `${BASE_URL}/data/branch/township`,
  FBBLEADER: `${BASE_URL}/data/township/fbbLeader`,
  D2D: `${BASE_URL}/data/fbbLeader/d2d`,
  GET_CUSTOMER_DETAIL: `${BASE_URL}/data`,
  GET_CUSTOMER_STATUS: `${BASE_URL}/data`,
  DOWNLOAD: `${BASE_URL}/data/export/excel`,
  RECIEVED: `${BASE_URL}/data`,
  EXTRA_TABLE: `${BASE_URL}/data/counter`,
  GET_CUSTOMERS_EXTRA : `${BASE_URL}/data/all/v2`
};
