---
layout: post
title: "Communicating through commit messages"
pub_date: 2015-06-05 03:50:00 PM
last_modified: 2015-06-05 03:50:00 PM
categories: workflow
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: git, workflow, github
featured_image: /images/posts/communicating_through_commit_messages/committment.jpg
---

How many times did you find yourself in a situation where you wanted to figure out how you implemented a specific feature at some point in time, or how you implemented that bugfix 6 months ago in order to fix a bug that has been reopened? For all those situations, you probably tried to go back to the code, tried to go through your commits, and you probably ended up in a situation similar to mine.
In this article, I'll go over my research for a better commit message "framework"(everything is a framework these days) and how I managed to solve the "I don't know what I had for lunch yesterday, how am I supposed to know what I did 6 months ago?!" problem, when it comes to commits.

If you're like me, you probably mess things up pretty frequently, and you need to refer back to your git history pretty often. If you're lucky, your commit logs will probably look like the ones below:

![Packo commit log](/images/posts/communicating_through_commit_messages/packo_commit_log.png)

I'm fortunate, as I'm currently the only person working on that project, and I have the tendency to detail up to a certain point what I did. But what would happen if I would have to onboard more people on that project, will they know what I meant, will they know what `"Fix weird bug -- npm skipping chalk installation"` means? Will they know what I wanted to say by `"Update README and examples"`?
What if there was a better way for me to properly describe what I did and also WHY I did it, and make everyone's life easier, including mine. 
After doing some scanning on the Internet, I wasn't able to find something that would really fit the bill and make me say ["This is it!"](http://www.imdb.com/title/tt1477715/) so I looked at how the frameworks do it and I found my answer there.

I finally settled on 2 styles of commit messages that I scrutinised for 2 whole days: [the EmberJS commit tagging style](https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md#commit-tagging) and [Angular's Git commit guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

I fancied  Ember's style, as it was very similar to what I did at work, namely tagging every commit with an issue number that was most often the issue tracking system ticket id. The drawback is that I often found that developers, no matter how "dedicated" to the cause they may be, they often add only the issue number and forget to describe what they did, so you often end up with commit messages like the ones below:

```
* a85ad84 - [ISSUE-3344 bugfixing] (1 month ago)
* 58a4d05 - [ISSUE-3344 feature] (1 month ago)
* b60b79b - [ISSUE-9933] (1 month ago)
* 5ecefa9 - [ISSUE-1123] fixed text on response.body.answer (2 months ago)
* 3b26757 - [ISSUE-1123] - fixed extra space (3 months ago)
* 3993046 - [ISSUE-2344] - editorial changes (6 months ago)
```

As far as I'm concerned, the above commits suck just as much as this one: `* 0f5f6c7 - removed console.log (6 months ago)` as they don't give me any context, without having to resort to the issue tracking system, and look up the issue.
I don't know whether there was a refactoring going on, or if there was any documentation involved, if the refactoring involved modifying one, or more of the classes, modules or functions subjected to `ISSUE-3344` for example, or anything related. 

That's what led me to look into Angular's way of structuring the commit messages. 
Now, to clarify, I strongly believe that developers should spend as little time updating tickets, epics, boards, what-have-you, and focus their attention on programming, but commit messages are similar to documentation in a way, as they help you 6 months from now, after you've been surfing through 3, 4 projects, to come back and be sure you know who's the retard who added that "shitty piece of code" that could break the application in a matter of seconds if the user would have done things in a specific way(aka edge-case). 

Angular's approach is not drastically different from Ember, as they require about the same details, but where Angular shines is in the way they require you to structure your commit message. 
Their commit message needs to look like the snippet below:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

I really fancy this structure as it will instruct the developer, up to a certain point, on what they need to add to the subject line in order to give it meaning, so instead of having commits like this:
```
* 58a4d05 - [ISSUE-3344 feature] (1 month ago)
```

your commits will look like this:
```
* 58a4d05 - feat(ApplicationModel): Add getter/setter methods (1 month ago)
```

You'll know for example that you added getter/setter methods to the `ApplicationModel` class, so you can look that up. Another advantage is that if you follow the guideline to it's full extent, and add a `<body>`, you'll be able to add the issue number and a more detailed reason about your changes.

```
commit 58a4d05410adab8b8575231a5c42ce8bcb907d12
Author: Adrian Oprea <adrian@codesi.nz>
Date:   Tue May 5 13:29:58 2015 +0300

    feat(ApplicationModel): Add getter/setter methods
    
    [ISSUE-3344] Make instance properties private and add mechanism
    to properly retrieve their values via getters/setters.
```

You could also add a `<footer>` to your commit message, and you could use this to sign off commits, when performing code review, if you're working with pull requests, or if you're responsible with merging other people's work to a main branch. 
By making use of the full structure suggested by the AngularJS team, your final commit message would look something like the message below, which is clearly more "enlightening" than any of the previous versions:

```
commit 58a4d05410adab8b8575231a5c42ce8bcb907d12
Author: Adrian Oprea <adrian@codesi.nz>
Date:   Tue May 5 13:29:58 2015 +0300

    feat(ApplicationModel): Add getter/setter methods
    
    [ISSUE-3344] Make instance properties private and add mechanism
    to properly retrieve their values via getters/setters.

    Signed-off-by: Adrian Oprea <adrian@codesi.nz>
```

To wrap things up, you should definitely check both guides and see if any of them fits your bill, but I'm sticking with the Angular commit style, so if you need more information regarding the accepted commit types, scopes, etc., make sure to check out [this section of the CONTRIBUTING documentation](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

> Image credits: [Commit No Nuisance](https://flic.kr/p/ep1kv) by [David, Bergin, Emmett and Elliott](https://www.flickr.com/photos/beglen/)
