const axios = require("axios");
const parseHeader = require("parse-link-header");
const { REPO_BASE_URL, START_DATE, END_DATE } = require("../config");
const ExpressError = require("./express-error");

class CommitApiHelper {
  /**
   * Fetches the first page of commits from Github API,
   * returns an array of two elements - [number of pages, response data]
   */
  static async fetchFirstPage() {
    try {
      // make initial request to extract page number and some data
      const resp = await axios.get(
        REPO_BASE_URL,
        {
          params:
            { since: START_DATE, until: END_DATE }
        }
      );
      const parsed = parseHeader(resp.headers.link);
      // get number of pages
      const numPage = +parsed.last.page || 1;
      return [numPage, resp.data];

    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.message || "API might be down...";
      throw Array.isArray(message)
        ? new ExpressError(message)
        : new ExpressError([message]);
    }
  }

  static async fetchPages(startPage, endPage) {
    /**
     * Fetches multiple pages asychronously based on startPage 
     * and EndPage inclusively,
     * returns an array of responses data
     */
    if (startPage > endPage) {
      return [];
    }

    try {
      // create an array of promises to send requests asynchronously
      // so slow requests are not blocking
      const promises = [];
      for (let i = startPage; i <= endPage; i++) {
        promises.push(
          axios
            .get(
              REPO_BASE_URL,
              { params: { since: START_DATE, until: END_DATE, page: i } }
            )
            .catch(err => console.error(err))
        );
      }
      // attempt to resolve all promises
      const resps = await Promise.all(promises);
      return resps.map(page => page.data);

    } catch (error) {
      console.error("API Error:", error.response);
      let message = error.response.data.message || "API might be down...";
      throw Array.isArray(message)
        ? new ExpressError(message)
        : new ExpressError([message]);
    }
  }

  /**
   * Fetches all available commits,
   * returns an array of responses data
   * Note: only this method is exported
   */
  static async fetchAllPages() {
    const [numPage, firstPage] = await CommitApiHelper.fetchFirstPage();
    const pages = await CommitApiHelper.fetchPages(2, numPage);

    pages.push(firstPage);
    return pages;
  }
}


module.exports = CommitApiHelper.fetchAllPages;