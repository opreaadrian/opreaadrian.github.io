---
layout: post
title: "ES6 arrow functions in depth"
pub_date: 2016-05-18 12:00:00 AM
last_modified: 2016-05-18 12:00:00 AM
categories:
  - javascript
published: true
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: JavaScript, ES6, ECMAScript6, arrows, functions, lambdas, anonymous functions
featured_image: /images/posts/es6-arrow-functions-in-depth/post.jpg
---

One of the prettiest features of ES6, it could easily win a beauty contest, if such a contest would be held. What many people don’t know is that the arrow function is not simply a form of syntactic sugar that we can use instead of the regular callback.
As I like to explain it to the people who attend my trainings/workshops, arrow functions are `this`-less, `arguments`-less, `new.target`-less and `super`-less.
Let us now get past the shorter syntax and dive deeper into the specifics of the arrow function.

# Lexical-bound this

Previously, regular functions would have their `this` value set to the global object if they were used as callbacks, to a new object in case they were called with the `new` operator or, in the case of libraries like jQuery, they would be set to the object that triggered an event in case of event handlers, or the current element in a `$.each` iteration.This situation proved very confusing even for experienced developers.
Let’s say you have a piece of code like the one below.

{% highlight javascript %}
var obj = {
  nameValue: 'default',
  initializeHandlers: function() {
    var nameInput = document.querySelector('#name');

    nameInput.addEventListener('blur', function(event) {
      this.nameValue = event.target.value;
    });
  }
};

obj.initializeHandlers();
{% endhighlight %}

The problem is that `this` inside the `blur` event handler is set to the global object rather than obj. In strict mode &mdash; `‘use strict’;` &mdash; you risk breaking your application because `this` is set to `undefined`. In order to side-step this issue we have two options:

- Convert the event handler to a function bound to the outer scope, using [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web)
- Use the dirty `var self = this;` expression in the `initializeHandlers` function (I see this as a hack)

Both options are illustrated below.

{% highlight javascript %}
[...]
initializeHandlers: function() {
  var nameInput = document.querySelector('#name');
  // more elegant but we can do better
  var blurHandler = function(event) {
    this.nameValue = event.target.value;
  }.bind(this)

  nameInput.addEventListener('blur', blurHandler);
}
[...]
{% endhighlight %}

{% highlight javascript %}
[...]
initializeHandlers: function() {
  var nameInput = document.querySelector('#name');
  // ugly and error-prone
  var self = this;

  nameInput.addEventListener('blur', function(event) {
    self.nameValue = event.target.value;
  });
}
[...]

{% endhighlight %}

On the other hand, arrow functions have no internal context. They inherit their context from the outer scope. Let’s take a look at how arrow functions solve this problem.

{% highlight javascript %}
const obj = {
  nameValue: 'default',
  initializeHandlers: function() {
    const nameInput = document.querySelector('#name');

    nameInput.addEventListener('blur', (event) => {
      // this references obj instead of the global object
      this.nameValue = event.target.value;
    });
  }
};
{% endhighlight %}

In our new implementation `this` is a hard reference to the `obj` object and doesn’t get lost due to nesting.

## Lexical arguments

Have you ever tried to access the `arguments` object inside an arrow function? I have, and I wasted 3 solid hours trying to figure out why do I get the arguments of the outer function instead of those of the arrow functions.
Thankfully, MDN exists, and as good practice dictates, you check the documentation at the end, when you sit in a corner, knees tucked to your chest, rocking and repeating to yourself: “I should have been a carpenter!”
Fun aside, arrow functions do not expose an `arguments` object. If you try to access it, you will get the arguments of the surrounding function.

{% highlight javascript %}
function getPalindromes() {
  const variadicPalindromes = () => {
    // these are actually the arguments of getPalindromes
    let args = Array.prototype.slice.call(arguments, 0);
    return args.filter((arg) => arg === arg.split('').reverse().join(''))
  }

  return variadicPalindromes('test', 'racecar');
}

const palindromes = getPalindromes();
{% endhighlight %}

There is no fix here, as there is nothing broken. What we can do is to send the arguments to `getPalindromes()` and process them outside the arrow function, for clarity’s sake.

## Other characteristics
As I mentioned in the introductory section of this article, arrow functions have several more characteristics besides the context and the arguments.
The first thing I would like to mention is that you are unable to use the `new` operator with arrow functions. As a direct implication, arrow functions also don’t have `super()`. Snippets like the one below would simply throw a `TypeError`.

{% highlight javascript %}
const Person = (name) => {
  this.name = name;
};

let p = new Person('John');
// TypeError: Person is not a constructor
{% endhighlight %}

The third characteristic, which is as well, a direct implication of the inability to use the `new` operator, is the fact that arrow functions don’t have `new.target`. In a nutshell, `new.target` allows you to detect whether or not a function has been called as a constructor.
Arrow functions, inherit `new.target` from their surrounding scope. If the outer scope is a function, and it is called like a constructor (e.g. `new Person('Adrian');`), then `new.target` will point to the outer function.
The Mozilla Developer Network hosts a detailed explanation on `new.target` and I encourage you to check it out.

## Closing thoughts

Now that you got a bit more detail into how arrow functions work, go and use them like they were intended!
I can't help recommending that you go through the [Mozilla Developer Network JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) as
there is an abundance of knowledge that will help you in the long run, in your web development career.
Feel free to leave comments, suggest edits and especially share with your peers.

Cheers!

> Photo credits:
> [Richard Elzey](https://www.flickr.com/photos/elzey/) &mdash; [Arrow Signs](https://flic.kr/p/9ZDxat)
