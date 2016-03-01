---
layout: post
title: "An SSH workflow that's easier on your brain"
pub_date: 2016-02-29 02:30:00 PM
last_modified: 2016-03-01 11:00:00 AM
categories: productivity
published: true
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: hacks, tricks, workflow, tips, ssh, remote, servers
featured_image: /images/posts/serializing-object-methods-using-es6-template-strings-and-eval/post.jpg
---

In this quick tip, I will share my SSH workflow and how I manage things
when it comes to working with multiple remote machines.
Unlike "the old days" when we used to have Apache installed locally on our
machines &mdash; I see you Mamp Server users &mdash; now, with the rise of cloud
providers like Amazon, Digital Ocean or Microsoft Azure, and  products such as
Docker, we are working more and more on systems that are spread accross multiple
machines, instances, containers, you name it.

Part of my daily routine is working on certain machines that are usually
accessible via SSH and my biggest problem, currently, is remembering the ip
addresses of the machines I want to connect to, or at
least part of the ip addresses so I can do a quick reverse-i-search
(`CTRL+R` on any machine using bash, zsh).  
You're probably thinking: "Maybe you should just use the `fish` shell and rely
on its awesome command completion functionality", and you are right, but not
even the almighty `fish` shell save me, so I've developed a habit of using my
ssh config as much as possible.  
The normal way you would connect to a server through SSH would be to issue the
following command: `ssh user@192.168.1.1`, insert your password and you're done.  
The approach above makes four false assumptions about me:

1. I know/remember the username(ok for 1-2 machines, not ok for 10-15)
2. I know/remember the IP address
3. I know/remember the password
4. I am able to type my password correctly

Honestly, I am able to remember everything I mentioned above,for 1-2 servers,
but I have to work with 5+ servers, and no two configurations
are the same. For this, I have a solution that is called `ssh_config`.
It usually resides on your machine, in your `$HOME/.ssh/` directory
(assuming you have [openssh](http://www.openssh.com/) installed on your machine).
To check whether or not you already have the file available on your system, run
the first command from the gist below, and see if your output is similar to mine,
and if not, follow the instructions to create it.

{% gist opreaadrian/fe17eff7843f8b3dcaca 1.sh-session %}

Now that you've created the config file, let's add stuff to it. A typical
configuration, would contain things like the alias you would like to give to
your server, your username on that machine, your preferred authentication
method, and by putting it all together, you get something similar to the snippet
below.

{% gist opreaadrian/fe17eff7843f8b3dcaca 2.sh-session %}

A short explanation for each line has been added for each line in the
configuration but in order to reap all the benefits that an `ssh` config file
has to offer, I encourage you to go through
[the documentation for `ssh_config`](http://www.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5),
or type `man ssh_config` in your preferred terminal emulator.

To get a better idea on how a full `ssh_config` file would look like, you can
take a look at the snippet below, that shows a multi-machine config with all
the bells and whistles.

{% gist opreaadrian/fe17eff7843f8b3dcaca 3.sh-session %}

In order to connect to any of those machines, I just need to run `ssh <Host>`, so,
if I would like to connect to my `manager` instance, all I need to do is run
`ssh manager`. Would you prefer to `ssh root@192.168.38.1` and then having
to type your password, every time? Didn't think so.  
I really hope you enjoyed this short article and that the knowledge you get from
it helps you spend less time on the mundane tasks and more on the creative side
of our jobs.

> Photo credits:  
> [Sergio Delgado](https://www.flickr.com/photos/sdelgado) &mdash; [Three-toed sloth in the Dallas World Aquarium](https://en.wikipedia.org/wiki/Sloth)
