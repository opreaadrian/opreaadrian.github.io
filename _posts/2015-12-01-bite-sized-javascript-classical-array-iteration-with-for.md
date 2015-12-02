---
layout: post
published: false
title: "Bite-sized JavaScript - Array iteration with for"
pub_date: 2015-12-01 10:00:00 PM
last_modified: 2015-12-01 10:00:00 PM
categories: javascript
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: javascript, array, programming, beginner, iteration, for, loop
featured_image: /images/posts/bite-sized-javascript-classical-array-iteration/post.jpg
---

Last week I started this blog series, on JavaScript arrays and I feel it's time to learn more about classical array iteration. With the emergence of reactive programming, arrays take a central role in the whole development equation, and I feel that both me, and other developers should grasp this concept thoroughly.  
In this article, I plan on presenting the various ways in which one can iterate over the members of an array. We're not going to talk about the fancy `forEach` and its' "compañeros" just yet. In order to appreciate the benefit that methods such as `forEach`, `map` and the like bring to the table, the developer first needs to know the ins and outs of classical iteration.

## Iterating with `for`

The first looping instruction they teach you in school, will most probably be the good old `for`.

```javascript
// We have an array of 5 ice-cream flavors
var flavors = ['banana', 'vanilla', 'chocolate', 'rum', 'strawberry'];

// We loop over its members and print the message below at the console
for (var i = 0; i < flavors.length; i++) {
	console.log('The current country is: ' + flavors[i]);
}
```

Now, let's dissect it and see how it works, what are its internals, the moving parts, etc.

```javascript
// Dissection time
/*
      index    looping condition   incrementor
        |             |                 |
        V             V                 V
*/
for (var i = 0; i < flavors.length; i++) {
    console.log('flavors[' + i + '] = ' + flavors[i]); // <-- loop body
}
```
Let us now get one step closer towards understanding the snippet above, and translate it to pseudocode.

```javascript
// Iteration flow - pseudocode
FOR
  INITIALIZE index WITH 0
  IF index IS LESS THAN array length
  EXEC loop body
  INCREMENT index
```

To be 100% clear, let's see how everything reads in plain english:

```
// Iteration flow - plain english
FOR all items in the countries array,
AS LONG AS the index(i) is not bigger than the array's length,
PRINT a message and then increment the index(i).
```

## Flavors of the `for` loop

As we can see from the snippet above, the `for` loop has several moving parts:

* The variable assignment &mdash; `var i = 0;`
* The looping condition evaluation &mdash; `i < flavors.length`
* The index incrementation &mdash; i++; &mdash; also called the "afterthought"

> Note that a `for` statement might not always increment the index at the end of an iteration step, it can also decrement it, or perform other operations such as multiplication, for example, that's why the last part of the for statement is also called "afterthought". We will stick to the "incrementor" naming as usually that's what we do when iterating, we increment the counter.

Let's go further and look at variations of the for loop, and why they're beneficial;

```javascript
var flavors = ['banana', 'vanilla', 'chocolate', 'rum', 'strawberry'];

// Declare the index but don't assign a value to it
var i;

// Assign the value only when the loop starts
for (i = 0; i < flavors.length; i++) {
  console.log('flavors[' + i + '] = ' + flavors[i]);
}

// [...]

// Reuse the same "i" variable but assign it a different value
for (i = 2; i < flavors.length; i++) {
  console.log('flavors[' + i + '] = ' + flavors[i]);
}
```

In the snippet above, we declared `i` outside the for loop, and reused the same variable for the two iterations. Given the synchronous nature of the `for` loop, we don't run into weird race conditions, where both loops use `i` and modify its value. The code above executes in a top-down fashion, thus, we can reuse the same variable; this is not necessarily a best practice, it's the developer's choice.  
The benefit of reusing the same variable is that instead of having 2 variables in memory, each holding a number, you only have one, that you reuse. This might not sound like much in a simple application, but might prove beneficial in large-scale, memory-sensitive applications.

```javascript
var flavors = ['banana', 'vanilla', 'chocolate', 'rum', 'strawberry'];

// We declare and define the value upfront
var i = 0;

// We cache the length of the array in a variable
// This is beneficial as we won't need to perform property access
// at each of the iteration's steps -- i < flavors.length is costly
var flavorsCount = flavors.length;

// We can now entirely omit the i = 0 part as we have done this outside the loop
for (; i < flavorsCount; i++) {
  console.log('flavors[' + i + '] = ' + flavors[i]);
}
```

What we did above was to declare `i` upfront and exclude it from the statement body. We also cached the length of the array in a variable and this is a best practice that everyone should know when working with JavaScript arrays. Object property access in JavaScript is costly, and for big collections of items, going for the `length` property at each iteration step is an unnecessary overhead.

Let's now take a look at the last important flavor of the `for` loop and then get to best practices.

```javascript
var flavors = ['banana', 'vanilla', 'chocolate', 'rum', 'strawberry'];

var flavorsCount = flavors.length;

// We can now entirely omit the i = 0 part as we have done this outside the loop
for (; flavorsCount > 0 ;) {
  --flavorsCount;
  console.log('flavors[' + flavorsCount + '] = ' + flavors[flavorsCount]);
}
```

What we did in this last snippet is called a reverse `for` loop, that iterates the array backwards. If order is not important, this is a pattern that you should remember, as it has very few moving parts.

* We removed the need for an index in the form of `i`
* We're using `flavorsCount` as our index
* We lost the "incrementor" part as well &mdash; we're decrementing the counter directly inside the loop body.

Though the above pattern is more perforomant than classical interation, it needs to be used with care, as it is a flavor of the asshole effect( more info [here](https://evanjpalmer.wordpress.com/2013/05/09/paul-irishs-asshole-effect/) and [here](http://www.paulirish.com/2010/10-things-i-learned-from-the-jquery-source/)), that I call the smartass effect.  
The only problem with the code above is that junior developers for example, might not get your half-empty, inside-the-body-decrementing loop, and they might get frustrated, or think you don't know anything about programming. So, unless performance is critical, and you're dealing with huge, and I mean HUGE chunks of array data, you're better off with a regular-looking `for`.

## Best practices

Always cache the array's length in a variable:

```javascript
var flavorsCount = flavors.length;
```

If you're performing multiple operations on an array member, cache it in a variable that you define outside the loop's body:

```javascript
var flavors = ['banana', 'vanilla', 'chocolate', 'rum', 'strawberry'];
var flavorsCount = flavors.length;
var currentCountry = "";
var i = 0;

for (; i < flavorsCount; i++) {
  // Cache the current country as we are going to use it multiple times
  // Saves us from accessing the same array member multiple times
  currentCountry = flavors[i];

  if (currentCountry === 'Romania') {
    console.log('I live in ' + currentCountry + '. ' + currentCountry + ' is a beautiful place!');
  } else {
    console.log('I don\'t live in ' + currentCountry + '.');
  }
}
```

Give meaningful names to your variables &mdash; you should apply this to all your JavaScript code:

```javascript
// do
var flavorsCount = flavors.length;
// don't
var l = flavors.length;

// do
var currentCountry = flavors[i];
//don't
var curr = flavors[i];
```

If performance gains are minimal &mdash; they don't grow by an order of magnitude &mdash; always opt for the readable version, instead of the "smartass" one, you'll thank yourself 6 months from now.

Always document areas that you feel will be unclear to newcomers:

```javascript
// DO

/*
  Intended reverse loop. Done order is not important and we need the
  performance gains.
  `i` is missing as we need fewer moving parts in order to keep the loop
  performant enough for this large volume of data.
  `flavorsCount` goes from the array's `length` down to `0`
  Equivalent to
    for (var i = flavorsCount - 1; i >= 0; i--) {
      // logic using flavors[i]
    }
 */
for (; flavorsCount > 0 ;) {
  --flavorsCount;
  console.log('flavors[' + flavorsCount + '] = ' + flavors[flavorsCount]);
}

// DON'T - smartass effect
for (; flavorsCount > 0 ;)
  flavorsCount-- && console.log('flavors[' + flavorsCount + '] = ' + flavors[flavorsCount]);
```

## Conclusion

As you can probably see, there are multiple ways of writing even the most simple of things in programming, like the for loop. It is good to be aware of the various shapes it can take, so you can make informed choices, when you have to sacrifice, let's say performance over readability, or the other way around. I highly encourage you to send me feedback, and use the comments section as much as possible.  

In the next post, we're finally going to look at our first `Array` method, `Array#forEach()`.

> Credits:   
> [Matt Mets](https://www.flickr.com/photos/cibomahto/) &mdash; [7x7 tri-color LED array](https://flic.kr/p/4qqJzZ)  
