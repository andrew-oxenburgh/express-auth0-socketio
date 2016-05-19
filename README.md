# express-auth0-socketio

This is a bare bones app that you can use to create a new express app.

It has:
 - socket.io
 - express
 - auth0
 

![page flow](http://g.gravizo.com/g?
  digraph G {
    homepage [shape=box, label="/"];
    server [shape=circle]
    private [shape=box]
    homepage -> private [label="log on"]
    private -> server [style="dotted", label="socket pings"]
    private -> homepage [label="log off"]
    homepage -> private [label="if logged on"]
  }
)
 
![seq](http://g.gravizo.com/g?
@startuml;
autonumber;
actor User;
participant "Browser" as B;
participant "Server" as S;
participant "Auth0" as A;
;
User -> B: "Open page on site";
User -> B: Logon;
activate User;
activate B;
B <-> A: "request logon and token";
B -> B: "persist token";
B -> User: "go to private page";
B -> S: "msg:connection";
activate S;
S -> B: "msg:auth-req";
B -> S: "msg:auth-resp:token";
User -> B:"Log off";
B -> S: "Log off";
S -> A: "Log off";
B -> User: "Logged off";
deactivate User;
deactivate B;
deactivate S;
@enduml
)
