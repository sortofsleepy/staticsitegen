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

* layouts : this should contain the scaffold of each page and includes all of the common html tags in addition to any css or javascript. If you've used rails
before, this should be very familiar.

* content : this should contain all of the content for the site 
    * assets : this should contain all of the css and js for the site. You can arrange it any way you want
    * pages : this should contain all of the content you want to lie at the root of your site.
    
    
Overall usage patterns
====
There are two ways you can use this system

- You can use it as a static site generator. Once you're done entering your content, you run `node compiler.js` to compile the site. You can specify a particular directory by adding the `--project` flag, otherwise it will default to looking for a folder called `site` from wherever the script is run. After compiling, you'll have a folder called `dist` in your project folder. You can also specify a `--destination` flag as well, but note that writing to a particular destination is currently un-tested.


- A server setup is included as well which can be used to serve as a development platform or simply serve the site itself. You can start the server by running
`node app.js` from the repository root. Note that specifying an alternate directory to serve the site from is currently not tested. Also note that server components are not automatically installed. To install the server packages, run `npm install --dev`

***

How to use the system 
===
This system tries it's very best to be as simple and as easy to use as possible. To minimize complexity, the goal is to essentially, have your project structure mirror the structure of the
resulting site. That being said, some explanation is still needed on just how to  work with content.

Adding Content 
===
Adding content is pretty straightforward. Essentially, all your content should reside in your project's `content` folder. There are some things to keep in mind though while constructing 
your site.

* there should always be an `assets` and a `pages` folder. There should also always be a `index.html` file. The `assets` folder contains things such as css, js, etc. The `pages` folder should contain all of the content you want residing at the root of the compiled site.
* for every new folder you create, that will become a new path on the compiled site. For example, you'll see that there's currently a `colors` folder with `hello.mk` and `welcome.html` inside.
When the site is compiled you could then visit `http://<site url here>/colors/<pagename>`

Keeping that in mind, you can add any markdown or html content to your heart's content. You don't even have to bother with adding all the standard html tags! That gets done through...


Adding Layouts 
=====
In an effort minimize the copping/pasting of all the basic html boilerplate, the setup of the system is designed to mirror the way 
Ruby on Rails works, by keeping the layout of the site and the content of the site completely separate. 


You can describe your layout by adding a new html file inside of the `layouts` folder. The name you give your layout file is important because that gets matched up during the content lookup and processing. 


For example, going back to the folder `colors`, inside of `content`, during the compilation process, the script checks to see if there's a specific layout file for the `colors` folder by seeing if there
is a `colors.html` file inside of `layouts`. If there is, it uses that file as the layout file for any content within the `content/colors` folder; if it can't find it, it instead uses `default.html`


If you happen to have some deeply nested content, for example something at `colors/reds/fuschia`, the layout file that the system will try to look up is `colors.html`