var connectWithSocket = function() {
   // unencrypted token
   socket = io.connect('http://localhost:5011');
   socket.on('connect', function() {
      userMessage('connect');
      socket.on('authenticated', function() {
         userMessage('<< authenticated');
         statusConnect();
         //do other things
      }).emit('authenticate', {token: jwt_token}); //send the jwt
   });

   socket.on('unauthenticated', function() {
      userMessage('<< unauthenticated');
      //do other things
   });

   socket.on('disconnect', function() {
      userMessage('<< disconnect');
      statusDisconnect();
   });

   socket.on('reconnect', function() {
      userMessage('<< reconnect');
      statusConnect();
   });

   socket.on('unauthorized', function() {
      userMessage('<< unauthorized');
      statusDisconnect();
      //do other things
   });

   socket.on('authorized', function() {
      userMessage('<< authorized');
      statusConnect();
      //do other things
   });

   socket.on('redirect', function(data) {
      userMessage('<< redirect ' + data.url);
      document.location.href = data.url;
   });

   socket.on('room', function(data) {
      userMessage('>> joined room -- ' +  data.roomName);
      userRoom = data.roomName;
      $('.room-name').html(userRoom);
   });

   socket.on('broadcast-cyrano:clients', function(data) {
      userMessage('<< broadcast-cyrano:clients - ' + JSON.stringify(data));
      $('.broadcast').html(data.message);
   });
   socket.on('something:else', function() {
      userMessage('<< "something:else" message');
      $('.msg-rcvd').addClass('ping');

      setTimeout(function() {
         $('.msg-sent').removeClass('ping');
         $('.msg-rcvd').removeClass('ping');
      }, 2000);
      //do other things
   });

   setInterval(function() {
      if (connected) {
         userMessage('>> sending auth-check');
         socket.emit('auth-check', {token: jwt_token});
      }
   }, authInterval);

};
