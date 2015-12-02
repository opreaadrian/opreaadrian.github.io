---
layout: post
title: "Short tip: viewing and resolving svn conflicts in the terminal"
pub_date: 2015-06-15 12:00:00 PM
last_modified: 2015-06-15 12:00:00 PM
categories: workflow
author_name: "Adrian Oprea"
author_twitter: "@opreaadrian"
keywords: svn, workflow, automation, subversion, sublimetext, st3, terminal, iterm2
featured_image: /images/posts/short_tip_svn_conflicts/owl.jpg
---

Working with SVN for the past couple of years has taught me a lot in terms of how I don't want a version control system to be. Unfortunately, many of the customers and companies I've worked with/for have had their entire codebase on SVN, and very often I've found myself in the situation where, after a simple merge, I'd get tons of conflicts, either related to whitespace, or a specific piece of code that changes between releases (app version, for example).

Now, to clarify: I'm not an IDE guy, and even though I've used many IDEs and I still use them today, if I can do my job in Vim, Sublime Text or even Chrome Dev Tools, then I'm good with that. I'm also a big fan of the command line, so when it comes to SVN conflicts, my workflow is as follows:

If I have conflicts, I first list only the conflicted files, so I can have a clear view of the size of the problem. For this, I rely on the fact that SVN adds the state that the file is in, as the first letter on each row, when issuing the `svn status` command.

`> svn status | grep "^C"`

The above command pipes `svn status` through `grep` and applies a RegExp which basically says: "Give me all the rows in `svn status`'s output that begin with a capital C". The output will look the same as below.

```bash
adrian at mothership in ~/Documents/projects/svn-project
> svn st | grep "^C"
C       modules/user/index.js
C       modules/user/meta_inf.json
C       modules/database/index.js
C       modules/database/drivers/cassandra.js
C       modules/database/drivers/redis.js
C       package.json
```

I then open all conflicted files in an editor, in this case Sublime Text 3 with the following command:

`> subl $(svn status | grep "^C" | awk '{print $2}'`

I'll break the command into subcommands so I can explain what each subcommand does. I'll asume we already know the grepping part, so I'll explain only the `awk` part.

`> svn status | grep "^C" | awk '{print $2'}` means: "Take the output of `svn status` and pipe it through [awk's](https://en.wikipedia.org/wiki/AWK) `print` statement". 

Given the fact that we have 2 columns in our initial `svn status` output &mdash; the Cs column and the filename column &mdash; we can rely on awk to print the filename for us for each row in the output it receives. If you would issue the subcommand above in your terminal you'd get the list of conflicted files, without the leading capital "C".

```bash
modules/user/index.js
modules/user/meta_inf.json
modules/database/index.js
modules/database/drivers/cassandra.js
modules/database/drivers/redis.js
package.json
```

The reason why the whole command is wrapped in `$()` is because we need to interpret that command and pass its output to our `subl` executable, which is actually a command line shortcut to open Sublime Text. The end result is that we get all the conflicted files open in tabs, in Sublime Text. We can now proceed to the conflict resolution part, which I will not detail here.

After resolving the conflicts in your editor and saving the edits you made, you will notice that if you issue the `svn st | grep "^C"` command, you'll still see the files as being in a conflicted state. This is because SVN creates separate files for each side of the conflict and refers to them when it shows a file as conflicted, and they look like the output below:

```bash
C       modules/user/index.js
?       modules/user/index.js.merge-left.r10231
?       modules/user/index.js.merge-right.r10255
?       modules/user/index.js.working
C       modules/user/meta_inf.json
?       modules/user/meta_inf.json.merge-left.r10231
?       modules/user/meta_inf.json.merge-right.r10255
?       modules/user/meta_inf.json.working
[...]
```

The next step would be to manually remove those files, and we're going to rely on awk again, for this task. Remember how we used `print` to pipe only the filenames to Sublime Text? That's exactly what we are going to do now, but we'll add `.*` at the end of each file, as we only want to remove the `.merge* ` and the `.working` files, and not our original source code, and we will pipe everything to `rm`.

`> rm -Rf $(svn st | grep "^C" | awk '{print $2".*"}')`

And you're done, you can now commit your changes!

> Image credits: [Owl](https://flic.kr/p/6AMV1C) by [DIVA007](https://www.flickr.com/photos/23975018@N04/)
