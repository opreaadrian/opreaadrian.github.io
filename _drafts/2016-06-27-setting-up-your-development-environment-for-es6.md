---
layout: post
title: "Setting up your development environment for ES6"
pub_date: 2016-06-27 12:00:00 AM
last_modified: 2016-06-27 12:00:00 AM
categories:
  - javascript
published: false
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: JavaScript, ES6, ECMAScript6, development, environment, productivity
featured_image: /images/posts/es6-arrow-functions-in-depth/post.jpg
---

If you are lucky enough to start a project from scratch, I see no reason why you should not use the latest and greatest in JavaScript land. When I'm talking about this, the thing I'm referring to is actually ECMAScript 6, which is the latest standard and offers a lot of improvements over the previous version (ECMAScript 5).  
Suppose you got a new assignment at work, to build a logging service. Your team knows JavaScript best and most of your projects use NodeJS on the backend, so it's a no-brainer that you will also use Node for this.  
Thinking ahead for a bit, you remember you heard something about test-driven development and code coverage, so you need some tooling on that end. Within the team, you have defined an internal JavaScript development style guide that you would like to use on this project as well, so you need something to feed those rules to and make sure that the code follows your team's standards. You also need to think about how your application will be deployed to production, and figure out a way to create "builds" from your code that you can safely deploy to production. Speaking of production, you heard some people talking about some sort of lightweight virtual machines, that allow you to bundle your application along with its runtime environment and have that running in production.

After getting all those thoughts out of your head,  let's now create a list of the technologies you found relevant for your project:

- Babel - for compiling our ECMAScript 6 sources to compatible ECMAScript 5
- Gulp - to automate our development/testing/build tasks
- nodemon - to auto-refresh our application while in development
- NPM - to install and manage our dependencies and later use for workflow automation
- ESLint - to load and apply our style guide rules
- Mocha w/ Chai - *-driven development (TDD/BDD based on your preferred flavor)
- Istanbul - for code-coverage reports
- Docker - for running your application in production (not actually lightweight virtual machines, as we'll see later on)

Before we get into details, let's first create our directory structure. When doing this, think of a structure that would enable you to easily identify where your project's assets are: sources, tests, build artefacts.
In short, make your life easier and create structure on which you can easily apply any build process.
For now, let's settle on the following structure -- don't worry, it will evolve over time.

{% highlight text %}
project/
  src/
  test/
{% endhighlight %}

The src/ directory will host the original, ES6 source code, whereas the test/ directory will host, well, you guessed it, the tests.
Now that we've settled on the directory structure, we need to run npm init and generate a package.json file for our project. This will host our module dependencies as well as project-related metadata so just answer your best when prompted for information and then save(hit `Enter/Return`)

<package.json output>

Once we see package.json listed in our project's tree, let's make use of it and start installing some modules. We are going to install each module from our list of technologies/dependencies while discussing its use/benefits.

## Gulp

Gulp is a workflow/task automation system. It allows developers to write NodeJS code to automate their development/build/deployment processes. Compared to other systems like Grunt, it favors code over configuration. Instead of lengthy JSON configuration files that describe your tasks, you write NodeJS code.

The fact that you can write NodeJS code and avoid switching the paradigm is Gulp's biggest advantage.

For more information, visit their official website at http://gulpjs.com/.

Let's install gulp and gulp-cli to our local node_modules/ directory using npm install --save-dev --save-exact gulp gulp-cli.
What we did here, was to save both modules as development dependencies of our application. As the name of the argument states, we are using these modules to develop and build our app, rather than for running it in production.
Pinning the version to a specific number ensures that you are the one updating the module version and not npm, by itself.
Updating your module version while preparing to deploy to production is risky and error-prone.

That is why I use the --save-exact argument for npm install. It's a habit I picked up after some modules introduced breaking changes between versions. This broke my code after I deployed it to production and I had to revert to an older state and fix the package versions.

Gulp has a very simple API, and we are going to make the best of it. For now, we're going to need two tasks, one for creating builds and one for development, that we are going to call "build" and "dev". Let's get on with our configuration.


<gulpfile.js code>

Let us dive deeper into what we just wrote here. We are using the gulp module that we just installed to define our two tasks. The first task, which we called "build" takes the contents of our sources directory and passes it through Babel, which is used to transpile our ES6 code. After that step is done, Babel's output gets piped to the dist/ directory.
The next task we created was the "dev" task. At its core, all it does is to call the "build" task whenever it picks up a change in the sources directory. This eliminates the need for us to write babel src -d dist at our terminal every time, if we were to use the command-line tool.

## Babel

This is in my opinion the best option for using the latest features of the JavaScript language at the moment and not worry that it might not run on your environments. It is simple and easy to use/configure. As you already saw, we are using Babel in our Gulp tasks, but we haven't installed it yet, so if we were to run gulp dev from our command line, we would get an error saying that the Babel module is not installed, so let's go ahead and install it, the same way we installed gulp: npm install --save-dev --save-exact babel-cli.
There is one extra step that we need to make before being able to successfully use our gulp tasks and that is to install babel-preset-es2015 and create a .babelrc file. We are going to use the .babelrc file to host our Babel configuration, like the presets, so we don't have to pass a lot of command-line arguments. In the past Babel came with some default presets but the team decided to make it less  opinionated and allow developers to choose the way they want to handle things. Let's create our .babelrc file.

<.babelrc output>

Let us now add our first JavaScript file to our sources and write some ECMASCript 6. We will call it `app.js` and it will be the main entrypoint for our server.

<app.js output>

Now we can successfully use our tasks to transpile our ES6 code on the fly, while we're cranking away, so just run `./node_modules/.bin/gulp dev` and watch for the `dist/` directory popping up in your project's directory structure.
Also worth noting that we are not installing our modules globally and so whenever we want to run a command-line tool, we can use the local `.bin/` folder that npm creates for CLI packages, located at this path: `node_modules/.bin` .

While we're at it, let's create a `.gitignore` file and add `dist/` to the ignores list. The reason for doing this is that we don't want to commit build artefacts to version control. Those can be built anywhere by using the tasks we just created, and it is best for them to be generated by the deployment system, just before sending the new code to production as we'll see when we get to the deployment part.

## Nodemon

Our "dev" task is great, and with client-side code, you can just refresh the page and get the latest code changes, but with NodeJS it's a different story. If you have a NodeJS app and you change something in `app.js`, refreshing the page won't bring you the latest changes. In order to get those changes, you need to stop the server (CTRL+C from the command line) and restart it, running `node app.js` for example.
Luckily, awesome people like Remy Sharp already solved this problem for us, by creating a tool called nodemon that restarts your application whenever it picks up changes on the disk.
Let's install nodemon and add a new task, to our gulpfile, called nodemon

<gulpfile.js with nodemon task that runs dist/app.js>

Currently, we have Nodemon configured to run our transpiled code, but as we will see later, it can be configured to run our ES6 code, directly.
Let's now run `gulp nodemon` and make a change to our `app.js`. If you take a look at the task's output, you will see that Nodemon restarted the server after you saved your file and the `build` task completed, refreshing the code from the `dist/` directory.

## ESLint

I have a short phrase that I repeat to anyone trying to argue against a project-wide development style guide. "It will hurt now but you will be thankful later!"
I will not expand on the importance of having a codebase that looks like it was written by a single developer, with code written for humans to read and only for machines to interpret, that is beyond the scope of this course, but do get one of you don't already have.
There's not much to say about ESLint, from a user's standpoint, so I will give you the definition available on the official website - http://eslint.org/

> ESLint is [...] a pluggable linting utility for JavaScript.

Bottom line, you feed it a configuration file with a set of rules and when you run it against your code, it will prompt you if it finds issues. It also allows you to extend popular style guides instead of having to write your own, and we're going to stick with that as it is the simplest option.
Let's install `estlin` using `npm install eslint --save-dev --save-exact` and then run `./node_modules/.bin/eslint init`. We will have to answer some questions that will allow the tool to set itself up.

<eslint init output>


BONUS
TALK ABOUT NODE-SECURITY AND NPM SHRINKWRAP
TALK ABOUT GENERATING SOURCEMAPS
