function sampleFun(){
    console.log("SAMPLE PROMPTS");
}

function generateContext() {
    var selfName = '';
    var context = ''
    var messages = $(".focusable-list-item");
    messages = messages.slice(-5);
    messages.each(function () {
      var classes = $(this).attr('class');
      var type = "";
      if (classes.includes('message-in')) {
        type = 'incoming';
      }
      else if (classes.includes('message-out')) {
        type = 'outgoing';
      }
      var texts = $(this).find('.copyable-text');
      if (texts.length == 2) {
        console.log('reached')
        var metadata = $(texts[0]).data('prePlainText');
        var author = metadata.split(']')[1].trim();
        var time = metadata.split(']')[0].split('[')[1].trim()
        var message = $(texts[1]).text().trim();
        context += author + ' ' + message + '#';
        if (type === 'outgoing' && selfName === '') {
          selfName = author;
        }
      }
    });
    // console.log(text);
  
    currentMessage = $('div[data-tab="6"]').text();
  
    context += selfName + ' ' + currentMessage;
    context = context.trim();
  
    console.log('context : ', context);
    console.log('author : ', selfName);
    return context;
  }

$(document).ready(function(){
    var chat_name, newChatName;
    console.log("WhatsNxt?");
    tabKeyPress = false;

    var interval = setInterval(function(){
        //console.log("Loading...")
        if(tabKeyPress == false){
            if($('[data-tab="10"]').length > 0){
                chat_name = document.getElementsByClassName('_21nHd')[0].childNodes[0].childNodes[0].data;
                //console.log("CHAT NAME IN INNER LOOP: "+chat_name);

               // console.log($('[data-tab="10"]'));
                //console.log("Event Listerner");
                $('[data-tab="10"]').on('keydown', function(e){
                    if(e.keyCode == 9){
                        e.stopPropagation();
                        e.preventDefault();
                        //tabKeyPress = true;
                        //console.log(tabKeyPress);
                        $('[data-tab="10"]').blur();
                        console.log("TAB KEY PRESSED");
                        //Generate Prompts
                        //sampleFun();
                        var context = generateContext();
                        console.log(context);

                    }
                });
                
                tabKeyPress = true;
                
                //console.log("Aha Tab key pressed is true now")
                //clearInterval(interval);
            }
        }
        else{
            newChatName = document.getElementsByClassName('_21nHd')[0].childNodes[0].childNodes[0].data;
            //console.log("NEW CHAT NAME: "+newChatName);
            //console.log("CHAT NAME: "+chat_name);
            if(newChatName != chat_name){
                //console.log(chat_name);
                //console.log(newChatName);
                console.log("UNBINDING NOW");
                $('[data-tab="10"]').off('keydown');
                tabKeyPress = false;
            }
        }
        
        //if chat change detected tabKeyPress = false again
        //Also look into keyup 
        // Problem is that it will call prompts multiple times which we dont want
        
        
    }, 1000);
});