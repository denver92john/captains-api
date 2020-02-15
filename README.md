# Captains API
[Live version](https://captains.now.sh/)
This API for the Captains app is used to assist users in creating a set of random teams based on a list of names they've created.

## Dependencies
*   [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Optimized bcrypt in JavaScript with zero dependencies.
*   [cors](https://www.npmjs.com/package/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
*   [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
*   [helmet](https://www.npmjs.com/package/helmet) - Helmet helps you secure your Express apps by setting various HTTP headers. 
*   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - For generating JWTs used by authentication.
*   [knex](https://www.npmjs.com/package/knex) - query builder for Node.js.
*   [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js.

## Application Structure
*   `routes folder` - this folder contains all of the routers and their corresponding service objects.
*   `auth` - This folder inside the routes folder contains the auth router and service object that handles authentication endpoint requests.
*   `item` - This folder inside the routes folder contains the item router and service object that handles item endpoint requests. Adding, patching, and deleting items from lists.
*   `list` - This folder inside the routes folder contains the list router and service object that handles list endpoint requests. Adding, patching, and deleting lists.
*   `user` - This folder inside the routes folder contains the user router and service object that handles user endpoint requests. Creating new users.
*   `middleware` - This folder contains the authentication logic.

## Technologies
*   Express
*   Node
*   PostgreSQL