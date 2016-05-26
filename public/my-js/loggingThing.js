'use strict';

function userMessage(msg, options) {
   var defaults = {
      messageLevel: 1,
      userMessageBucketTime: 1,
      userMessageDisplayTime: 15000,
      userMessageLevel: 5,
      userMessagesOn: true,
      toConsole: true
   };

   options = _.defaults(options || {}, defaults);

   if (!options.userMessagesOn) {
      return;
   }
   if (options.messageLevel > options.userMessageLevel) {
      return;
   }

   var currentLogBucket = 'log-bucket-' + Math.floor(new Date().getTime() / options.userMessageBucketTime);

   var $log = $('#log');
   var $logBucket = $log.find('div.' + currentLogBucket);
   if ($logBucket.length < 1) {
      var logBucketDiv = sprintf('<div class="%s"></div>', currentLogBucket);
      $logBucket = $(logBucketDiv);
      $logBucket.appendTo($log);
      $logBucket.show();
   }
   if (options.toConsole) {
      console.log(msg);
   }
   var message = sprintf('<p>%s</p>', msg);

   $logBucket.append($(message));

   $log.show();

   setTimeout(function() {
      $logBucket.hide({
         easing: 'linear',
         effect: 'blind',
         duration: 1000,
         complete: function() {
            $logBucket.detach();
         }
      });
   }, options.userMessageDisplayTime);

}

