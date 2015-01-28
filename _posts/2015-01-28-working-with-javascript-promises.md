---
layout: post
title: "Working with JavaScript promises: practices and mistakes"
pubdate: 2015-01-28 8:00:00 AM
last_modified: 2015-01-28 10:00:00 PM
categories: nodejs
keywords: nodejs, workflow, javascript, promises, async
featured_image: /images/posts/promises.jpg
---

We use [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) in our day to day grind, and not few were the occasions in which I found promise-using code improperly structured, responses handled in an inconsistent manner, as well as weak or no error handling.  
With this post I aim to share some of my practices when it comes to working with promises. Throughout the post I will use ES6 syntax, but the principles outlined are available whether you're using native JavaScript promises, or a library that implements the [Promises A+ spec](https://promisesaplus.com/).

## Introduction
> What "is" promises?

"A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its `then` method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled." &mdash; [Promises A+ official spec](https://promisesaplus.com/)

In short, a promise object represents a wrapper around that asynchronous operation(which I sometimes call "task"), that at some point might be "resolved" or "rejected" based on whatever the completion of the operation returns. Upon resolution/rejection, the appropriate callback for the promise's resolution state, registered by the `then` method, will be called with the data/rejection reason.

```javascript
// app.js

// Classic usage of Promises (promise w/ resolver)
var getData = new Promise(function(resolve, reject) {
    DataService.getCustomerDetails('11AFFDDDS', function(error, details) {
        if (!error && details) {
            resolve(details);
        } else {
            reject(error);
        }
    });
});

/* getData is a wrapper around the "task" 
   that pulls the customer details from the backend */
getData.then(function(data) {
    // This is the success callback
    console.log(data);
}, function(error) {
    // This is the error callback
    throw new Error(error);
});
```

Besides the previous pattern, which allows you to USE asynchronous tasks, the most common usage I find with promises is by using deferred objects, that allow you to IMPLEMENT async tasks. In this direction, we can take the example of our `getCustomerDetails` method from the DataService.  
In order to implement the method to act as a promise, we need our code to look like below:

```javascript
// dataservice.js

var db = require('./data/dbhandler'),
    QUERY_FAILED = "Database query failed.";

// [...db configuration]

db.connect(config);

DataService.prototype.getCustomerDetails = function(customerID) {
    // Create a deferred object that we'll use to control the execution flow
    var deferred = Promise.defer();

    db.getCustomer(customerID, {
        success : function(data) {
            // We're done, query succeeded -- doesn't mean we have data
            deferred.resolve(data);
        },
        error   : function(error) {
            // Something went wrong with the db. Worth investigating
            deferred.reject({
                message : QUERY_FAILED,
                error   : error 
            })
        }  
    });
    
    // Return this so we can do DataService.getCustomerDetails().then(...)
    return deferred.promise;
}
```

Now, istead of working with promises at our application level, we're moving all the logic related to the DataService in its own, `DataService` module, so our application code now looks like this:

```javascript
// app.js

DataService
    .getCustomerDetails('11AFFDDDS')
    .then(function(data) {
        if (data) {
            // do something with data
        }
    }, function(error) {
        // perform proper error handling
    });
```

## Proper naming
> If you can count it, give it a noun for a name!

One of the things that confuse me when I bump into code that uses promises is the naming. 

```javascript
// badly named variable -- we have a DEFERRED object, not a defer action.
var defer = Promise.defer();

// Much better
var deferred = Promise.defer();
```

I'm really into clean, self-explanatory code so snippets like the one above turn my "you-re-not-respecting-the-styleguide" alarm on.

## Working with multiple promises
> Do you just `deferred.resolve(data);`? Then why write it 100 times?

Let's say that you use the `DataService.getCustomerDetails` method, along with a `Cart.getCartItems()` method pull in the necessary information for an order.  
After receiving the info, you need to set the data as properties on the `Order` instance. If all you're doing is `this.property = returnedData`, instead of writing 2 separate calls, you can use [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), and use its `success`/`rejection` callbacks instead of having individual callbacks for each promise.  
This way, if you would have to add a third promise, and set whatever data it returns on the current order, you only need to write 2 lines of code, instead of approx. 6 lines. I'm suggesting the following structure, that promotes code reuse.

```javascript
// Note that this will not work currently as support for native Promises in 
// es6-enabling module loaders/runtimes is not that stable
import DataService from './dataservice.js'
import Cart from './cart.js'

class Order {
    constructor(options) {
        Promise.all([
            DataService.getCustomerDetails(options.userID),
            Cart.getCartItems()
        ]).then(function(data) {
            this.customer = data[0];
            this.cartData = data[1];
        }, function(err) {
            throw new Error(err);
        });
    }
}
```

## `IF error THEN reject`

Just don't do this:

```javascript
function someAsyncTask(query) {
    var deferred = Promise.defer();

    ExternalService.getData(query, function(err, data) {
        if (err) {
            console.log('An error has occurred!');
            return;
        }

        deferred.resolve(data);
    });

    return deferred.promise;
}
```

Add a case for rejection and always add use the rejection callback when using promises. Make sure you also add meaningful messaging, especially when dealing with errors/rejections.

```javascript
function someAsyncTask(query) {
    var deferred = Promise.defer();

    DataService.getData(query, function(err, data) {
        if (err) {
            deferred.reject({
                message : 'Query to the dataservice failed.',
                error   : err
            });

            return;
        }

        deferred.resolve(data);
    });

    return deferred.promise;
}
```

## Don't `resolve` when you should `reject`

You might find yourself in a situation where you're calling an external API, and if that call fails for some reason, you would still like to return some data from the promise, instead of rejecting it and probably making the rest of your code fail. In that situation you probably think the right thing to do is to choose a solution like the one below.

```javascript
function getOrderDetails(orderID) {
    var deferred = Promise.defer(),
        defaults = {
            orderID : 0,
            items   : [],
            amount   : 0
        };

    Order.getDetails(orderID, function(error, data){ 
        // If the getDetails API endpoint fails, then just send some default data
        if (error && error.statusCode == 500) {
            deferred.resolve(defaults);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

// The call looks like this
getOrderDetails('ABC123')
    .then(function(data) {
        if (data) {
            // do something with data
        } else {
            // error handling
        }
    })
```

The problem with the code above is that only you know how to call the getOrderDetails function. If another developer has to work with your code 3 months from now, he will probably write the `getOrderDetails` call using both success and rejection callbacks, and will probably spend some time figuring out why somewhere along the road his order `amount` is set to 0. Bottom line, please use resolve/reject thoroughly, as reject doesn't necessarily mean CRASH THE PROCESS, or BLOW UP THE APPLICATION. It's just a way of saying that something failed and you should take an action.

## Short-cirtuit ? Use `return`.

If by any chance you have to implement a method that takes a deferred as an argument and resolves/rejects it based on data resulting from further processing, you have to rely on `if-else`  statements.  
In this situation, if you're planning to short-circuit the logic, note that `deferred.resolve()` and `deferred.reject()` don't return the control to the caller, so always use `return` after you resolve/reject(depends on your situation) the promise, as without it, the code will continue to run.

```javascript
function processData(deferred, input)
    somePromiseBasedTask(input, function(err, data) {
        if (err) {
            deferred.reject(err);
            return; // USE it or the logic will continue to execute below    
        }

        deferred.resolve(data);
        
    });
}
```

In the previous code block, if an error occurs and no `return` exists, you will be rejecting the promise as `err == true` and then try to resolve it, as the logic will exit the `if` statement and move further to the `deferred.resolve()` statement, which will result in an error.

## Libraries

Last but not least, I'll share a list of promise libraries that I really like. All of the implement the [Promises A+ spec](https://promisesaplus.com/implementations).

* [when.js](https://github.com/cujojs/when)
* [Q](https://github.com/kriskowal/q)
* [$q](https://docs.angularjs.org/api/ng/service/$q) &mdash; the AngularJS implementation for Q

Please make sure to leave some feedback, and submit a pull request if you find typos or errors in the logic, it was 3:00 AM when I wrote most of the content.

> Image credits: [Promise?](https://flic.kr/p/3f12JL) by [Carmella Fernando](https://www.flickr.com/photos/13923263@N07/)
