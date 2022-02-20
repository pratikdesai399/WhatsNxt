$(document).ready(function(){
    console.log("WhatsNxt?");

    tabKeyPress = false;

    var interval = setInterval(function(){
        if(tabKeyPress == false){
            //User has typed some words
            console.log(tabKeyPress);
            if($('[data-tab="10"]').length > 0){
                console.log($('[data-tab="10"]'));
                console.log("Event Listerner");
                $('[data-tab="10"]').on('keydown', function(e){
                    if(e.keyCode == 9){
                        e.stopPropagation();
                        e.preventDefault();
                        console.log("TAB KEY PRESSED");
                        

                    }
                });
                tabKeyPress = true;
                console.log("True Down");
                clearInterval(interval);
            }
        }
    }, 1000);
});