# Quebec : 
## A Governmental DoD-ish project viewer.

It's a viewer because this implementation has no edit!

Some notes about this build, design decisions, etc.

## CDN/FileServer Only
This implementation uses plain HTML/Javascript tags, 
no builder, deploy process, anything else. 
Viewing the app only requires an HTTP File Server.
NPM HTTP-Server is a fine choice :
```shell
$ npm i http-server
$ http-server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080

```
Browse to http://localhost:8080/intro.html and enjoy 
the app!

# CSS
"Global" css is used here due to the requirement of Vue.js
as used in component-syntax only.  This makes all the more
sense as a CDN/FileServer only deployment would require the
use of only `<link ...stylesheet ` anyway.

# What is a WBS ?!
Government contracted projects that will be funded by the DOD
are required to organize the estimation of their project into
a DOD-provided "Work Breakdown Structure" - WBS.   
Quebec's fantasy-grade WBS has 3 levels : Project, Address, and Food.
It makes no sense... and that's ok.  The point is to observe
that the WBS structure self-identifies a structured tree
and no other data-structure is needed in order to manipulate and
calculate data "across" the tree.
