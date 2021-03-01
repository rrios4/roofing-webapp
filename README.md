# [Rios Roofing Web Application](https://github.com/rrios4/roofing-webapp/)
Author: CoogTech Consulting 
#### Project for company Rios Roofing to make them a software that will help the manage data of invoices, estimates, customers, employees, vendors, and products to reduce time to manage such information. It will allow them to have a static website so they can attract more customers to their bussiness. For the client side of the project it is built in REACT and server side with Nodejs/Express. Both will communitcate as a Full-Stack Aplication that will allow the company use the software from the web and not constraint to a single device on premise.

## How to Run
#### 1. Install Modules for Back-End Server
```
  cd server
```
```
  npm ci
```
#### 2. Install Modules for Front-End Client
```
  cd client
```
```
  npm ci
```
#### 3. Run Program from Root of Project
```
  npm run dev
```

## Package list

| Package                    | Description                                                                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bcryptjs                   | Optimized bcrypt in JavaScript with zero dependencies. Compatible to the C++ bcrypt binding on node.js and also working in the browser.                                                                                 |
| cors                       | CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.                                                                                              |
| crypto-random-string       | Generate a cryptographically strong random string                                                                                                                                                                       |
| dotenv                     | Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.       |
| ejs                        | Embedded JavaScript templates                                                                                                                                                                                           |
| email-templates            | Create, preview, and send custom email templates for Node.js. Highly configurable and supports automatic inline CSS, stylesheets, embedded images and fonts, and much more! Made for sending beautiful emails with Lad. |
| express                    | Fast, unopinionated, minimalist web framework for node.                                                                                                                                                                 |
| http-status-codes          | Constants enumerating the HTTP status codes.                                                                                                                                                                            |
| i18next                    | i18next is a very popular internationalization framework for browser or any other javascript environment (eg. node.js).                                                                                                 |
| i18next-express-middleware | This is a middleware to use i18next in express.js.                                                                                                                                                                      |
| ioredis                    | A robust, performance-focused and full-featured Redis client for Node.js.                                                                                                                                               |
| jsonwebtoken               | This was developed against draft-ietf-oauth-json-web-token-08. It makes use of node-jws                                                                                                                                 |
| module-alias               | Create aliases of directories and register custom module paths in NodeJS like a boss!                                                                                                                                   |
| moment                     | A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.                                                                                                                      |
| mysql                   | A way to provide a connection to mysql server that is local or cloud.                                                                            |
| nodemailer                 | Send e-mails from Node.js – easy as cake!                                                                                                                                                                               |
| validator                  | A library of string validators and sanitizers.                                                                                                                                                                          |
| winston                    | A logger for just about everything.        |
| axios                     | Tool for making HTTP request to communicate with API |

## API Endpoints

- GET: <http://localhost:3001/api/customer> - Get all customers
- GET: <http://localhost:3001/api/employee> - Get all employees
- GET: <http://localhost:3001/api/invoices> - Get all invoices
- GET: <http://localhost:3001/api/estimaates> - Get all estimates
- GET: <http://localhost:3001/api/services> - Get all services
- GET: <http://localhost:3001/api/vendors> - Get all vendors
- POST: <http://localhost:3001/sign-in> - Sign in
- POST: <http://localhost:3001/sign-up> - Sign up
- POST: <http://localhost:3001/logout> - Logout
- POST: <http://localhost:3001/verify-request> - Verification request
- POST: <http://localhost:3001/verify> - Verify url
- POST: <http://localhost:3001/reset-password> - Reset password
- POST: <http://localhost:3001/new-password> - New password after password reset
- POST: <http://localhost:3001/change-password> - Change password
- POST: <http://localhost:3001/update-user> - Update user
- POST: <http://localhost:3001/switch-locale> - Switch lang

**Note:** For any question [issues](https://github.com/rrios4/roofing-webapp/issues)

## License

This project is an open-source with an [MIT License](https://github.com/watscho/express-mongodb-rest-api-boilerplate/blob/master/LICENSE)
