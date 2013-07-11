Chat::Application.routes.draw do
  get '/portal', to: 'chats#new'
  get '/chat', to: 'chats#chat'

  root to: 'chats#chat'
end