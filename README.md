<p align="center">
  <img src="src/assets/LogoRR-blue-shadow.png" width="40%" height="60%" alt="Banner"><br>
</p>
<h1 align="center"> Roofing Web App v2.0 </h1>
<p align="center">
  <b>Introducing a high-performance, visually-stunning web application for Rios Roofing Company, built from the ground up using React.js and Supabase technology. 🚀</b>
  <br><br>
  <img src="https://img.shields.io/github/stars/rrios4/roofing-webapp" alt="GitHub Stars"/>
  <img src="https://img.shields.io/github/forks/rrios4/roofing-webapp" alt="GitHub Forks"/>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/cider-music"><img src="https://img.shields.io/github/issues/rrios4/roofing-webapp"></a>
    <a title="Crowdin" target="_blank" href="https://crowdin.com/project/cider-music"><img src="  https://img.shields.io/github/license/rrios4/roofing-webapp"></a>
  <br>

</p>

## Overview
#### My web application is designed to help roofing companies streamline their data management and improve customer communication. It allows businesses to store, manage and access key information such as invoices, quotes, customer details and quote requests, reducing the time and effort required to create and send invoices and quotes to customers. The application also features a dashboard to easily track company progress and manage quote requests received through the company website, resulting in more efficient and effective business operations.
</br>

## Usage
This section will include installation intructions, running the app, additional resources, and deployment guides.

</br>

#### 1. Install npm packages for react-app
```
  npm install
```


#### 2. Add .env variables to root of react-app folder
```
  //Create file named .env
  touch .env
```

```
  REACT_APP_SUPABASE_URL=
  REACT_APP_SUPABASE_KEY=
```
To allow communication between the client-side and the backend, add the Supabase URL and private key to the .env file by copying them over. Supabase acts as the backend, replacing the need for a separate Node.js server.

</br>

#### 3. Start app from client folder by running this command in the terminal
```
  npm start
```
After installing the necessary packages and creating your Supabase instance, including adding the URL and Key, you can start the app by running the command. The application will be available on localhost:3000 and will prompt you to login. The login credentials can be managed in the settings of the Supabase dashboard. To ensure proper functionality, please use the provided schema for the database, including the names and fields as outlined.

</br>

#### 4. Build to docker image for deployment
```
  docker build -t my-roofing-app .  
```
</br>

#### 5. Run to docker image for deployment in port 80
```
  docker run -p 80:80 my-roofing-app
```
</br>

## Roadmap
- [x] Initial release, version 1.0, of the Roofing web application, featuring the ability to effectively store and manage invoices, estimates, and customer information..
- [ ] Introduce version 2.0 of the Rios Roofing Company web application, featuring a complete rewrite of the React codebase, a redesigned user experience for optimized data management, the ability to handle quote requests, a replacement of Node.js backend with Supabase technology, enhanced customer, invoice, quote and dashboard views for improved reporting capabilities.
- [ ] Introduce version 2.5 of the Roofing Company web application, featuring a variety of improvements such as the implementation of react-tables for all current basic tables within the app, the ability to generate PDF documents for invoices and quotes, the option to send email directly to customers with just one click, a global search function across quote requests, quotes, invoices, and customers, a customer details page that lists all associated invoices, quotes, and requests, google maps integration for address fields, and the capability to upload images and documents for each quote and invoice.


</br>

## Package List

|        Package        | Version  |                                                 Description                                                  |
|-----------------------|----------|--------------------------------------------------------------------------------------------------------------|
|   @chakra-ui/icons    |  2.0.2   |                         A collection of more than 900 icons for use with Chakra UI.                          |
|   @chakra-ui/react    |  ^2.4.4  | A set of UI components for React that help you build accessible, responsive, and composable user interfaces. |
|    @emotion/react     | ^11.10.5 |                            Emotion is a library for styling components in React.                             |
|    @emotion/styled    | ^11.10.5 |                            Emotion is a library for styling components in React.                             |
| @supabase/supabase-js | ^1.35.3  |  Supabase is an open-source Firebase alternative, providing realtime and RESTful APIs on top of PostgreSQL.  |
|         axios         | ^0.21.1  |                        A promise-based HTTP client for making requests in JavaScript.                        |
|       chart.js        |  ^4.1.1  |                                  A JavaScript library for creating charts.                                   |
|    emotion-theming    |  11.0.0  |                     A library for theming components in React using the Emotion library.                     |
|     framer-motion     |  ^6.5.1  |                                  A library for animating React components.                                   |
|         luxon         |  ^3.2.1  |                          A library for working with dates and times in JavaScript.                           |
|         react         | ^18.2.0  |                              A JavaScript library for building user interfaces.                              |
|    react-chartjs-2    |  ^5.1.0  |                                    A wrapper for using Chart.js in React.                                    |
|       react-dom       | ^18.2.0  |                            A package that allows React to interact with the DOM.                             |
|    react-hook-form    |  7.33.1  |                                 A library for managing form inputs in React.                                 |
|      react-icons      |  4.4.0   |                                A library of icons for use in React projects.                                 |
|   react-router-dom    |  6.3.0   |                                   A library for handling routing in React.                                   |
|     react-scripts     |  5.0.1   |                              A set of scripts for building React applications.                               |
|     react-select      |  5.4.0   |                           A library for creating select input components in React.                           |
|      sweetalert       |  2.1.2   |                          A library for creating customizable alerts in JavaScript.                           |
|      web-vitals       |  2.1.4   |                               A library for measuring web performance metrics.                               |

</br>

## Contribution

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contribution you make are **greatly appreciated** ✨.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Dont forget to give the project a star! Thanks again!

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m "Add some AmazingFeature"`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

</br>

**Note:** For any question [issues](https://github.com/rrios4/roofing-webapp/issues)

## License

This project is an open-source with an [MIT License](https://github.com/watscho/express-mongodb-rest-api-boilerplate/blob/master/LICENSE)
