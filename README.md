# [Rios Roofing Web Application](https://github.com/rrios4/roofing-webapp/)
Author: CoogTech Consulting 
#### Project for company Rios Roofing to make them a software that will help the manage data of invoices, estimates, customers, employees, vendors, and products to reduce time to manage such information. It will allow them to have a static website so they can attract more customers to their bussiness. For the client side of the project it is built in REACT and server side with Nodejs/Express. Both will communitcate as a Full-Stack Aplication that will allow the company use the software from the web and not constraint to a single device on premise.

## How to Run
#### 1. Install Modules for Back-End Server
```
  cd client
```
```
  npm ci
```
#### 2. Install Modules for Front-End Client
```
  cd server
```
```
  npm ci
```
#### 3. Run Program from Server folder by running this command in the terminal
```
  npm run app
```

## Package list

| Package                    | Description                                                                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bcryptjs                   | Optimized bcrypt in JavaScript with zero dependencies. Compatible to the C++ bcrypt binding on node.js and also working in the browser.                                                                                 |
| cors                       | CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.                                                                                              |
| dotenv                     | Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.       |
| sweetAlerts                        | Alerts the indicates the user on UI actions through the application                                                                                                             |
| express                    | Fast, unopinionated, minimalist web framework for node.                                                                                                                                                                 |
| http-status-codes          | Constants enumerating the HTTP status codes.                                                                                                                                                                            |
| i18next                    | i18next is a very popular internationalization framework for browser or any other javascript environment (eg. node.js).                                                                                                 |
| i18next-express-middleware | This is a middleware to use i18next in express.js.                                                                                                                                                                      |
| ioredis                    | A robust, performance-focused and full-featured Redis client for Node.js.                                                                                                                                               |
| jsonwebtoken               | This was developed against draft-ietf-oauth-json-web-token-08. It makes use of node-jws                                                                                                                                 |
| module-alias               | Create aliases of directories and register custom module paths in NodeJS like a boss!                                                                                                                                   |
| moment                     | A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.                                                                                                                      |
| mysql                      | A way to provide a connection to mysql server that is local or cloud.                                                                                                                                                   |
| Sequelize               | ORDM that manages out database request to the database                                                                                                                                                                                |
| validator                  | A library of string validators and sanitizers.                                                                                                                                                                          |
| winston                    | A logger for just about everything.                                                                                                                                                                                     |
| axios                      | Tool for making HTTP request to communicate with API                                                                                                                                                                    |
| concurrently                      | Allows to run mutiple terminal commands in one by running one command                                                                                                                                                   |
| chakra UI                      | Library that has UI components for react                                                                                                                                                                 |



## API Endpoints

- GET: <http://localhost:8081/api/customers/> - Get all customers
- GET: <http://localhost:8081/api/employees/> - Get all employees
- GET: <http://localhost:8081/api/invoices/> - Get all invoices
- GET: <http://localhost:8081/api/estimates/> - Get all estimates
- POST: <http://localhost:8081/api/auth/login> - Sign in
- POST: <http://localhost:8081/api/auth/register> - Sign up
- POST: <http://localhost:8081/verify-request> - Verification request
- POST: <http://localhost:8081/verify> - Verify url
- POST: <http://localhost:8081/reset-password> - Reset password
- POST: <http://localhost:8081/new-password> - New password after password reset
- POST: <http://localhost:8081/change-password> - Change password
- POST: <http://localhost:8081/update-user> - Update user

**Note:** For any question [issues](https://github.com/rrios4/roofing-webapp/issues)

## License

This project is an open-source with an [MIT License](https://github.com/watscho/express-mongodb-rest-api-boilerplate/blob/master/LICENSE)
