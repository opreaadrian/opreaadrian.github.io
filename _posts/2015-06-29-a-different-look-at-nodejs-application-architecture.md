---
layout: post
title: "A different look at Node.js application architecture"
pub_date: 2015-06-29 12:00:00 PM
last_modified: 2015-06-29 12:00:00 PM
categories: speaking
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: workflow, productivity, nodejs, node, node.js, npm, packo, automation, node_modules, module, package
featured_image: /images/posts/a_different_look_at_nodejs_application_architecture/different.jpg
---

Wednesday, June 24th, I attended the [BucharestJS meetup](http://www.meetup.com/BucharestJS/) as a speaker, with a presentation titled <a target="_blank" title="BucharestJS presentation: A different way to node" href="http://codesi.nz/presentations/a-different-way-to-node/index.html">A different way to node</a>, and I had a blast sharing with people the way I do things when it comes to Node.js application architecture.  
In fact, I was so encouraged by their feedback that I plan on participating with more presentations on various problems that developers face, not only on the technology side, but also on the human side: motivation, health, etc.  

The gist of the presentation is as follows:  
I'm one hell of a lazy developer, and I hate having to manage everything "by hand". If I see myself doing something more than once, I immediately try to automate it, and that's what I did with my Node.js development workflow. I found myself in situations where I had to perform cross-directory `require` calls, and I ended up with a lot of `require('./../../lib/util.js');` and all hell broke loose when I had to reuse logic, or maintain my own code. That's exactly the reason I developed [packo](https://www.npmjs.com/package/packo): to help me save time and toasted neurons.  
I confess, I'm not less busy once I started developing with [packo](https://www.npmjs.com/package/packo), as I immediately found something to do with the seconds I save by using it, but I seem to enjoy more of the things I want to do, as opposed to the things I have to do. This is precisely the effect I whish this presentation has on both attendees and regular blog readers, and I would like people to get into the mindset of sifting through the mundane quicker, and save their creative juices for the really important problems, rather than for figuring out if `__dirname` is the current directory their module is in, or if it has been reset based on where the application was instantiated.  

I would like to thank the organisers for having the patience and determination to keep the group alive and appealing to developers.
This article is a follow-up to my presentation and will serve as an entrypoint for people whishing to get access to the slides.

The slides are available here: <a target="_blank" title="BucharestJS presentation: A different way to node" href="http://codesi.nz/presentations/a-different-way-to-node/index.html">http://codesi.nz/presentations/a-different-way-to-node/index.html</a>.  
All the assets including the private npm repository configuration, are availble on GitHub: [https://github.com/opreaadrian/different-way-to-node](https://github.com/opreaadrian/different-way-to-node). There's one issue with the sinopia Dockerfile so I would recommend using the [sinopia module from npm](https://www.npmjs.com/package/sinopia).

Cheers!

> Image credits: [Kate Ter Haar](https://www.flickr.com/photos/beglen/)
