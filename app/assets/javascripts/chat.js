window.Chat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Store: {},
  initialize: function($chatWindow) {
    var that = this;
    new Chat.Routers.Chats($chatWindow);
    Backbone.history.start();
  }
};
