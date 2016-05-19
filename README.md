# express-auth0-socketio

This is a bare bones app that you can use to create a new express app.

It has:
 - socket.io
 - express
 - auth0
 

![page flow](http://g.gravizo.com/g?
  digraph G {
    homepage [shape=box];
    server [shape=circle]
    private [shape=box]
    homepage -> private [label="log on"]
    private -> server [style="dotted", label="socket pings"]
    private -> homepage [label="log off"]
    homepage -> private [label="if logged on"]
  }
)
 
