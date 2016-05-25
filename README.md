# express-auth0-socketio

This is a bare bones app that you can use to create a new express app.
It has:

 1. express
 1. auth0
 1. socket.io

# Instructions:

You **will** need npm and nodejs. If you don't, load them with [npm getting started](https://www.npmjs.com/#getting-started)

You will need an [auth0](https://auth0.com/) account, and you will need to make the credentials available to the app.

From that you will need the following:

 * AUTH0_CLIENT_ID
 * AUTH0_CLIENT_SECRET
 * AUTH0_DOMAIN
 * AUTH0_CALLBACK_URL
 
 * JWT_TOKEN_SECRET - pretty_damn_well_anything_as_long_as_it_cant_be_guessed
 * JWT_TOKEN_TIMEOUT=7days
 * JWT_AUTH_INTERVAL=60*1000


When you have these do the following

```
 git clone https://github.com/andrew-oxenburgh/express-auth0-socketio.git
 cd express-auth0-socketio
 npm install

 ```
_Manual step:_  save ```.env.template``` as ```.env``` and add relevant keys from the list above.
 
 ```
 npm start
 ```

Open [http://localhost:5010](http://localhost:5010)

# Diagrams

### Page Flow

![](http://g.gravizo.com/g?
  digraph G {
    homepage [shape=box, label="/"];
    server [shape=circle]
    private [shape=box]
    homepage -> private [label="log on"]
    private -> server [style="dotted", label="socket pings"]
    private -> homepage [label="log off"]
    homepage -> private [label="if logged on"]
  })
  
### Logging on with Auth0

![](http://g.gravizo.com/g?
@startuml;
autonumber;
participant "Browser" as B;
participant "Auth0" as A;
participant "Identity Provider" as P;
participant "Server" as S;
;
B -> A: "Initiate Logon";
A -> P: OAuth;
A -> B: "redirect, with a token";
B -> A: "validate token and get profile";
B -> S: "send JWT in Auth header";
S -> S: "validate token and extract profile"
;
;
@enduml
)

 
### Interactions between parties

![](http://g.gravizo.com/g?
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
B -> S: "some manual messages";
B -> S: "periodic auth-check";
User -> B:"Log off";
B -> S: "Log off";
S -> A: "Log off";
B -> User: "Logged off";
deactivate User;
deactivate B;
deactivate S;
@enduml
)

### On jwt timeout

![](http://g.gravizo.com/g?
@startuml;
autonumber;
actor User;
participant "Browser" as B;
participant "Server" as S;
;
activate User;
activate B;
activate S;
User -> B: "Open and logged on";
B -> S: "periodic auth-check";
B -> S: "periodic auth-check";
B -> S: "periodic auth-check";
B -> S: "periodic auth-check";
B -> S: "periodic auth-check";
B -> B: "token invalid or timed out";
B -> B: "log off";
B -> User: "redirect to /";
deactivate User;
deactivate B;
deactivate S;
@enduml
)


