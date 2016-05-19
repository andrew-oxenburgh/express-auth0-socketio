# express-auth0-socketio

This is a bare bones app that you can use to create a new express app.
It has:

 1. socket.io
 1. express
 1. auth0

# Instructions:

You **will** need npm and nodejs. If you don't, load them with [npm getting started](https://www.npmjs.com/#getting-started)

You will need an [auth0](https://auth0.com/) account, and you will need to make the credentials available to the app.

From that you will need the following:

 * AUTH0_CLIENT_ID
 1. AUTH0_CLIENT_SECRET
 1. AUTH0_DOMAIN
 1. AUTH0_CALLBACK_URL

When you have these do the following

```
 git clone https://github.com/andrew-oxenburgh/express-auth0-socketio.git
 cd express-auth0-socketio
 npm install

 ```
_Manual step:_  save .env.template as .env and add relevant keys from the list above.
 
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
User -> B:"Log off";
B -> S: "Log off";
S -> A: "Log off";
B -> User: "Logged off";
deactivate User;
deactivate B;
deactivate S;
@enduml
)
