---
layout: article
title: Thoughts on Angular 2.0
modified: 2014-11-05 12:00 PM
summary: This is a summary about how I feel about the new Angular 2.0 syntax, in relation to the WWW, and web standards. This is an opinion that many of my friends who use Angular for their projects share, so I thought it's worth expanding on the subject.
categories: JavaScript Angular
tags: javascript angular2.0
comments: true
---

Today I just started officially blogging, and I feel like a bit of a punk, starting my so-called blogging career with something that resembles a diss, but, Google, you just ruined HTML with your Angular 2.0 plans.

I am a big fan of Angular, and I really love the way it behaves, and how performant it can be when used right, but when I wanted to find out more about the plans Google has with Angular 2.0, it kind of threw me back... way back. 

I'm currently working on a side project that is a little bit of a mess right now. Built on Django, with JavaScript mixed in Jinja templates(and the other way around), all scripts dumped in the HTML, RequireJS on top of everything, and some libraries that I never heard of, built by weird russian guys(fantastic backend devs) &mdash; no pun intended &mdash; the project rings the average developer's "LET'S REWRITE THIS SHIT" bell. 

After countless discussions with my client, he finally agreed to have his backend developer build a RESTful API for me to use with ... you guessed it, folks, the new Angular app that I was planning on building for him. 
I actually thought Angular would be the greatest solution and I based my choice on the following facts:

* Angular is maintained by Google.
* It is mature enough in the web development landscape.
* It has a huge comunity.

After making this choice, I already created a basic structure for the app, and laid out the bricks that form the base of the app &mdash; folder structure, module hierarchy, initial markup, tools setup, tests, etc.

Besides the fact that now I have to re-evaluate the framework landscape and think of another framework I can use for my client, the biggest reason I'm so upset with this change has more of a historical nuance. 
If you remember the way Microsoft tried to have/push their own JavaScript, in IE &mdash; see [JScript](http://en.wikipedia.org/wiki/JScript) &mdash; then you can probably see the same thing done by Google nowadays. There have been a lot of attempts like this, and to some degree, they feel like a normal thing to me, as the bigger companies would like to have it their way, but none struck me so hard, as I was not that involved in development and nor did I care about standards so much.

At this point, it just feels like Google wants to have their own WorldWideWeb, with this way of writing Angular apps, and by imposing such a specific way of writing apps, the developped, the so-called "Angular developer" who knows very little about JavaScript, but can talk for days about `$scope`, two-way data binding, and how they're the most awesome things in the Universe after `42`.

So, to summarize my complaint, and also to illustrate why I'm feeling Angular 2.0 syntax is wrong, take a look:
    
    <!-- The Angular 1.3 way -->
    <button ng-click="deleteTodo(todo)">

    <!-- The Angular 1.3 way with valid HTML -->
    <button data-ng-click="deleteTodo(todo)">

    <!-- Angular 2.0 way -->
    <button (click)="deleteTodo(todo)">

Since when is `(click)` an HTML attribute? Google, you're making HTML *too declarative* as far as I'm concerned!

I'm not going to debate all the modifications that feel wrong to me, so as a closing thought, I'd like to encourage you to talk and share your thoughts in the comments section.

