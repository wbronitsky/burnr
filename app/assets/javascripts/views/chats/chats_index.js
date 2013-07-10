Chat.Views.ChatsIndex = Backbone.View.extend({

  template: JST['chats/index'],

  events: {
    "keyup .chatInput": "chat"
  },

  initialize: function(){
    var that = this;
    that.myId = $('#params').data('identifier')
    that.myPeer = new Peer(that.myId, {key: '8x1tv0bso1jrlik9'})
    that.foreignId = $('#params').data('foreign');
    
    if (that.foreignId){
      window.Chat.Store.conn = that.myPeer.connect(that.foreignId);
      window.Chat.Store.conn.on('data', function(data){
        $('.chatWindow').append(data);
      })
    } else {
      that.myPeer.on('connection', function(conn){
        window.Chat.Store.conn = conn;
        window.Chat.Store.conn.on('data', function(data){
          var newLine = $('<li>'+that.foreignId+": "+data+'</li>')
          $('.chatList').append(newLine);
        })
      })
    };
  },

  render: function(){
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  },

  chat: function(event){
    var that = this;

    if (event.keyCode == 13){
      var chatData = $(event.target).val();
      $(event.Target).empty();
      window.Chat.Store.conn.send(chatData);
      var newLine = $('<li>'+that.myId+": "+chatData+'</li>')
      $('.chatList').append(newLine);
    }
  }
});
