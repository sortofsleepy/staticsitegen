Setting things up
====

This was designed to be a very simple to use and no frills static website generator. That being the case, there
might be some things missing that you're used to, but we think you'll appreciate how simple and how quickly it is to get 
setup and start creating. (oh and small sidenote, this page, unlike the home page is written using markdown fyi)


Installation
===
This is using [Node.js](https://nodejs.org/en/) as the base system for serving the site as well as
the compiler for generating static builds. 

* install node.js first.
* clone this repository
* run `npm install` after navigating to the repository to install all the dependencies.

It's recommended you do everything from the clone of the repository that you made, but it shouldn't be strictly necessary.

Project Directory Structure
=======
Take a look at the `site` directory which is structured in a way that works with this system. It should have at a minimum
* `layouts` - these contain the html used to render each page. It works just like rails where content gets injected into these layouts, which is then served by the server.
* `content` - a directory containing the site content.