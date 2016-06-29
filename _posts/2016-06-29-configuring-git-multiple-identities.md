---
layout: post
title: "Configuring Git - multiple identities"
pub_date: 2016-06-29 4:20:00 PM
last_modified: 2016-06-29 4:20:00 PM
categories:
  - productivity
published: true
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: workflow, git, github, gitlab, gitconfig, productivity, development
featured_image: /images/posts/multiple-identities-with-git/post.jpg
---
I've been a freelancer for quite some time, and for approximately the same amount
of time, I've been making the same mistake, over and over, again. Whenever I had
to work for multiple customers in the same period of time, I would always mix-up
the email addresses in my Git configuration, and end up committing code on
a client's codebase and sign it with the email and details from another client.  

And it was all because of the two commands below:

{% highlight console %}
$ git config --global user.name "Adrian Oprea"
$ git config --global user.email "company@email.com"
{% endhighlight %}

Whenever I looked for help on how to set my name/email configuration in Git,
I found these two commands. It doesn't matter which Git provider you're using,
GitHub or GitLab, it's all the same. So I did what everyone would do, I copied
and pasted those commands over and over again.  

There's nothing wrong with setting a global name/email in your git configuration,
I have them set up for my public/open-source projects, but for your client projects,
use the local config. This way, you'll have project-specific configuration, at the
project level, and shared settings at the global level.

So instead of using the `--global` flag, just use the `--local` flag, and
everything will be set at the repository level, in the local config file &mdash; `.git/config`.

In order to configure my details on a repository basis, all you to do is to paste
the following lines, in the command line:

{% highlight console %}
$ git config --local user.name "Adrian Oprea"
$ git config --local user.email "company@email.com"
{% endhighlight %}

This means that you can keep your global settings intact and only update the
configuration at the local level.

### Bonus

To view all the values that are currently set at the local/global level run
one of the following commands in your terminal emulator of choice:

{% highlight bash %}
$ git config --local --list
$ git config --global --list
{% endhighlight %}

Have a tip you would like to share with others? Feel free to do so, in the comments section.

> Photo credits:
> [Teza Harinaivo Ramiandrisoa](https://www.flickr.com/photos/harinaivoteza/) &mdash; [Cameleon colors](https://flic.kr/p/bKW1jF)
