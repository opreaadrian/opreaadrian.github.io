---
layout: post
title: "Angular services/factories for vanilla JS developers"
pubdate: 2015-03-08 03:00:00 PM
last_modified: 2015-03-08 03:00:00 PM
categories: angular
author_name: 'Adrian Oprea'
author_twitter: '@opreaadrian'
keywords: angular, javascript, service, factory, modules
featured_image: /images/posts/confused.jpg
---

If you ever worked on an AngularJS application that went past "Hello world!" you probably hit the service vs. factory wall. Being a vanilla JavaScript developer, it was a bit hard for me to grasp these concepts, especially because I've also worked with other frameworks and I had an opinion already formed about what a service should be, not to speak about the "factory pattern" that was confusing the hell out of me at that time.

The way I finally understood what services and factories are all about, was by actually trying to map them to vanilla JavaScript. 

## Services
In the Angular docs the definition for a service looks like this: 
> "Angular services are substitutable objects that are wired together using dependency injection (DI). You can use services to organize and share code across your app."

Not too shabby, huh? But not too explicit either. What I like to say is that you can `new` angular services. Basically if you think you need a class, then you probably need a service.

```javascript
// [myService.js]
function MyService() {
    this.doStuff = function(stuff) {
        // I'm doing something with stuff
    };

    this.doSomeMoreStuff = function(moreStuff) {
        // I'm doing something else with more stuff
    };
}

return MyService;

// [home.js]
var MyService = require('myService'),
    myServiceInstance = new MyService();

function iMusingTheModuleFrommyService() {
    var moreStuff = 'There\'s so much to do!';
    myServiceInstance.doSomeMoreStuff(moreStuff);
}
```

And the AngularJS couterpart:

```javascript
// [myAngularService.js]

angular.module('application')
    .service('myAngularService', myAngularService);

function myAngularService() {
    this.doStuff = function(stuff) {
        // I'm doing something with stuff
    };

    this.doSomeMoreStuff = function(moreStuff) {
        // I'm doing something else with more stuff
    };
}

// [home.controller.js]

angular.module('application')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', 'myAngularService'];

function HomeCtrl($scope, myAngularService) {
    var moreStuff = 'There\'s so much to do!';
    this.stuffIdid = myAngularService.doSomeMoreStuff(moreStuff);
}
```

## Factories
Simply put, you return a module ... you create an object and return it for whoever wants to use it.

```javascript
// [myFactory.js]
var myFactory = {
    doStuff : function(stuff) {
        // I'm doing something with stuff
    },

    doSomeMoreStuff : function(moreStuff) {
        // I'm doing something else with more stuff
    }
}

return myFactory;
// ---------------------------------------------------------- //

// [home.js]
var myFactory = require('myFactory');

function iMusingTheModuleFromMyFactory() {
    var moreStuff = 'There\'s so much to do!';
    myFactory.doSomeMoreStuff(moreStuff);
}
// ---------------------------------------------------------- //
```

Take a look at how this compares to an Angular factory:

```javascript
// [myAngularFactory.js]

angular.module('application')
    .factory('myAngularFactory', myAngularFactory);

function myAngularFactory() {
    return {
        doStuff : function(stuff) {
            // I'm doing something with stuff
        },

        doSomeMoreStuff : function(moreStuff) {
            // I'm doing something else with more stuff
        }
    }
}
// ---------------------------------------------------------- //


// [home.controller.js]

angular.module('application')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', 'myAngularFactory'];

function HomeCtrl($scope, myAngularFactory) {
    var moreStuff = 'There\'s so much to do!';
    this.stuffIdid = myAngularFactory.doSomeMoreStuff(moreStuff);
}
// ---------------------------------------------------------- //
```

Factories can be compared to modules hosting functionality that you want to reuse all over the application. 

I tried to make this explanation as short as possible; hopefully you got my point, and hopefully I understood the concepts right, otherwise, I've been living in a lie for the past year.

Cheers!

> Image credits: [I'm So Confused!](https://flic.kr/p/9fwoMs) by [Ian Sane](https://www.flickr.com/photos/31246066@N04/)

