---
layout: post
title: "Npm package automation with packo"
date: 2015-01-17 8:00:00 AM
categories: nodejs
featured_image: /images/posts/automation.jpg
---

Developing NodeJS applications for the past year meant that I often found myself in front of monolythic applications, that clunked all-things-functionality in 3 or 4 so-called libraries.  
I'm not a huge fan of compiled languages, and after college I was really reluctant towards languages like Java, but one thing I really learned to  appreciate is the modularity that you can reach with it, especially with statements like `import package.*;`. 

Not to say that NodeJS doesn't have a similar system, it's just that we're using it wrong. 
We tend to stack functionality in one file, just because "we think" it belongs to that "module". In fact, the "module" is not a module at all, as in the majority of cases, I found JavaScript files that had a huge, 300+ lines of code function as `module.exports`, and that would be included in the application using `require('../somefolder/module);`.  
To me, this seems like a whole lot of coupling, just because you have to actually "crawl" through the application's directory structure like that.
Think what it would be like, to have to include that file in 3 more places, in other areas of the application. 
If further down the road you decide to refactor the module and place it in a `lib/` folder, things start to get complicated, as now you have to update all the different paths in the application using the following workflow: open file->update->save->reload application->check logs/ui for errors.  
Wouldn't it have been easier to simply type this: `require('my-super-module');`?  
The answer for me is YES, and for this exact purpose I built [packo](https://www.npmjs.com/package/packo), a npm package generator that takes away the work of having to manually create your package's boilerplate structure, and all of this while keeping best practices in mind. 

## Reasoning

While analysing the codebase that I currently work with at the office, I advocated the idea that we should rebuild/rething some of our modules as npm packages, and just install them through `npm install`.
But given the fact that I work for a company that heavily manipulates sensitive user data, we cannot afford to have all our code published on [npmjs.com](http://npmjs.com), so we hit a roadblock. Fortunately, [npm](https://github.com/npm/npm) is open source, so this means that we can configure it to work with an internally-managed repository.
With this out of the way, my thoughts went to all those tens of thousands of lines of code, and how they will fit nicely into their own modules, until I realised that for each of these modules I have to create the folder structure,
`touch` the JavaScript files, create the `package.json`, all of these BY HAND and without a solid understanding on what are the best practices in terms of directory structure. So I started to investigate the way popular npm packages are structured, and for this I took the top 6 modules on [npmjs.com](http://npmjs.com) -- [browserify](https://www.npmjs.com/packages/browserify), [express](https://www.npmjs.com/packages/express), [pm2](https://www.npmjs.com/packages/pm2), [grunt-cli](https://www.npmjs.com/packages/grunt-cli), [npm](https://www.npmjs.com/packages/npm), [karma](https://www.npmjs.com/packages/karma) -- and tried to spot patterns in their structure, and I found that the most commonly used directory structure is the following:

    module/
        bin/
        doc/
        examples/
        lib/
        test/
  
so I made [packo](https://www.npmjs.com/package/packo) create this exact directory structure.  
I also added preference files for various tools, but this was more of a personal touch, as I use [EditorConfig](http://editorconfig.org/) to have an uniform editor/IDE configuration accross platforms and machines, and I also like to validate my code using [JSHint](http://jshint.com/) as it is more relaxed, and less opinionated than other tools out there.

## Usage

In order to use packo you need to install it globally, so you will need to open a terminal window and type: `$ npm install -g packo`

After npm has finished installing it, you're ready to scaffold your first package, so navigate to your `Projects/` folder and run the following command:

    $ packo --dir=myModule --init
    Successfully created npm package: myModule
    This utility will walk you through creating a package.json file.
    It only covers the most common items, and tries to guess sane defaults.
    
    See `npm help json` for definitive documentation on these fields
    and exactly what they do.
    
    Use `npm install <pkg> --save` afterwards to install a package and
    save it as a dependency in the package.json file.
    
    Press ^C at any time to quit.
    name: (myModule)
    version: (1.0.0)
    description: A test module
    entry point: (index.js)
    test command: npm test
    git repository:
    keywords: test module
    author: Adrian Oprea
    license: (ISC)
    About to write to /Users/adrianoprea/Projects/myModule/package.json:

After this message, if you hit `RETURN`, `package.json` will be generated and you're all done, your module is available in the `myModule` directory.

More info about how to use packo is available on the project's npm page, so be sure to check it out: [https://www.npmjs.com/package/packo](https://www.npmjs.com/package/packo).

I really appreciate feedback, so if you have some suggestions, be sure to tweet me -- [@opreaadrian](https://twitter.com/opreaadrian), or get in touch via the [project's issues board](https://github.com/opreaadrian/packo/issues), on GitHub.
