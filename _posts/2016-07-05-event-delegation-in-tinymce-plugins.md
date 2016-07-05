---
layout: post
title: "Event delegation in TinyMCE plugins"
pub_date: 2016-07-05 12:00:00 PM
last_modified: 2016-07-05 12:00:00 PM
categories:
  - javascript
published: true
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: JavaScript, ES6, ECMAScript6, development, TinyMCE, plugins
featured_image: /images/posts/event-delegation-in-tinymce-plugins/post.jpg
---

For the past week or so, I've been working with [TinyMCE](https://www.tinymce.com/). For those of you
who don't know what it is, I'll just say this: it is a **WYSIWYG** (What You See Is What You Get) editor, very
similar to the ones you find in popular blogging platforms like [Wordpress](https://wordpress.com/).

I'm working on a personal project, that involves parsing the content that the user inputs in the editor,
and generating a template that would later be rendered as a PDF. For the project's specific needs,
I had to develop a small plugin that would display a popup when certain elements are clicked.  
A thing I've struggled with the most was how to find elements in the editor's DOM content. Once I had that
figured out, what I had to do was to place some event handlers on specific elements in the content.  
Unfortunately, the `tinymce.dom.DomQuery#on()` method, is not similar to jQuery's `.on()`. The main problem
is that it receives only 2 arguments, instead of 3, so you are not able to specify an element identifier to
which the application should delegate, let's say, click events.
Below is a comparison of the two `.on()` methods:

{% highlight js %}

// jQuery.on()

$('.element').on('click', '.delegate-child', function(event) {
  // Do stuff when .element receives clicks
  // and the target is a .delegate-child element
})

// tinymce.dom.DomQuery.on()

$('.element').on('click', function(event) {
  // Do stuff when .element receives clicks
})
{% endhighlight %}

As you can see, there is no way for us to register for click events on the `.delegate-child` elements,
unless we bind a callback to each element, like below:

{% highlight js %}
// tinymce.dom.DomQuery.on()

$('.delegate-child').on('click', function(event) {
  // Do stuff when .delegate-child receives clicks
})
{% endhighlight %}

The problem with the approach above is that if we add more `.delegate-child` elements, further
down the road, those will not have the click handler registered, so clicking on them would not
trigger the desired behavior.

Fortunately, the `event` is being passed as an argument to our click handler, so we can use a combination of
`event.target.nodeName`, to figure out if the node receiving the click is of the type we would like to delegate to.
We can also strengthen our verification by checking for a class name as well.  
Take a look at the snippet below for the full example:

{% highlight js %}
// tinymce.dom.DomQuery.on()

$(editor.getBody())
  .on('click', function(event) {
    if (
      (event.target.nodeName.toLowerCase() !== 'span') ||
      (!event.target.classList.contains('.formField'))
    ) {
      return;      
    }

    console.log(`${event.target.nodeName} => CLICKED`)
  })
{% endhighlight %}

If you would like to learn more about event delegation, and why is it beneficial,
check out the list of articles below:

- [https://davidwalsh.name/event-delegate](https://davidwalsh.name/event-delegate)
- [https://learn.jquery.com/events/event-delegation/](https://learn.jquery.com/events/event-delegation/)
- [https://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/](https://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/)
- [http://javascript.info/tutorial/event-delegation](http://javascript.info/tutorial/event-delegation)
- [https://www.nczonline.net/blog/2009/06/30/event-delegation-in-javascript/](https://www.nczonline.net/blog/2009/06/30/event-delegation-in-javascript/)

Hopefully this saved you from a terrible headache! If you need any help or would like
to share your experience, you can do so by using the comments section or by tweeting at
[@codesinz](https://twitter.com/@codesinz) or at [@opreaadrian](https://twitter.com/@opreaadrian)

> Photo credits:
> [KOMPETENZZENTRUM: PRÄSENTATION](https://www.flickr.com/photos/kom-p/) &mdash; [Delegation](https://flic.kr/p/9ZPcVC)
