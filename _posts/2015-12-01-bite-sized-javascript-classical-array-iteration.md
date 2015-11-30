---
layout: post
title: "Bite-sized JavaScript - Classical array iteration"
pubdate: 2015-12-01 10:00:00 PM
last_modified: 2015-12-01 10:00:00 PM
categories: [development, javascript, arrays]
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: javascript, array, programming, beginner, iteration
featured_image: /images/posts/bite-sized-javascript-classical-array-iteration/post.jpg
---

Last week I started this blog series, on JavaScript arrays and I feel it's time to learn more about classical array iteration. With the emergence of reactive programming, arrays take a central role in the whole development equation, and I feel that both me, and other developers should grasp this concept thoroughly.  
In this article, I plan on presenting the various ways in which one can iterate over the members of an array. We're not going to talk about the fancy `forEach` and its' "compañeros" just yet. In order to appreciate the benefit that methods such as `forEach`, `map` and the like bring to the table, the developer first needs to know the ins and outs of classical iteration.

## Iterating with `for`

The first looping instruction they teach you in school, will most probably be the good old `for`.

```javascript
// We have an array of 5 countries
var countries = ['Romania', 'United Kingdom', 'United States', 'France', 'Canada'];

// We loop over its members and print the message below at the console
for (var i = 0; i < countries.length; i++) {
	console.log('The current country is: ' + countries[i]);
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
for (var i = 0; i < countries.length; i++) {
  console.log('The current country is: ' + countries[i]);  // <-- loop body
}

// Iteration flow - pseudocode
FOR
  INITIALIZE index WITH 0
  IF index IS LESS THAN array length
  EXEC loop body
  INCREMENT index

// Iteration flow - plain english
FOR all items in the countries array,
AS LONG AS the index(i) is not bigger than the array's length,
PRINT a message and then increment the index(i).
```

> Credits:   
> [Matt Mets](https://www.flickr.com/photos/cibomahto/) &mdash; [7x7 tri-color LED array](https://flic.kr/p/4qqJzZ)  
