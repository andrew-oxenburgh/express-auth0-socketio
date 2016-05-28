var domManipulation = function() {
   $('.user-displayName').html(user_displayName);
   $('.user-nickname').html(user_nickname);
   $('.user-provider').html(user_provider);
   $('.user-picture').attr('src', user_picture);
   $('.jwt-token-timeout').html(jwtTimeout);
   $('.jwt-auth-interval').html(authIntervalAsString + ' (' +
      Math.floor(authInterval / 1000) + 's)');
};

var statusConnect = function() {
   connected = true;
   $('.status').addClass('connected').removeClass('disconnected');
   userMessage('* connected');
};

var statusDisconnect = function() {
   connected = false;
   $('.status').addClass('disconnected').removeClass('connected');
   userMessage('* disconnected');
};

