Basic static site builder
===
(note - there is a test site is at http://staticgentest.surge.sh/)

This is a very very simple, no frills static site generator / site builder. There's no fancy parsing, manipulating, or any
other kind of black magic going on; this is designed to help you get a static site up and going and to allow you to 
easily write your content in either markdown or plain html.


Installation
===
This is using [Node.js](https://nodejs.org/en/) as the base system for serving the site as well as
the compiler for generating static builds. 

* install node.js first.
* clone this repository
* run `npm install` after navigating to the repository to install all the dependencies.

Project Directory Structure
=======
Take a look at the `site` directory which is structured in a way that works with this system. It should have at a minimum
* ` layouts` - these contain the html used to render each page. It works just like rails where content gets injected into these layouts, which is then served by the server.
* ` content` - a directory containing the site content.
 
How to use
====
There are two ways you can use this system

1. You can use it as a static site generator. Once you're done entering your content, you run `node compiler.js` to compile the site. You can specify a particular directory by adding the `--project` flag, otherwise it will default to looking for a folder called `site` from wherever the script is run. After compiling, you'll have a folder called `dist` in your project folder. You can also specify a `--destination` flag as well, but not that writing to a particular destination is currently un-tested.
2. A server setup is included as well which can be used to serve as a development platform or simply serve the site itself. You can start the server by running
`node app.js` from the repository root. Note that specifying an alternate directory to serve the site from is currently not tested.

Specifics on how to use this system
===
This system tries it's very best to be as simple and as easy to use as possible. To minimize complexity, the goal is to essentially, have your project structure mirror the structure of the
resulting site. That being said, some explanation is still needed on just how to  work with content.

 __Adding Content__
<br/>
Adding content is pretty straightforward. Essentially, all your content should reside in your project's `content` folder. There are some things to keep in mind though while constructing 
your site.

* there should always be an `assets` and a `pages` folder. There should also always be a `index.html` file. The `assets` folder contains things such as css, js, etc. The `pages` folder should contain all of the content you want residing at the root of the compiled site.
* for every new folder you create, that will become a new path on the compiled site. For example, you'll see that there's currently a `colors` folder with `hello.mk` and `welcome.html` inside.
When the site is compiled you could then visit `http://<site url here>/colors/<pagename>`

Keeping that in mind, you can add any markdown or html content to your heart's content. You don't even have to bother with adding all the standard html tags! That gets done through...

__Adding Layouts__
<br/>
In an effort minimize the copping/pasting of all the basic html boilerplate, the setup of the system is designed to mirror the way 
Ruby on Rails works, by keeping the layout of the site and the content of the site completely separate. 

You can describe your layout by adding a new html file inside of the `layouts` folder. The name you give your layout file is important because that gets matched up during the content lookup and processing. 

For example, going back to the folder `colors`, inside of `content`, during the compilation process, the script checks to see if there's a specific layout file for the `colors` folder by seeing if there
is a `colors.html` file inside of `layouts`. If there is, it uses that file as the layout file for any content within the `content/colors` folder; if it can't find it, it instead uses `default.html`

If you happen to have some deeply nested content, for example something at `colors/reds/fuschia`, the layout file that the system will try to look up is `colors.html`


Deployment
=====
There are many ways to deploy a site with this system
* you can generate all the necessary files to upload to a service of your choice using the command `node compiler.js` 
* you can run the included server setup as well by running `node app.js` (though of course, you'll need to set up a service manager like `pm2` or `nodemon` to keep it up and running without a console)

One cool way for a no frills and headacheless approach to hosting a static site is to have it deploy itself after making a push to a git repository. Since github pages can be a little annoying(at least in my experience), 
we're gonna instead use a service called [surge](http://surge.sh)

Example of building a site automatically with Github and Travis CI
=====
One of the neat things you can do these days is setup Continuous Integration(aka CI) on projects to do any build steps that might be required for your project and then, if you want, have your project
automatically deploy itself. We're gonna walk through an example of how to deploy with Github and Travis CI to a service called Surge, which provides quick, free hosting for small front-end projects.

__Continous Integration setup__

There are several options to choose from when doing continuous integration, we're gonna go with "Travis CI" as it's one of the more popular options. To add a new integration

* in your repo go to the settings page
* if you look  in the left hand menu, you should see a link for "Integrations & Services" 
* Once that menu shows up, click on "Browse Directory".
* Travis CI should be one of the first things that pops up.

Travis is all tied into Github. If you go to their [website](https://travis-ci.org/), you should have the option to sign in with Github. Once you've signed in, it'll begin building a list of all of your public repositories (you'll have to go to travis-ci.com to see private ones)

Once it's done, you should see a list of all your repos in your Account profile page on the Travis website. You'll notice a switch next to each repository, toggle the switch of the repository where this code resides.

__Installing Surge__

Surge is a simple `npm install -g surge`. After installing, run `surge` from the command line to set up your account and select the folder to publish. The command will automatically default to wherever the `surge` command is being run from, but since we're not deploying from our commputer, just make a new folder like `dist` in the root of the repository and set the location to there. You'll need to run `surge token` next to generate a token for deployment. Make a note of the token and the email address you used to sign up for Surge.

__Setting up Travis CI to deploy to Surge__

If you look in the repo, you'll see a `.travis.yml` file. This is the file used to tell Travis CI how to build the project and how to deploy. Make the necessary changes to the project and/or domain fields. Next you'll have to take the token you got from `surge token` and enter it into Travis CI by entering in Enviromental variables which are used during the deploy process. You can enter new variables from 

`https://travis-ci.org/<user name>/<repo name>/settings`

You'll need to enter two items 
* SURGE_LOGIN - the email addressed you used to create your surge.sh account
* SURGE_TOKEN - the token you got from the `surge token` command.

Save that information and at this point, you should be all set to go. The next time you push to github, Travis should do an automatic compilation, then push to the surge.sh site you specified in your `.travis.yml` file. 😀 🔥



