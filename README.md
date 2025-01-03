# Lip Gloss E-Commerce Platform
A modern, user-friendly e-commerce platform for purchasing a range of lip gloss products, developed with a focus on intuitive UI, secure authentication, and efficient product management.

## Table of Contents
  - [Features](#Features)
  - [Demo](#Demo)
  - [Tech Stack](#Tech-Stack)
  - [Getting Started](#Getting-Started)
  - [Project Structure](#Project-Structure)
  - [Contributing](#Contributing)
  - [License](#License)


## Features:

  - Dynamic Cart Functionality: Using React Context to allow seamless automatic updates across components without a page refresh.
  - Dynamic Product Catalog: Browse and filter through a collection of lip glosses with dynamic categories, including options like "Pretty in Pink" and "Peachy Mood."
  - Secure Authentication: Registration and login functionality with secure token-based authentication.
  - User Cart and Checkout: Add, edit, and review items in the cart with a sleek, responsive design.
  - Product Ratings: Rate and view reviews for each product.
  - Real-time Sorting and Filtering: Sort products by price, popularity, and category.

## Demo

### provided a few of the website's features:

the collection: 

![image of the screen](/demo/product-preview.png)

the product page: 

![image of the screen](/demo/product-page.png)


## Tech Stack
  - Frontend: React, SCSS, Bootstrap
  - Backend: Node.js, Express.js, PostgreSQL
  - Database: PostgreSQL for reliable data handling
  - State Management: Context API and React hooks
  - Authentication: JSON Web Token (JWT)

## Getting Started - Option 1 - npm
### Prerequisites
  - Node.js (v14 or higher) and npm installed
  - PostgreSQL server running locally or a cloud-hosted database
### Installation
  - Clone the repository

```bash
git clone https://github.com/noga-x-space/eshop.git
cd eshop
```


  - Set up the backend

```bash
cd server
npm install
```
  - Set up the frontend
```bash
cd ../client
npm install
```

  - Database Setup

      Ensure PostgreSQL is running.
      Create a new database for the project.
      
      Update DATABASE_URL in the backend .env file with your PostgreSQL credentials.

  - Run the application
    In separate terminals:
    ### Backend
    ```bash
    cd server
    npm start
    ```
    ### Frontend
    ```bash 
    cd client
    npm start
    ```

  - Access the app 
  
      Open http://localhost:3000 in your browser.
## Getting Started - Option 2 - Docker Compose
### Prerequisites
  - Docker and Docker Compose installed
  - PostgreSQL server running locally or a cloud-hosted database (if not using Dockerized database)

### Installation
  - Clone the repository

```bash
git clone https://github.com/noga-x-space/eshop.git
cd eshop
docker-compose up --build
```
 Open http://localhost:3000 in your browser.


## Project Structure
  - client/ - React frontend
  - server/ - Node.js backend with Express routes and PostgreSQL database configuration

## Contributing
Feel free to contribute by forking the repository and submitting a pull request!

## License
This project is open-source and available under the MIT License.  - 
