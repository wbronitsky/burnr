Chat.Utilities = {
  safeHTML: function(input){
    input = input.replace(/>/g, ' closebracket ');
    input = input.replace(/</g, ' openbracket ');
    return input
  }
}