---
layout: post
title: "Working with JavaScript promises: handling the unexpected"
pub_date: 2015-02-28 06:00:00 PM
last_modified: 2015-02-28 06:00:00 PM
categories: nodejs
author_name: 'Adrian Oprea'
author_twitter: '@opreaadrian'
keywords: nodejs, workflow, javascript, promises, errors
featured_image: /images/posts/error_handling_missile.jpg
---

Having worked with [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) extensively in the past year, I often found myself in situations where handling output and errors was very hard to perform, from a semantic standpoint.  
I plan on sharing my experience with promises, especially error-handling, but this is by no mean something that should be taken as a best practice, it is only my take on this issue, and you are encouraged to share your experience and practices.

## What's an [Error](http://en.wikipedia.org/wiki/Error)
> The concrete meaning of the Latin word "error" is "wandering" or "straying". [...] an error or a mistake can sometimes be dispelled through knowledge.

So basically an error can be interpreted as a state that can(sometimes, of course) be resolved/repaired by applying corrective action. This is exactly how I feel about JavaScript promises and what error-handling means when working with such a concept.  
In my opinion, there are situations or states that involve for example killing the process, and there are other situations that only involve setting some default data if no proper response is given. These cases are to be treated in a different way, as they involve different application states.

## A pattern for handling the `unexpected` and the `uncaught`

Let's say for example that we have to implement a method that performs an async call to a REST service and returns the data to be used in the UI. The implementation    would probably look as follows:

```javascript
var request = require('request'),
    config  = require('config');

var Customer = {
    getData : function() {
        var deferred = Promise.defer();
        
        request({
            method  : 'GET',
            uri : config.uri
        }, function(error, response, body) {
            if (error) {
                deferred.resolve(error);
                return;
            }

            deferred.resolve(JSON.parse(body));
        });
    }
};

```

You would be tempted to structure your code like the above snippet, and look for an error, and if no error is provided, then you can just resolve with the body, as nothing could have gone wrong.  
I say no to that approach, because you can bump into situations where you don't get an `Error` object, but you do get a `500 Internal Server Error`. 

Even though many of the NodeJS development best practices articles, and even the NodeJS documentation itself suggests that you should have an error-first approach when working with callbacks, in situations like the one above, it's best to check for the status code and the presence of data, and forward the data to whoever is calling the method. If that's not the case, reject the promise with MEANINGFUL INFORMATION.  
I'm stressing the "meaningful information" part so much because I'm a firm believer in these words: "Do unto others as you would have them do unto you". This doesn't mean in any way that I'm a religious type of person, not that it would be a shame, but I strongly believe in the power of setting examples, so if enough people are going to be able to quickly debug and track down possible issues because I added enough error-related information, they'll soon follow that example &mdash; and I would love to see the same amout of details when I'm debugging someone else's code.

```javascript
// [core/customer.js]
var request = require('request'),
    config  = require('config');


module.exports = {
    getData : function(customerId) {
        var deferred = Promise.defer();

        request({
            method  : 'GET',
            uri : config.uri
        }, function(error, response, body) {

            if (response && response.statusCode == 200) {
                deferred.resolve(JSON.parse(body));
                return;
            }


            deferred.reject({
                // What did the server say?
                response    : response,
                // Did we get an error?
                originalError : error,
                // Was it really bad?
                // Do we restart the process, retry, or continue with defaults?
                type        : response.statusCode == 500 ? 'fatal' : 'failure',
                // Tell them this:
                message     : 'Unable to retrieve customer data'
            });

        });

        return deferred.promise;
    }
};

// [app/myAccount.js]
Customer
    .getData()
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        /* 
        If you mess up, you can crash the process, 
        set defaults, or perform recovery.
        */
        if (err.type === 'fatal') {
            // Crash the process, perform error recovery.
            console.log('FATAL_CRASH_THE_PROCESS', err);
        } else {
            // Just a failure, retry or set defaults.
            console.log('FAILURE_SET_DEFAULTS_AND_RECOVER', err);
        }
    });
```

By following the pattern above, I make sure that I only deal with successful actions, when a promise is resolved, and for the errors/exceptions part, I have that all handled in the `catch` callback. To make things better, we could top it off with an error handler, that is separate from our library, and that has handlers for all statuses that are of interest. An example of such a concept can be found on GitHub &mdash; see [this gist](https://gist.github.com/opreaadrian/fac301833af8bcb2b8d5) &mdash; or if you want to give it a spin without saving on disk, on [jsbin.com](http://jsbin.com/yocese/1/edit?js,console)

## Conclusions

Either way you do implement error handling, it's best to keep in mind that when you have the means to signal that there was an error, namely `reject` in our little `Promise`s world, please use that, and use meaningful information to go along with it, as it is way better to set 2 breakpoints, one for the `success` and one for the `error` callback, and then blindly click through the application until you stop on one of those breakpoints, than to obsessively stare at the debugger every 2 clicks to see if you got actual data or an error.

Cheers!

*P.S.* For an alternate flow that uses a JavaScript object to hold actions for each error, based on it's severity, you can refer to [this bin that I put up a couple of weeks ago](http://jsbin.com/yocese/3/edit) &mdash; open it with Chrome as it uses native JavaScript promises.

> Image credits: [Sailors verify serial numbers on a Sidewinder practice missile.](https://flic.kr/p/r5cB7u) by [Official U.S. Navy Page](https://www.flickr.com/photos/42973403@N07/)
