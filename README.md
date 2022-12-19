<p align="center">
  <img src="./client/src/assets/LogoRR-blue-shadow.png" width="40%" height="60%" alt="Banner"><br>
</p>
<h1 align="center"> Roofing Web App v2.0 </h1>
<p align="center">
  <b>A new web app experience for Rios Roofing Company based on React.js and Supabase written from scratch with performance & visuals in mind. 🚀</b>
  <br><br>
  <img src="https://img.shields.io/github/stars/rrios4/roofing-webapp" alt="GitHub Stars"/>
  <img src="https://img.shields.io/github/forks/rrios4/roofing-webapp" alt="GitHub Forks"/>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/cider-music"><img src="https://img.shields.io/github/issues/rrios4/roofing-webapp"></a>
    <a title="Crowdin" target="_blank" href="https://crowdin.com/project/cider-music"><img src="  https://img.shields.io/github/license/rrios4/roofing-webapp"></a>
  <br>

</p>

## Overview
#### A web application for Rios Roofing company that will help them manage data regarding invoices, estimates, customers, materials and estimate requests to reduce time to create invoices to be sent to customers, create estimates to sent to customers, refer to invoices/estimates when needed, get reports in a dashboard to see the companies progress on a monthly bases on login, and schedule for quote to houses base on estimate requests.
</br>

## Usage
#### 1. Install NPM packages for Frontend Client
```
  cd client
  npm install
```


#### 2. Add .env variables to root of client side
```
  //Move to client folder
  cd client

  //Create file named .env
  touch .env
```

```
  REACT_APP_SUPABASE_URL=
  REACT_APP_SUPABASE_KEY=
```
Copy those variables into the .env file and include the supabase URL and supabase private key that will allow client side to communicate with the backend. Supabase is the backend that replaced the Node.js server
</br>

#### 3. Start app from client folder by running this command in the terminal
```
  npm start
```
</br>

## Package list

| Package                    | Description                                                                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @chakra-ui/react                  | Library that has UI components for react                                                                                                                                                                 |
| @supabase/supabase-js                 | Supabase is an open source Firebase alternative.                                                                                 |
| framer-motion                       | A production-ready motion library for React.                                                                                              |
| dotenv                     | Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.       |
| sweetAlerts                        | Alerts the indicates the user on UI actions through the application                                                                                                             |
| axios                      | Tool for making HTTP request to communicate with API    
| react-icons |       Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using.                                                                                                                              

**Note:** For any question [issues](https://github.com/rrios4/roofing-webapp/issues)

## License

This project is an open-source with an [MIT License](https://github.com/watscho/express-mongodb-rest-api-boilerplate/blob/master/LICENSE)
