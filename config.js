const APP_PORT = process.env.APP_PORT || 3000;

const START_DATE = process.env.START_DATE || "2019-06-01";
const END_DATE = process.env.END_DATE || "2020-05-31";
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_API_URL_RES = "/repos/teradici/deploy/commits";
const REPO_BASE_URL = process.env.REPO_BASE_URL
  || GITHUB_API_URL + GITHUB_API_URL_RES;

module.exports = {
  APP_PORT,
  GITHUB_API_URL,
  GITHUB_API_URL_RES,
  REPO_BASE_URL,
  START_DATE,
  END_DATE,
};