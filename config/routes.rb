Chat::Application.routes.draw do
  get '/chat', to: 'chats#chat'

  root to: 'chats#chat'
end