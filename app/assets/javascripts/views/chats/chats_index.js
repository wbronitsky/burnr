Chat.Views.ChatsIndex = Backbone.View.extend({

  template: JST['chats/index'],

  events: {
    "keyup .chatInput": "chat",
    "keyup #name": "submitBurn"
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
      window.Chat.Store.conn.send(that.alias+": "+chatData);
      var newLine = $('<li>'+that.alias+": "+chatData+'</li>')
      $('.chatList').append(newLine);
      $('.chatWindow').scrollTop($('.chatWindow')[0].scrollHeight);
    }
  },

  submitBurn: function(event){
    var that = this;
    if (event.keyCode == 13){
      that.burnrId = $('#burnrId').val();
      that.alias = $('#name').val();
      that.myPeer = new Peer({key: 'n2zagxxl5mnp14i'});

      var conn = that.myPeer.connect(that.burnrId, {metadata: that.alias});
      console.log(conn);
      console.log(conn.open);
      if (conn.open){
        console.log('yours')
        window.Chat.Store.conn = conn 
        window.Chat.Store.conn.on('data', function(data){
          $('.chatList').append(data);
        });
      } else {
        console.log('mine')
        that.myPeer = new Peer(that.burnrId, {key: 'n2zagxxl5mnp14i'})
        that.myPeer.on('connection', function(newConn){
          $('.chatList').append('<li>'+(newConn.metadata) + " joined your burnr</li>");
          window.Chat.Store.conn = newConn;
          window.Chat.Store.conn.on('data', function(data){
            var newLine = $('<li>'+(data)+'</li>')
            $('.chatList').append(newLine);
          })
        })
      }
      $('.chatHead').empty()
      $('.chatHead').append('/'+that.burnrId)
    }
  }
});
