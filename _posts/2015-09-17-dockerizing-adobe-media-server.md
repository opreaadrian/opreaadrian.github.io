---
layout: post
title: "Dockerizing Adobe Media Server"
pub_date: 2015-09-17 12:00:00 PM
last_modified: 2015-09-17 12:00:00 PM
categories: docker
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: workflow, productivity, fms, ams, docker, adobe, media, server, flash, commitments, blog
featured_image: /images/posts/dockerizing-adobe-media-server/dock.jpg
---

New job, new technologies, new problems to solve &mdash; that's how it all started for me.  
After switching jobs few months ago, I found myself working on an application that makes heavy use of
Adobe Media Server(AMS) for audio and video streaming.  
Nothing too hard, or too complicated, except for the fact that all developers were using a single
install of AMS which was somewhere on a central server.  
This started all my single-point-of-failure alarms, and started to ockerize the whole development
environment, including AMS. In this article, I will explain the steps I followed in order to
properly create a [docker](https://www.docker.com/) container running Adobe Media Server, with 
full RTMP/RTMPS support, 

By now, many of the developers with an interest in DevOps should know about Docker, so I wont waste
time explaining what Docker is, there are plenty of resources out there, starting with the
[official docker documentation](https://docs.docker.com/), very rich in examples and explanations.

So, back to our AMS setup, there's one "small" problem, setting it up inside a Docker container 
&mdash; it doesn't work straight out of the box.  
This is because when you install Adobe Media Server, you get the application's  license, `less`-ed 
to you, and you need to press the spacebar(or the down arrow if you feel a  bit crazy) and hit a 
key when you reach the bottom, confirming that you've read and agreed with the license.  
In my opinion, this is complicated stuff, so let's simplify. As it turns out, just by going to the 
directory where the AMS archive is extracted, and removing "License.txt", you can aviod having to 
"read" the whole license before continuing.  
So much for the first part of the problem. But there is still something to be done! The install
script is still waiting for user input, to continue with the setup, so what you have to do
next is to comment out the line that halts the  installation until it gets a keypress, in the 
`installAMS` script. For this matter in particular, you will need to use 
[`sed`](https://www.gnu.org/software/sed/manual/sed.html), just like in the snippet below.

{% highlight bash%}
$ cd ams_setup_directory
$ rm -Rf License.txt
$ sed -i -e 's:read cont < /dev/tty:#read cont < /dev/tty:g' installAMS
{% endhighlight %}

After getting rid of the license, and the blocking keypress timeout, comes the normal setup, where
you have to provide various answers to the installer. This is where the second problem appears, as 
you aren't able to answer those questions yourself, because everything takes place when you're 
building your Docker image.  
At one point, when I was at my lowest self-esteem level of all times, somebody suggested using 
[Expect](http://expect.sourceforge.net/) to autofill the answers, but I wasn't in the mood for
reading at that time. Besides, I knew that it had to be simpler than that, and I was right.  

The answer lies in the setup itself. What you have to do is to do is to open your editor, and 
manually go through the setup, while writing down each answer you put in (including `RETURN`s).
At the end of the setup you will have something looking like the snippet below 
(whitespace is relevant):

{% highlight bash%}
# begin input file
      
n
/opt/adobe/ams 
admin
123456789
123456789
ams
y
ams
y
y

ams
1935,-443
1111
y
n
y
      
     
# end input file
{% endhighlight %}


that you can validate against AMS's "Install Action Summary", outlined below:  

{% highlight bash%}
----------- Install Action Summary -----------

Installation directory         = /opt/adobe/ams

Adobe Media Server Port        = 1935,-443
Adobe Media Admin Server Port  = 1111
Interface (IP address) AMS will listen on  = auto

Apache Install                 = Yes


Administrative username        = admin
Administrative password        = (suppressed)

service owner                  = ams

service user                   = ams
service group                  = ams

Run as daemon                  = Yes
{% endhighlight %}

Now, to make this work, all you have to do is to save that input file, somewhere on the filesystem 
of your container, and simply `pipe` it through `installAMS`. I would recommend naming the file 
`installAMS.input`, so you can easily identify which is which. After you've created your input file, 
all you need to do is to execute one of the following commands, in the directory where the AMS 
archive was extracted: `./installAMS < installAMS.input` or `cat installAMS.input | ./installAMS`.  


Having this knowledge under our belts, it's pretty straightforward to create a `Dockerfile` with 
the afore-mentioned setup, and with a bit more effort, to have a fully isolated Adobe Media Server
install, easily reproducible from version control.  
Your `Dockerfile` will probably look like the one below, with minor tweaks based on your needs:

{% highlight bash%}
FROM centos:6
MAINTAINER Adrian Oprea<adrian@codesi.nz>

RUN rpm --import https://getfedora.org/static/0608B895.txt
RUN yum update -y && yum install -y tar python-setuptools
RUN easy_install supervisor

RUN mkdir -p /var/log/supervisor
COPY conf/supervisord.conf /etc/supervisord.conf

WORKDIR /tmp
RUN curl -O http://download.macromedia.com/pub/adobemediaserver/5_0_8/AdobeMediaServer5_x64.tar.gz
WORKDIR /tmp/ams_latest
RUN tar zxvf ../AdobeMediaServer5_x64.tar.gz -C . --strip-components=1
RUN rm -Rf License.txt
RUN sed -i -e 's:read cont < /dev/tty:#read cont < /dev/tty:g' installAMS

COPY conf/installAMS.input installAMS.input

RUN ./installAMS < installAMS.input
COPY certs /opt/adobe/certs
COPY conf/Adaptor.xml /opt/adobe/ams/conf/_defaultRoot_/Adaptor.xml

# CLEANUP
WORKDIR /tmp
RUN rm -Rf ams_latest AdobeMediaServer5_x64.tar.gz

VOLUME ["/opt/adobe/ams/applications"]

EXPOSE 80 443 1111 1935

CMD ["/usr/bin/supervisord"]
{% endhighlight %}

The whole setup, including a set of working self-signed SSL certificates so you can test the RTMPS 
connection, and a ready-made configuration for `docker-compose` is available on 
[my GitHub account](https://github.com/opreaadrian/docker-adobe-media-server).  
Make sure to get back via Twitter([@opreaadrian](https://twitter.com/opreaadrian)) with feedback, 
questions and suggestions, and also make use of the comments section.

> Image credits: [Beverley Goodwin](https://www.flickr.com/photos/bevgoodwin/)
