---
layout: post
title: "Vim tip: Working with network-mapped folders"
pub_date: 2015-06-19 1:00:00 PM
last_modified: 2015-06-19 1:00:00 PM
categories: productivity
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: workflow, vim, productivity, sshfs, rsync
featured_image: /images/posts/working_with_network_mapped_folders_in_vim/paper_vim.jpg
---

Working with mapped network drives in VIM? Me too! I always wondered why go through all this pain?  
Because of this, I resorted to Sublime Text for this type of work, as it is very fast in most situations,
but I still dreaded the fact that I could not use Vim, as there have been some situations where I 
would have been much more productive and would have gotten to the bottom of the task way quicker if I could have used Vim instead of ST3.  
Don't get me wrong, I find Sublime Text awesome and really fast, and yes, I am aware of its Vintage Mode, but that just 
doesn't cut it for me. I can fake Vim in Sublime, but as far as I know, ST3's Vintage  doesn't allow you to create 
custom commands/mappings, the way you do in Vim, for example.

Back on track with the Vim part, I have been living with this pain for quite some time, 
until 3 days ago when I realised that I wasn't able to see the trees because of the forest.
I thought about all possible solutions, `scp` being the most reliable of them all.  
To clarify, I had no problem creating a bash function that would use `scp` to upload everything to the remote server, which I actually did it.
The only problem was that it would re-upload all the files and I didn't want that. 
Knowing this, I would rely on a trick I presented in 
[Short tip: viewing and resolving svn conflicts in the terminal](http://codesi.nz/workflow/2015/06/15/short-tip-viewing-and-resolving-svn-conflicts-in-the-terminal.html), 
namely, I would take the filenames from `svn status`, and upload them one by one &mdash; talk about thinking like a programmer. The result is in the snippet below.

```bash
function scpsync() {
    local changed_files=$(svn status | awk '{print $2}')
    echo "Syncing $changed_files\n"
    for file in $changed_files; do
        scp $file goprea@$1:/$2/$file
    done
    echo "Sync done\n"
}
```

Now, everything looked fine but I started hating it when I read the code out loud.
I had a function that would upload all my SVN modified files…every damn time! 
This meant that if I would commit once a day(SVN users know what I'm talking about), 
I would upload every modified file, every time, even if I only changed the code ONCE, for some files.  
This is the part where the over-engineer in me felt like a million bucks.
I have created something that repeats a task even when it is not needed. Although it was ugly as hell, 
it was useful to me so I had to brag about it, but there was still a little voice in the back of my head, 
telling me that I once used a tool that would sync with the server through `ssh`, in a flawless manner.  
That's why I went to my co-worker [Alex Pica](https://github.com/pennycoders), as he has the eye of a critic and will argue with me over anything. 
After letting me brag about my absolutely marvellous function, he went something along the lines of: "Well, why don't you use [rsync](https://en.wikipedia.org/wiki/Rsync)?".  
At that moment I had the epiphany! That was the tool that I used in the past and does all the neat stuff I told you before, and more.  
I'm writing this article to both share the solution with the Vim users going through the same pain I went to, and to thank Alex for being a walking encyclopedia.  
The solution is outlined below, and it can be used directly from within Vim by issuing the following command in the Vim command line &mdash; `:!syncremote . user@ip:/remote/path`

```bash
syncremote () {
  rsync -WavP --human-readable --progress $1 $2
}
```

Cheers, and happy hacking!

> Image credits: Me
