Chat.Views.ChatsIndex = Backbone.View.extend({

  template: JST['chats/index'],

  events: {
    "keyup .chatInput": "chat",
    "keyup #key": "submitBurn",
    "click .burn": "burn",
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
      sendData = that.alias+": "+chatData;
      sendData = cryptico.encrypt(sendData, that.theirPublicKeyString);
      
      window.Chat.Store.conn.send([sendData, that.yourPublicKeyString]);

      var newLine = $('<li>'+that.alias+": "+chatData+'</li>')
      $('.chatList').append(newLine);
      $('.chatWindow').scrollTop($('.chatWindow')[0].scrollHeight);
      $('.chatInput').val("");
    }
  },

  submitBurn: function(event){
    var that = this;
    if (event.keyCode == 13){
      that.burnrId = $('#burnrId').val();
      
      if (that.burnrId[0] == "/"){
        that.burnrId = that.burnrId.slice(1);
      };
      
      that.alias = $('#name').val();
      that.myPeer = new Peer({key: 'n2zagxxl5mnp14i'});
      
      if ($('#key').val() == "") {
        that.passPhrase = that.alias
      } else {
        that.passPhrase = $('#key').val();
      };

      that.yourRSAkey = cryptico.generateRSAKey(that.passPhrase, 1024)
      that.yourPublicKeyString = cryptico.publicKeyString(that.yourRSAkey);

      var conn = that.myPeer.connect(that.burnrId, {metadata: [that.alias, that.yourPublicKeyString]});

      that.myPeer.on('open', function(){
        console.log('thiers')
        $('.chatList').append('<li>please wait</li>')
        window.Chat.Store.conn = conn 
        window.Chat.Store.conn.on('data', function(data){

          that.theirPublicKeyString = data[1];
          data = cryptico.decrypt(data[0].cipher, that.yourRSAkey);
          
          $('.chatList').append(data.plaintext);
        });
      });

      that.myPeer.on('error', function(){
       console.log('mine')
        that.myPeer = new Peer(that.burnrId, {key: 'n2zagxxl5mnp14i'})
        $('.chatList').append('<li>burnr initialized</li>')

        that.myPeer.on('connection', function(newConn){
          that.theirPublicKeyString = newConn.metadata[1];
          console.log(that.theirPublicKeyString);

          $('.chatList').append('<li>'+(newConn.metadata[0]) + " joined your burnr</li>");
          
          window.Chat.Store.conn = newConn;

          window.Chat.Store.conn.on('data', function(data){

            that.theirPublicKeyString = data[1];
            data = cryptico.decrypt(data[0].cipher, that.yourRSAkey);

            var newLine = $('<li>'+data.plaintext+'</li>')
            $('.chatList').append(newLine);
          })
        })
      });
      $('.chatHead').empty()
      $('.chatHead').append('/'+that.burnrId)
      $('.chatHead').append("<button class='burn'>burn</button>")
      
      that.myPeer.on('close', function(){
        that.burn();
      })
    }
  },

  burn: function(){
    window.Chat.Store.conn.close();
    this.myPeer.disconnect();
    this.myPeer.destroy();
    
    $('.chatList').empty();
    $('.chatHead').empty()
    $('.chatHead').append('<input name="burnr" placeholder="burnrId" id="burnrId">')
    $('.chatHead').append(' <input name="name" placeholder="alias" id="name">')
    $('.chatHead').append(' <input name="key" placeholder="encryption key" id="key">')
  }
});
