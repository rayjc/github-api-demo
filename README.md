# Github API Demo

### Overview
This is a demo app for calling [Github commits API](https://docs.github.com/en/free-pro-team@latest/rest). Currently, this backend app supports two RESTful routes at _/users_ and _/most-frequent_.

- /users: retrieves all the users who have commits to a specified repository between particular time intervals
- /most-frequent: retrieves top 5 users who have the most number of commits to a specified repository between particular time intervals

Note: you can specify the repository and time interval as environment variables; please take a look at _config.js_

### Build
Assuming you have docker installed,
you can run `docker-compose build` to build an image.
### Running the application
Please run `docker-compose up`.
### Testing
Please run `docker-compose run api npm test`.
