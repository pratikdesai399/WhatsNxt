function sampleFun(){
    console.log("SAMPLE PROMPTS");
}

function getContextforAutocomplete(){
    var myName = "";
    var context = "";
    var msgs = $(".focasable-list-item");
    currentMessage = $('div[data-tab="10"]').text();
    //console.log(currentMessage);
    return currentMessage;
}

function getAutocompleteResults(context){
    console.log("AUTOCOMPLETE RESULTS");
    $.ajax({
        url: 'http://localhost:5000/autocomplete',
        crossDomain: true,
        dataType: 'json',
        data: { context: context },
        success: (res) => {
          console.log(res.AUTOCOMPLETE);
        }
      });
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
                        var context = getContextforAutocomplete();
                        //console.log(context);
                        getAutocompleteResults(context);

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