---
layout: post
title: "Short tip: Working with docker-compose container names"
pubdate: 2015-11-02 12:00:00 PM
last_modified: 2015-11-02 12:00:00 PM
categories: tips
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: workflow, docker, dev-ops, docker-compose, bash
featured_image: /images/posts/short-tip-docker-compose-dynamic-container-names/post.jpg
---

In this short tip I will show you how to get the name of a  container created with  
`docker-compose`, so you can manipulate it.

## The problem
`docker-compose` generates container names going by the following convention: 
`<CURRENT_DIR>_<CONTAINER_NAME>_<INSTANCE_NUMBER>`.  
I needed to get my hands on container names so I can individually kill and remove them without
messing up with the whole infrastructure.

Let's first dissect the structure:

* `CURRENT_DIR` is the directory where the `docker-compose.yml` file is located
* `CONTAINER_NAME` is the name you gave to your service in `docker-compose.yml`
* `INSTANCE_NUMBER` is self-explanatory

So for a config file like the one below, placed in `~/Documents/projects/webapp`, your 
container would be named `webapp_nginx_1`:

```YAML
nginx:
	image: nginx
	ports:
		- "80:80"
		- "443:443"
```

## The solution
No matter how hard my problem was, I turned to my StackOverflow skills and quickly found that 
<a href="http://stackoverflow.com/questions/1371261/get-current-directory-name-without-full-path-in-bash-script?answertab=votes#tab-top" 
	target="_blank" 
	title="StackOverflow question: Get current directory name (without full path) in Bash Script">
	there was a way to parse only the `basename`</a>
from the whole `pwd` string, without complicated splits and parsing.  
The thing I was looking for was 
<a href="http://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html" 
	target="_blank" 
	title="gnu.org: Shell Parameter Expansion documentation">
	Shell Parameter Expansion</a>, which got me this thing: `CONTAINER_NAME=${PWD##*/}_nginx_1`.  
What this allowed me to do was to get the current directory name, without the full path and concatenate that with what
I wanted. Now I could `docker rm` my container peacefully.  

There's another problem, though, the fact that directory names like this:
`webapp-authentication-project`, get turned into `webappauthenticationproject`.  
For this, I resorted to <a href="https://www.gnu.org/software/sed/manual/" target="_blank" title="gnu.org: GNU Sed user's manual">sed</a> 
so I could take out the underscores and dashes from the filename.

The final version of my code looks just like the snippet below:

```bash
CONTAINER_NAME=$(echo ${PWD##*/}_nginx_1 | sed s'/[ -]/_/g')
```

Now I can manipulate containers from any bash script, as long as I can get my hands on the `$PWD`
and as long as I know the names they get in the `YAML` config file.

> Image credits: [Glen](https://www.flickr.com/photos/l2f1/)
