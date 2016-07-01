#Challenge Framework

Basic JavaScript programming challenge validation, for educational purposes.

To test it out, this is hosted on Github pages [here](https://paloobi.github.io/challenge-framework).

##Key Features

* A whitelist of specific functionality. Example: If a for loop is on the whitelist, then code will not pass unless it contains a for loop
* A blacklist of specific functionality. Example: If while loops were in the blacklist, then the code will error if a while loop is included.
* Rough structure of program. Example: If an if statement inside a for loop is required, then code that contains just one or the other, or both but not in the proper structure, will not pass.

##Why Esprima?

I chose to work with Esprima for the following reasons:

* **Performance** ­ using this [speed test](http://marijnhaverbeke.nl/acorn/test/bench.html), I determined that Esprima is faster on both Firefox and Chrome without location data.
* **Number of Stars, Forks, Commits** ­ Esprima has far more of all of these on Github, and so is likely to be more well maintained moving forward.
* **Creators & Contributors** ­ Esprima was created and is maintained by Ariya Hidayat, inventor of PhantomJS, who I worked with at Shape Security, and who invented PhantomJS. In addition, a number of the contributors are former coworkers of mine (Bei Zhang, Michael Ficarra, etc). This means that if I continue working with the tool in the future, it is likely I could ask them questions if any arise, and also that I could begin contributing meaningfully to the project down the line.
* **Documentation** ­ The guide/tutorial documentation is comparable to other projects, but the extensive amount of Examples and Demos should be particularly useful to help me get started.
* **ES6 Support** ­ since I intend to use this project to potentially help teach ES6 features (such as Promises) I required a library that has ES6 support.
