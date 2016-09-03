---
layout: post
title: "Load balancing websockets with Nginx"
pub_date: 2016-08-17 7:00:00 PM
last_modified: 2016-08-17 7:00:00 PM
categories:
  - javascript
published: true
author: "Adrian Oprea"
twitter: "@opreaadrian"
keywords: productivity, scalability, websockets, nodejs, express, javascript, nginx, load, balancer
featured_image: /images/posts/load-balancing-websockets-behind-nginx/post.jpg
---

For the past year, I've been involved in a contract that took me through most of
the areas of software development. From actual development using JavaScript, all
the way to infrastructure, cloud providers, etc.
I helped migrate the project from SVN to Git. After that, I managed to move the
development environment to Docker, and with that experience, with the aid of the
extraordinary team of people working on the project, we managed to break down the
monolith into multiple applications and their respective Git repositories,
and move almost all of them to Docker, in production.

## Table of contents
{:.no_toc}

* Table of contents(will contain all headings execept the "Table of contents" one above)
{:toc}

## The challenge
One challenge that I recently faced, was to put multiple instances of a websocket-enabled
application, behind a load balancer. I will go into the details of how I
eventually overcame this issue, below.

## The websocket-enabled application

I hate wasting time, and for the purpose of demonstration, I thought long and
hard about what application should I create. I finally realised that our
wonderful community already provides a wealth of free-to-use applications. 
I decided to use the example chat application on the official 
[socket.io](http://socket.io "Official website: socket.io nodejs websocket library"){:target="blank"} library.

Navigate to the [Get started: chat application](http://socket.io/get-started/chat/){:target="blank"} page
and scroll down to the bottom of the page. You will find a command that looks like this:


```sh
$ git clone https://github.com/guille/chat-example.git
```

The project is a very simple one, and this is precisely what I appreciate. 
First, start the project and see if it is working properly. Run
`npm install` in the project's directory, so all the dependencies are pulled
from [npmjs.org](npmjs.org "Node Package Manager official site"){:target="blank"} and installed.  
Next, run `npm start` or `node index.js` and open 
[http://localhost:3000](http://localhost:3000){:target="blank"} in your preferred browser. You should
see an image similar to the one below.

![Screenshot of the default chat application](/images/posts/load-balancing-websockets-behind-nginx/chat1.png){:height="auto" width="50%"}

### Enhancing the application

In order to see which instance are we being distributed to, we need to modify the
application code just a tiny bit. 
Here are the updates we need to make:

* Use `res.render` instead of `res.sendFile` for the chat frontend
* Use [ejs](https://www.npmjs.com/package/ejs) to render server-side variables in the HTML before sending it to the client
* Set an environment variable to identify each application instance

First, install [ejs](https://www.npmjs.com/package/ejs) using `npm install --save ejs`.
After installing it, we need to tell express to use `ejs` as a templating language.

```javascript
// [...]
var ejs = require('ejs');
// [...]
app.engine('html', ejs.renderFile);

```

If you were wondering why we're not using Pug(ex-Jade) or some other templating
module, it is because `ejs` is the closest to regular HTML and I wouldn't want
people reading this article to trip over templating modules/languages.

Back to our code, we now need to replace the `res.sendFile` call with `res.render`
and also send our node identification variable with the rendered HTML.

```javascript
// [...]
app.get('/', function(req, res){
  res.render(__dirname + '/index.html', {
      title: process.env.NODE_NUMBER || 'N/A'
  });
});
// [...]
```

Your final version of `index.js` should look like below:

```javascript
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ejs = require('ejs');

app.engine('html', ejs.renderFile);

app.get('/', function(req, res){
  res.render(__dirname + '/index.html', {
      title: process.env.NODE_NUMBER || 'N/A'
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
```

Now, you only have one thing left and you're done with updating the chat app.
You need to output the data sent from the server into the template.  
Modify `index.html` to look like below:

```erb
<!doctype html>
<html>
  <head>
    <title>Instance #<%= title %></title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
      <h1>Instance #<%= title %></h1>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
    <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
    <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
      var socket = io();
      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
    </script>
  </body>
</html>
```

## Using Nginx's TCP capabilities

First thing that came to mind was to compare Nginx with HAProxy, and make an
informed choice, but I could have blindly gone with Nginx from the start and save
a couple of hours of investigation.

### What is Nginx

According to their official website, this is the "definition" of Nginx:

> nginx [engine x] is an HTTP and reverse proxy server, a mail proxy server, 
> and a generic TCP/UDP proxy server, originally written by Igor Sysoev. 
> For a long time, it has been running on many heavily loaded Russian sites
> including [Yandex](https://www.yandex.ru/ "Yandex.ru official website"){:target="blank"}, 
> [Mail.Ru](https://mail.ru/ "Mail.Ru official website"){:target="blank"}, 
> [VK](https://vk.com/ "VK official website"){:target="blank"}, and 
> [Rambler](http://www.rambler.ru/ "Rambler.ru official website"){:target="blank"}. 
> According to Netcraft, nginx served or proxied 27.90% busiest sites in July 2016. 

They also mention companies such as 
[Netflix](https://www.netflix.com "Netflix website"){:target="blank"}, 
[Wordpress.com](https://wordpress.com/ "Wordpress website"){:target="blank"} and 
[FastMail.FM](https://www.fastmail.com/ "FastMail website"){:target="blank"} 
in their success stories section.  
Bottom line, Nginx is a web server/load balancer that we can use to serve static
content or to balance the load between multiple servers without affecting the customer.

### Why Nginx

I remembered using Nginx for a development environment setup which required handling 
data distribution over Adobe Media Server's rtmp/rtmps. That was a pretty difficult
task but the rich documentation as well as the simplicity of configuring an Nginx
Docker container made it all a breeze.  
It's been a year since I configured that environment and it holds up pretty well. 
It actually worked so well for us that we used it for the whole environment, comprised
of 4+ web applications each with their own domains and transports.

### The configuration

Up until this point, you have a working websocket chat application with instance
identification and proper rendering. Now comes the meat of the task. You need to
create a Compose config file (YAML) for your application instances and for 
the load balancer.  
Let's use the [official nginx Docker image]() and we should do the same for NodeJS.
We'll take the [Alpine Linux version of NodeJS]() from the Docker hub and mount our
`chat-example/` directory inside the container.

Here is the full [Compose]() configuration, with 4 application instances and a
load-balancer instance, linked to the chat instances using docker links.

```yaml
version: "2"
services:
    chat1:
        image: mhart/alpine-node:4
        hostname: chat1
        environment:
            - NODE_NUMBER=1
        volumes:
            - "./chat-example:/opt/chat"
        working_dir: "/opt/chat"
        command: npm start
    chat2:
        image: mhart/alpine-node:4
        hostname: chat2
        environment:
            - NODE_NUMBER=2
        volumes:
            - "./chat:/opt/chat"
        working_dir: "/opt/chat"
        command: npm start
    chat3:
        image: mhart/alpine-node:4
        hostname: chat3
        environment:
            - NODE_NUMBER=3
        volumes:
            - "./chat:/opt/chat"
        working_dir: "/opt/chat"
        command: npm start
    chat4:
        image: mhart/alpine-node:4
        hostname: chat4
        environment:
            - NODE_NUMBER=4
        volumes:
            - "./chat:/opt/chat"
        working_dir: "/opt/chat"
        command: npm start
    load_balancer:
        image: nginx:alpine
        volumes:
            - "./nginx-chat.conf:/etc/nginx/nginx.conf:ro"
        links:
            - "chat1:chat1"
            - "chat2:chat2"
            - "chat3:chat3"
            - "chat4:chat4"
        ports:
            - "80:80"
            - "443:443"
```

As you can see, we are mounting `nginx-chat.conf` onto `/etc/nginx/nginx.conf`
in the running container.
Let's take a look at `nginx-chat.conf` that we are going to use:

```conf
worker_processes auto;

events {
    worker_connections  1024;
}

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    upstream chat_service {
      ip_hash;
      server chat1:3000;
      server chat2:3000;
      server chat3:3000;
      server chat4:3000;
    }

    server {
        listen              80;
        server_name         localhost;

        location / {
            proxy_pass http://chat_service;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_redirect   off;
            proxy_http_version 1.1;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-NginX-Proxy true;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

## Using sticky sessions

### What are sticky sessions?

## Using the new Amazon Application Load Balancer

### Why not AWS Elastic Load Balancer(ELB)

### What is cookie stickyness?

## Closing thoughts

> Photo credits:
> [Credits name](http://credits.url) &mdash; [Credits Image](http://credits-image.url)
