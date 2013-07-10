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
      window.Chat.Store.conn = that.myPeer.connect(that.foreignId, {metadata: that.myId});
      window.Chat.Store.conn.on('data', function(data){
        $('.chatList').append(data);
      })
    } else {
      that.myPeer.on('connection', function(conn){
        $('.chatList').append(escape(conn.metadata) + " joined your burnr");
        window.Chat.Store.conn = conn;
        window.Chat.Store.conn.on('data', function(data){
          var newLine = $('<li>'+escape(data)+'</li>')
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
      $('.chatInput').val("");
      // window.Chat.Store.conn.send(that.myId+": "+chatData);
      var newLine = $('<li>'+escape(that.myId)+": "+escape(chatData)+'</li>')
      $('.chatList').append(newLine);
      $('.chatWindow').scrollTop($('.chatWindow')[0].scrollHeight);
    }
  }
});
