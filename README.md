= Splicer =

Splicer is an implementation of the JavaScript `Array` interface in terms of only the `splice` function.

Normally when composing an object that has Array-like properties and methods, one has a fairly large facade they have to reimplement and compose.  Splicer is a shortcut: mixin Splicer, define your own splice method, and the remaining Array methods will be free.

In more conventional OO languages, we might see something an AbstractBaseArray which defined a number of concrete methods but leaves a virtual `splice` free; so it is here.

= Harmony =

At present arguments munging is done in the classical style: with hope, Harmony will bring better optimizable argumentation conventions.
