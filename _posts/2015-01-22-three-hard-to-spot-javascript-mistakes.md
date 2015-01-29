---
layout: post
title: "Three hard to spot JavaScript mistakes"
pubdate: 2015-01-22 12:00:00 AM
last_modified: 2015-01-22 12:00:00 AM
categories: javascript
author_name: 'Adrian Oprea'
author_twitter: '@opreaadrian'
keywords: javascript, validation, mistakes, beginner, code, programming, objects, indexOf, for-in, loops
featured_image: /images/posts/mistakes.jpg
---

Working on a handful of big ecommerce projects for the past couple of years, I often found myself in a situation where one component, or the whole application my team was working on, was working properly in all scenarios. All except one...

Most of the times, we thought that we had backend issues, that data wasn't consistent, that God didn't love us that day. We thought so hard that we didn't know what to think. Some of us were using debuggers, but the third time the application failed and the debugger said nothing about it, and there was no console error, nothing, we would fill up the code with `console.log`s. When none of this would work, we would simply relax, as this was something divine, something that us mortals would never understand.  
The next morning, I would go back to work, after a good night sleep(4-5 hours) and while sipping on some coffee, I would take one last look at the divine piece of code, and after 5 seconds, the first WTF would suddenly find its way into the office.  
The aforementioned story, has an open end, and you can choose your version from the 3 options below. Enjoy!

## indexOf()
> `Array.indexOf()` and `String.indexOf()`

In order to find if a certain substring exists within a given string, or if a certain key exists within a given array, the go-to method is `indexOf()`.

Let's say that we have the following setup:

```js   
    var myString = 'The quick brown fox jumps over the lazy developer\'s head';
```

Calling `myString.indexOf('developer');` would give us the index at which the word/substring "developer" is found within the given string, in our case `40`.

Let's say that we have a function that checks whether a certain word is present within a given sentence, and returns true or false based on this verification. Our code would look something like this:

```js  
    function checkWordOccurrenceInSentence(word, sentence) {
        if (!word || !sentence) {
            throw new Error('Please provide both parameters.');
        }

        if (sentence.indexOf(word)) {
            return true;
        } else {
            return false;
        }
    }
    
    var myString = 'The quick brown fox jumps over the lazy developer\'s head';
    if (checkWordOccurrenceInSentence('programmer', myString)) {
        console.log('Found programmer');
    } else {
        console.log('Programmer not found');
    }
```

You would think that the piece of code above will say "Programmer not found" but you are wrong. As you might already know, the falsy values in JavaScript(values that evaluate to false) are 5: `false`, `Null`, `undefined`, `0` and `''`. Nowhere does it say that `-1`, the value that `indexOf()` returns if it does not find anything, will evaluate to false. 

So basically what happens when you say `if (checkWordOccurrenceInSentence('programmer', myString))`
is that `indexOf()` will return `-1` inside `checkWordOccurrenceInSentence()` and that will be evaluated as `true` and this will be propagated and evaluated in your `if` statement.

A better way to do this is to refactor your function to look like the one below:

```js  
    function checkWordOccurrenceInSentence(word, sentence) {
        if (!word || !sentence) {
            throw new Error('Please provide both parameters.');
        }
        
        // Using "!=" instead of "!=="(identity operator) as indexOf() will not trick us
        // You can use >= 0 instead of != -1
        if (sentence.indexOf(word) != -1) {
            return true;
        } else {
            return false;
        }
    }
```


## Checking object properties
> Object.property/Object['key']

Let's assume that you get a JSON object from an API, that returns error data from an error aggregator based on a certain query, and displays only certain errors. You will obviously need to validate if the error key exists, and display it's value.

Let's take the following JSON object as an example of error data, and check whether the `fatalErrorsCount` property exists as we would only want to show the fatal errors.

```js
    // /errors/startDateMiliseconds/endDateMiliseconds
    var errorData = $http.get('https://api.company.com/errors/14201436816409/1421882120458');
    [table creation code goes here...]

    if (errorData.fatalErrorsCount) {
        ui.components.show('fatal-errors-count', errorData.fatalErrorsCount);
    }
```

Again, like with `indexOf`, you would think that this works fine: you get data, you check if the key exists, and BAM!, you output those damn fatal errors. Not so fast!  
What if there are no fatal errors for that period, so `errorData.fatalErrorsCount` is 0. Well, then our `if` statement there doesn't look so good, does it? This also happens if `fatalErrorsCount` is set to any falsy value, so a better way to do this would be to use the `in` operator as follows:

```js
    [...]
    if ('fatalErrorsCount' in errorData) {
        ui.components.show('fatal-errors-count', errorData.fatalErrorsCount);
    }
```

and now you are safe!

## `for...in` on Array(s)

I'll just tell you from the start that this is an EFFIN' bad idea. First of all because in JavaScript it is perfectly okay to have an array like this:

```js
    var arr = [];

    arr[3] = 11;
    console.log(arr); //[ , , , 11 ]
    
    for (var el in arr) {
        console.log(el); // will log 3
    }
```

This means that if we perform a `for` loop on our array and log out each element would get 3xundefined and then 11.  
But when performing a `for-in` loop, we get the index of the last element, as the statement treats our array as an object, treating the index `3` as the key, and 11 as the value because in JavaScript it is perfectly legal to have an object looking like this:

```js
    var object = {
        '0' : 'First value',
        '1' : 'Second value'
    };
```

I think it is also worth mentioning [Paul Irish's asshole effect](http://vimeo.com/12529436#t=272) as somebody could do something like this:

```js
    // in another js file
    Array.prototype.assholeVar = 'I haz a dude'; // http://lolcode.org/

    // in your module
    for (var el in arr) {
        console.log(el); // will log "3" and "assholeVar" for all arrays
    }
```

Key takeaway here, is __NEVER USE `for...in` ON ARRAYS__. Use `for`, `while`, `do...while`, `forEach` and the list goes on.

I hope the info that I shared here is valuable to developers, especially beginners, and if you know any other "little" mistakes like the ones outlined in this article, please feel free to share them in the comments section, and I might even update the post publish them, for the sake of posterity. 

P.S. I had one more, about `i++` but I'll publish that one in an update to this post.

> Image credits: [Some mistake, surely ...](https://flic.kr/p/nrHJrx) by [Tim Green](https://www.flickr.com/photos/atoach/)
