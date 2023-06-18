# NodeJS
## Overview
This project is my **first approach** to the back-end side of a server, so it is just a big workbench used to put into practice the notions I'm learning. It's a simple server which makes use of authentication and storage. Both authentication and storage rely on MongoDB, a remote NoSQL database.
This project was built day after day following the information of an online course on Udemy, called "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)". My server differs completly from the one shown by the course because I wanted to create **my very own project** to understand and practice all the information available.
At the moment, the server runs on the localhost.

## Structure
The structure is based on the MVC pattern. The idea behind the Model-View-Controller pattern is the separation of the logic parts of the project into three main section. 

Inside the model folder there are the classes used for data management.
The view folder contains the elements needed to show data to the user, in this case HTML pages.
The controller folder is used to gather the scripts which connect the model and the view elements, so the main logic of the project.

## Features
This server has many features which are essential for the correct functioning, that is security and user experience.

### Sessions
Session are used to keep track of everything related to the user, especially it's status. It is first created when the user logs in. 

```js
// after retrieving the user from database, it is stored inside the session
req.session.user = fetchedUser
req.session.isLoggedIn = true
req.session.save(() => { res.redirect('/') })
```
It is eventually destroyed when the user logs out. 

```js
req.session.destroy((err) => {
        console.log('Errore nella chiusura della sessione', err)
        res.redirect('/')
    })
```

### Route protection
If you don't want to allow user to access a page if not logged in, you have to check user status everytime it can reach the page through the click of a button or similar. This means that the user can access the page without logging in when directly searching for the page's URL.

This problem can be easily solved by adding a function which is linked to the URL of our protected page and that checks the user status.

In this example, the second argument calls a middleware function that check the user status before giving access to the database with the other middleware function. The check is performed everytime a client wants to access that specific page.

```js
router.post('/addUser', auth, controller.postAddUser)
```

### CSRF protection
Implementing this protection is crucial to avoid receiving requests from web pages you do not own in order to protect both the server and the client. The server can understand the origin of the request with the help of a CSRF token. This token is created as soon as the communication with the client gets created, inside a generic middleware function, and passed to each view through the *locals* property. 

```js
server.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})
```

### Input validation
I've started to validate the user's input in order to keep control of the data processed by the server. For now, the validation checks are available only for authentication, just for email format, password length and passwords comparison when signing up. The function called for validation is located inside *util/validation.js*. Here a small example.

```js
//...
for (const el of args.values()) {
        if (el == undefined)
            return 'Campo mancante'
    }
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (!args[0].match(validRegex))
        return 'Formato email non valido'
//...
```

### REST API
This is a key feature when talking about an online service. I've added only a few endpoints because I've just started studying API. Since this is a stateless connection and everybody can access my endpoints, it is important to comment out the code linked to the CSRF protection. This kind of protection is not needed since the API endpoints are public. You can find the endpoints inside *controllers/api_con.js*.

## Database
The server has access to a relational database, MySQL, and to a NoSQL database, MongoDB. The latter was preferred for both authentication and storage. 
With the help of MongoDB, the server let the client save a user inside the database and search for a specific user by entering the name and surname. Before letting the client do this, it has to log in or sign up.

## Authentication
The authentication is needed to interact with the database. The client can sign up or log in whenever it wants to. **Routing protection** prevents access to the database when not logged in.
When the client is successfully authenticated a **session** is created to let the server remember the user and to safely share sensitive information.
The session is destroyed when the client logs out.

## Project management
The progect is managed with the help of npm. All the modules used are downloaded through npm, which is also used to start the server.

To facilitate the development of the project, **nodemon** module was used. It restarts automatically the server whenever a change is performed and saved. 
In order to let nodemon work, I've changed the *package.json* file by adding the *start* script.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  }
```


All the modules are stored inside the *node_modules* folder.


## Installation
On the GitHub page of the project there is no *node_modules* folder because it can be created automatically after you clone the repo.

The other file which is not shared on the repo is the *.env* file, which contains my MongoDB uri needed for the connection with the database.

Steps for installation:

1. Clone this repository using your IDE. The link is visible when clicking the green "**<> code**" button inside the main page of the project.

2. Run this line inside the terminal. It will create your *node_modules* folder necessary for the correct functioning of the server.
    ```
    $ npm install
    ```

3. If the versions of any module is outdated run this line to solve the problem.
    ```
    $ npm update
    ```

4. Run the server.
    ```
    $ npm start
    ```
    [Keep in mind that the server will not start since MongoDB uri is not shared here. I know there are no sensitive information inside the database, used exclusively for this project, but this is a piece of information no real server will ever publish. If you want to use the server you can insert your MongoDB uri inside the]: #