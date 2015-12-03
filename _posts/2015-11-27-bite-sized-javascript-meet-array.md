---
layout: post
title: "Bite-sized JavaScript - Meet Array"
pub_date: 2015-11-27 10:00:00 PM
last_modified: 2015-11-27 10:00:00 PM
categories: development
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: javascript, array, programming, beginner
featured_image: /images/posts/bite-sized-javascript-meet-array/array-of-leds.jpg
---

I don't know about you but I'm working with JavaScript all day long and I always trip over arrays
when it comes to "what method for which use case". 
Whether I need to get an element from an array, check if an element exists or just create a new 
array, I always fail to remember which method does what, and of course, what each of the methods
return.  
This post is the first of a series of bite-sized(like the title states) posts aimed to first of all
remind me what each method of the `Array` object does, and to also share this knowledge with anyone
interested in the topic. The articles won't require more than a basic experience with JavaScript's
syntax so absolute JavaScript beginners are welcomed, too.

## What's an array?

At its core, an array is simply an ordered collection of items, nothing more, nothing less. When I was first
learning to program, I always thought of an array, as my shopping list.  
Please note that I did not say "sorted" list of items, that is something we are going to learn more 
about in future posts. The "ordered" part comes from the fact that an array keeps track of its
items through indexes numbered from `0` to `length - 1`.  
Basically, if you have an array like the one below, its length is 5 and the index of the last item
is 4, as index numbering starts from `0`.

```javascript
var arr = ["a", "b", "c", "d", "e"];
// arr[0] => a
// arr[1] => b
// arr[2] => c
// arr[3] => d
// arr[4] => e
```

Back to the shopping list analogy, your array of things to buy, would look like below:

```javascript
var shoppingList = [
	"carrots",
	"onions",
	"apples"
];
// shoppingList[0] => carrots
// shoppingList[1] => onions
// shoppingList[2] => apples
```

There's one more thing you need to know before we end for the day and that is the `length` property
of an array. Every time you query for the `length` property of an array, you will get the exact
number of items it holds.  
Going back to our shopping list, let's see how many items do we need to
buy:

```javascript
console.log(shoppingList.length); // => 3
```

Next, we will learn how to perform classic iteration on arrays, and also familiarize ourselves with
our first `Array` method, `Array.prototype.forEach`.

> Credits:   
> [Matt Mets](https://www.flickr.com/photos/cibomahto/) &mdash; [7x7 tri-color LED array](https://flic.kr/p/4qqJzZ)  
