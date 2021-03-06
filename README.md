
# Pathmotion coding challenge

  

## General comments

  

- The challenge took around 5 hours to complete (once I had dealt with some niche bugs related to the tech stack).

- The challenge specification was slightly ambiguous in saying: "Displays a list of all user's connections with three columns: [full name], [favorite color]" for the individual user view page. I took this to mean two columns, as provided. However, should it be the case that you meant to have the three columns, and the third is the connections for the user, this can be implemented easily as this functionality has already been implemented for the initial view.

- It was a good and enjoyable challenge, something that I feel is much more representative of my skills than when other companies ask ridiculous leet code style questions.

  

## Requirements

  

- Node.js

- A postgres database (a database can be started using the command `docker-compose up postgres`)

  

## How to run

  The project can be run easily by utilising Docker, follow these commands to get it running:

- Clone the repository locally
- Within the /backend folder, copy the contents of the .env.example file into a new file called ".env". Then adjust the variables to match your required setup. You can leave the database string alone should you wish to use the provided postgres container.
- Now, start the database by running the following command from the base directory `docker-compose up postgres`
- Following this, start the frontend and backend services by running a second command `docker-compose up frontend backend`. Should you have not edited the environment variables, these will be running at localhost:3000 and localhost:5000 respectively.
- To load data into the application, perform a POST request against the URL `http://localhost:5000/testdata` and provide a key of userCount within the request body with the required number of users you wish to utilise. This must be provided and must be above 0.

- (***CAVEAT***) If you wish to run the project locally in a development environment, modify the backend .env DATABASE_URL from containing the word "postgres" to "localhost:5432". This is required due to docker-compose DNS.



## Architecture

  

### Frontend

  

The frontend was created as a TypeScript project, with Next.js being used as it's my preferred bootstrapping method for a React projects these days. Overall, the frontend code is quite simple with the two pages handling data management for the page and components being used to render the data to make the code more readable. To abstract away much of the data management, the library "react-query" was utilised. It provides localised caching for server-state and provides hooks such as "useQuery", to source data and "useMutation" to effect state on the server, both of these were used within the project. Additionally, to support infinite scrolling data management, the "useInfiniteQuery" was utilised. The implementation of this and all data management can be seen within their own hooks which is best practice for react-query projects. A further "useIntersectionObserver" hook was implemented to abstract away the details of the intersection observer functionality provided in the browser. This is used to detect when the user's display intersects with an element, thus triggering more data to be loaded as the user continues scrolling. In general, the frontend doesn't use any fancy react tricks as it is mainly just a CRUD project, with optimisations and fancy design patterns not really needed. In general, semantic HTML is used throughout (which isn't so hard when the design is very limited) and the application should be accessible to all users.

  

### Backend

  

The backend is also implemented as a TypeScript project, with an express server being utilised for the REST API. Prisma is used as a database ORM and for the nice utilities it provides such as easy database migrations and backend types for database queries. The overall backend is pretty simple, with each of the endpoints being implemented within "/src/index.ts" (I would have separated them into separate files and made controllers and such to support the backend should it have been any more complex). The most complex part of the backend is probably the generation of random users, with the code being accessible within the "/lib/userGenerator.ts" file. Random user data is sourced from "http://randomuser.me", however I could have pretty easily made two generator functions that randomly sourced first and last names from a local array within the code. Simple parameter validation has been implemented within the code and correct HTTP codes have been used throughout, aiding in frontend error presentation and handling for the user. Access control, as mentioned in the challenge statement could be implemented using middleware on routes, as supported by most backend frameworks these days. An additional endpoint was implemented further than the challenge specification to support the user updating their favourite colour (PATCH /users/:id/colour)

  

### Database

  

The database utilised is PostgreSQL, not for any specific reason other than I have previous experience using it. You could theoretically use any database you wish which is supported by Prisma. For a simple project like this, with no real limitations provided by the data-model, you could use any database to support your needs.

  

The schema for the database can be seen within the /backend/prisma/schema.prisma file. As you can see it's fairly simple with the base user data just using simple fields. The favourite colour field utilises an enum as there are only 3 colours valid in this project. The scalability of this is not ideal if you were to relax the limit on colours and you'd probably then want to use a string and validate the colour provided on the backend. To model user connections, a many-to-many relation is created, as seen by the "connectedBy" and "connections" fields. These are just a fancy way provided by prisma to generate a table with two columns that map to the user id's within a given relationship. As the relationships are bi-directional, no specific care had to be given to the order of the id's within the table.

  

## Learning experiences

  

- Whilst prisma is nice for most projects, it still has some obvious problems which I faced during the project. One of these is that many-to-many relations have very basic support, forcing me to often resort to raw SQL queries where I faced problems. If I we're to redo this project I would probably not use prisma, and just write the raw SQL myself. The benefits of automatic types and easy database migrations (which don't even work well with docker) aren't really worth the down sides I experienced.

