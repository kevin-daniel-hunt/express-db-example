# A simple express-postgres server example project

Created February 2020, aproximately 6 hours of development time.

## Installation

Clone the repo, run `npm install`.  Install an instance of postgresql and ensure it is configured to accept local connections.  Run the SQL provided in the `schema.sql` file found at the root level of this repository.  Once that is done you can run the project by running `node express.js` and connecting to the port on localhost provided in the terminal output.  

## Considerations

When running this in prod you will likely want some kind of process manager, such as pm2 to ensure the server stays running.  This involves some interesting redirecting upon hitting an API, the jwt contains a payload that has a property to determine if the token is an API token or a browser token.  In this instance there are only browser tokens but theoretically you could establish an API token.  The difference between the two is that an api token will be much more restful with the APIs returning appropraite status codes, whereas the browser token will utilize redirects to support template rendered views.  This was done as a sort of experiment because I thought it was interesting but this is almost certainly not a best practice.  

## API

### `POST /users`
Creates new user
#### Request Body
* email - `string` (unique)
* name - `string`
* password - `string`

### `POST /groups`
Creates new Group
#### Request Body
* name - `string`

### `GET /groups`
Returns a list of groups (created by user who calls api)
#### Response
Array of groups, example: 
`[{name: 'Foo', id: 1, members: [...]}]`

### `POST /groups/$id/users`
Adds a member to a group
#### Path Parameters
* id - `integer`
#### Request Body
* email - `string`
