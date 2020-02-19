# Captains API
[Live version](https://captains.now.sh/)  <br />
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

## API Endpoints

### POST /api/auth/login

Logs in the user and creates json web token. 

#### Request

Request body requires username and password.

    {
    	"username": "JDenver",
    	"password": "JDenver1!"
    }

#### Sample response:

    {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODIxMzYyMTMsInN1YiI6IkpEZW52ZXIifQ.qM6nbtkCWeik-MwrZG5GhXtmCEUPeTU4kGO32RYFTnE",
        "user": {
            "id": 1,
            "username": "JDenver"
        }
    }

***

### GET /api/item

Returns the full list of items in the database.

#### Request

To successfully return the list of items the request needs a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. 

#### Sample response:

    [
        {
            "id": 1,
            "item_name": "Bill",
            "list_id": 1
        },
        {
            "id": 2,
            "item_name": "Tyler",
            "list_id": 1
        },
        {
            "id": 3,
            "item_name": "Cline",
            "list_id": 1
        },
    ]

***

### POST /api/item

Creates a new item in the database.

#### Request

To create a new item in the database the request needs a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. 

The request body needs to have a `item_name` and `list_id`. The list_id needs to be belong to a pre-existing list.

    {
    	"item_name": "Joe Green",
    	"list_id": "1"
    }

#### Sample response:

    {
        "id": 38,
        "item_name": "Joe Green",
        "list_id": 1
    }

***

### DELETE /api/item/:item_id

Deletes the item in the database with an id that matches the item_id parameter value.

#### Request

The request requires the item_id parameter value to match an item in the database. The request also requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. 

***

### PATCH /api/item/:item_id

Updates the item with the corresponding id to the `item_id` parameter. 

#### Request

The request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. 

The request body requires an `item_name` and `list_id`.

    {
    	"item_name": "Joe",
    	"list_id": "1"
    }

***

### GET /api/item/list/:list_id

Returns a list of items that belong to the list with an id that matches the `list_id` parameter.

#### Request

To successfully return a list of items the `list_id` parameter must belong to a pre-existing list and the request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. 

#### Sample response:

    [
        {
            "id": 5,
            "item_name": "Cormac",
            "list_id": 2
        },
        {
            "id": 6,
            "item_name": "Ava B",
            "list_id": 2
        },
        {
            "id": 7,
            "item_name": "Ken",
            "list_id": 2
        }
    ]

***

### GET /api/list

Returns an array of all the list objects in the database. 

#### Request

The request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value.

#### Sample response:

    [
        {
            "id": 2,
            "list_name": "Turkey Bowl",
            "user_id": 1
        },
        {
            "id": 1,
            "list_name": "New Years",
            "user_id": 1
        },
        {
            "id": 15,
            "list_name": "Feb",
            "user_id": 1
        }
    ]

***

### POST /api/list

Creates a new list in the database.

#### Request

The request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value. The request body only requires a `list_name`.

    {
        "list_name": "New List"
    }

#### Sample response:

    {
        "id": 16,
        "list_name": "New List",
        "user_id": 1
    }

***

### GET /api/list/:list_id

Returns a list object.

#### Request

The request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value.

#### Sample response:

    {
        "id": 1,
        "list_name": "New Years",
        "user_id": 1
    }

***

### DELETE /api/list/:list_id

Deletes a list with an id that corresponds to the `list_id` parameter.

#### Request

The request requires a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value.

***

### PATCH /api/list/:list_id

Updates the list with an id that matches the `list_id` parameter.

#### Request

The request body requires a `list_name` and also a header with a key of `Authorization` and a value of `bearer [authToken]`, where authToken is the json web token value.

    {
        "list_name": "St. Patrick's Day"
    }

***

### POST /api/user

Creates a new user.

#### Request

The request body requires a `username`, `password`, and `re_password`. Password and re_password need to match in order for the request to be successful. 

    {
    	"username": "TimTeb",
    	"password": "TimTeb22!",
    	"re_password": "TimTeb22!"
    }

#### Sample response:

    {
        "id": 3,
        "username": "TimTeb"
    }


## Technologies
*   Express
*   Node
*   PostgreSQL