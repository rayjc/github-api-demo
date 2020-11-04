const request = require("supertest");
const nock = require("nock");
const app = require("../../app");
const { GITHUB_API_URL, GITHUB_API_URL_RES, START_DATE, END_DATE } = require("../../config");

// force axios to be called in node env for jest testing
const axios = require("axios");
axios.defaults.adapter = require('axios/lib/adapters/http');


it('responds with 200 and objects of name, commits if successful', async () => {
  const numPage = 3;
  nock(GITHUB_API_URL)
    // match the first page
    .get(GITHUB_API_URL_RES)
    .query({ since: START_DATE, until: END_DATE })
    .reply(
      200,
      [
        { commit: { author: { name: "user1" } } }, { commit: { author: { name: "user2" } } }
      ],
      {
        link: `<https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=1>; rel="next", 
          <https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=${numPage}>; rel="last"`
      }
    )
    // match the subsequent page
    .get(GITHUB_API_URL_RES)
    .query({ since: START_DATE, until: END_DATE, page: 2 })
    .reply(
      200,
      [
        { commit: { author: { name: "user1" } } }, { commit: { author: { name: "user3" } } }
      ],
      {
        link: `<https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=2>; rel="next", 
          <https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=${numPage}>; rel="last"`
      }
    )
    .get(GITHUB_API_URL_RES)
    .query({ since: START_DATE, until: END_DATE, page: 3 })
    .reply(
      200,
      [
        { commit: { author: { name: "user2" } } }, { commit: { author: { name: "user4" } } }
      ],
      {
        link: `<https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=1>; rel="first", 
        <https://api.github.com/repositories/76152835/commits?since=2019-06-01&until=2020-05-31&page=${numPage - 1}>; rel="prev"`
      }
    );

  const resp = await request(app).get('/most-frequent').expect(200);
  expect(resp.body.length).toBe(4);
  expect(resp.body).toContainEqual({ name: "user1", commits: 2 });
  expect(resp.body).toContainEqual({ name: "user2", commits: 2 });
  expect(resp.body).toContainEqual({ name: "user3", commits: 1 });
  expect(resp.body).toContainEqual({ name: "user4", commits: 1 });
});

it('responds with 500 if Github API is down, ', async () => {
  nock(GITHUB_API_URL)
    // match the first page
    .get(GITHUB_API_URL_RES)
    .query({ since: START_DATE, until: END_DATE })
    .reply(500);

  await request(app).get('/most-frequent').expect(500);
});