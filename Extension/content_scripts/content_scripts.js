$(document).ready(function(){
    console.log("WhatsNxt?");
    tabKeyPress = false;

    var interval = setInterval(function(){
        console.log("Loading...")
        if(tabKeyPress == false){
            if($('[data-tab="10"]').length > 0){
                //console.log($('[data-tab="10"]'));
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

                    }
                });

                tabKeyPress = true;
                console.log("Aha Tab key pressed is true now")
                //clearInterval(interval);
            }
        }
    }, 1000);
});