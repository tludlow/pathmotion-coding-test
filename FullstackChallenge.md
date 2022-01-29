# Description
Build an application to find and manage connections between a large number of users.
A user is a person with a first and last name, a favorite color, and any number of connections to other users.  Connections are always mutual (ie bi-directional).

## Requirements
0. Please include a top-level README.md explaining your major architectural decisions and how to run your application.  If you have to make feature cuts or take shortcuts in order to finish, please explain what trade-offs you made and why you chose them.  I am most interseted in your code design and architectural decisions in whatever language you choose to implement this in, so you can prioritize for that if you are running out of time.
1. All endpoints should follow REST protocol or use GraphQL
2. Site should be developed using the language of your choice.  Ideally, you should use Docker, but otherwise, please include instructions on how to run and test your project
3. Color options include all primary colors
4. Ensure to think about how you would handle validation, error handling, and access to the particular resources.
5. Code should be well documented with appropriate comments.  i.e. How can we run your project?

## Test Endpoint (POST www.rainbowconnection.com/testdata)
* PARAMS: userCount - Integer between 1 and 1000000
* This endpoint should clear the database, and populate it with a set of [userCount] users with randomly generated, human first and last names.
* Each user should have between 0 and 50 randomly generated connections.
* Each user should have a randomly generated favorite color.

## Endpoint (GET www.rainbowconnection.com/users/{id})
* Load a user and all connections and favorite color - should be returned in JSON.

## Initial View (www.rainbowconnection.com)
* Displays a list of all users with three columns: [full name], [favorite color], [comma-separated list of full names of all connections]
* Favorite color text should be colored with the relevant color
* User's full name, and each connection name should be clickable.  Clicking should take you to User View page.
* (Bonus) Initial view should should show 20 users in list and scrolling down should implement and "infinite scrolling" functionality where I scroll to the next page of users as I scroll down to the bottom of the list.

## User View (www.rainbowconnection.com/[userid])
* Displays a title with this user's full name and favorite color
* Displays a list of all user's connections with three columns: [full name], [favorite color]
* Clicking on the favorite color of the current user in the title bar should give a drop-down selection of colors.  Selecting a new color should update the current user's color.