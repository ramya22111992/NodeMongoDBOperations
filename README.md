This is the flow:

The router file receives the GET/PUT/POST/DELETE http request

The router file will forward the request to the appropriate controller for any post/update/create/delete changes to the DB. These changes will be done via the Models.

The controller will return the success/error response back to the client.