Chat.Routers.Chats = Backbone.Router.extend({
  initialize: function($chatWindow){
    this.$chatWindow = $chatWindow;
  },

  routes: {
    "": "chat"
  },

  chat: function(){
    var newChat = new Chat.Views.ChatsIndex();
    this.$chatWindow.html(newChat.render().$el)
  }
});
