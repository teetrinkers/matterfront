var ipc = require('ipc');

var notifyHost = function() {
  var mentionCount = getTotalMentionCount();
  var unreadCount = $('.unread-title').length;

  ipc.sendToHost('mention-count', mentionCount);
  ipc.sendToHost('unread-count', unreadCount);
};

var getTotalMentionCount = function(){
  var mentionCount = 0;
  $('.unread-title.has-badge .badge').each(function() {
    var badgeText = $(this).text();
    mentionCount += parseInt(badgeText, 10);
  });
  return mentionCount;
};

document.addEventListener("DOMContentLoaded", function() {
  setInterval(function() {
    notifyHost();
  }, 1000);
});
