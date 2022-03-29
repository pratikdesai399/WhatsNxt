function sampleFun() {
  console.log("SAMPLE PROMPTS");
}

function getContextforAutocomplete() {
  var myName = "";
  var context = "";

  var msgs = $(".focusable-list-item");
  msgs = msgs.slice(-5);
  //console.log("MESSAGES: "+ msgs);

  msgs.each(function () {
    var classes = $(this).attr("class");
    var type = "";

    if (classes.includes("message-in")) {
      type = "msg_incoming";
    } else if (classes.includes("message-out")) {
      type = "msg_outgoing";
    }

    var lines = $(this).find(".copyable-text");
    //console.log("LINES: "+ lines);

    //If convesartion length is more than 2 than adding # at the end of each statement so that the model can easily predict till next #
    if (lines.length == 2) {
      var metadata = $(lines[0]).data("prePlainText");
      var msgAuthor = metadata.split("]")[1].trim();
      var time = metadata.split("]")[0].split("[")[1].trim();
      var message = $(lines[1]).text().trim();
      context += msgAuthor + " " + message + "#";

      if (type === "msg_outgoing" && myName === "") {
        myName = msgAuthor;
      }
    }
  });

  currentMessage = $('div[data-tab="10"]').text();

  context += myName + " " + currentMessage;
  context = context.trim();
  return context;
}

function getAutocompleteResults(context) {
  // console.log("AUTOCOMPLETE RESULTS");
  // var wordcomplete = [];
  // var autocomplete = [];

  $.ajax({
    url: "http://localhost:5000/wordcomplete",
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5000/",
    },
    dataType: "json",
    data: { context: context },
    success: (res) => {
      // displayAutocompleteResults(res.WORDCOMPLETE, context);
      wordcomplete = res.WORDCOMPLETE;

      $.ajax({
        url: "http://localhost:5000/autocomplete",
        crossDomain: true,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5000/",
        },
        dataType: "json",
        data: { context: context },
        success: (res) => {
          autocomplete = res.AUTOCOMPLETE;
          console.log(autocomplete);
          console.log(wordcomplete);
          displayAutocompleteResults(wordcomplete, autocomplete, context);
          // displayAutocompleteResults(res.AUTOCOMPLETE, context);
        },
      });
    },
  });
}

function displayAutocompleteResults(words, prompts, context) {
  //console.log("AUTOCOMPLETE: "+prompts);
  //console.log("Context is: "+ context);
  console.log("words : ", words);
  $("#pprompts").remove();
  $('div[data-tab="8"]').append(
    "<div id='pprompts' style='padding: 20px;margin: 20px; border-radius: 15px; background:#F0FFFF'></div>"
  );
  $("#pprompts").append(
    '<div style="flex-direction: row;display: flex;"><p style="font-size: 12px; padding: 15px; font-weight: 900; text-transform: uppercase">WhatsNxt: Autocomplete Responses</p></div>'
  );

  // Sentence
  var currSelectedPrompt = 0;
  var propmtLen = prompts.length;
  prompts.forEach((p, i) => {
    p = p.generated_text.replace(context, "").trim();

    //First whole message to display
    //console.log("P "+p);
    p = p.split("#")[0];
    $("#pprompts").append(
      `<p class='prompt' id="${i}" style='border-radius: 5px; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${p}</p>`
    );
  });

  // Words

  words.forEach((w, i) => {
    $("#pprompts").append(
      `<p class='prompt' id="${
        propmtLen + i
      }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
        w[0]
      }</p>`
    );
  });

  $(".prompt").on("mouseover", function () {
    $(".prompt").css("background", "none");
    $(this).css("background", "#FFF");
    try {
      currSelectedPrompt = parseInt($(this)[0].id);
    } catch (error) {
      currSelectedPrompt = 0;
    }
  });

  const mouseoverEvent = new Event("mouseover");
  document.querySelector(".prompt").dispatchEvent(mouseoverEvent);
  var totalPrompts = prompts.length;

  $(".prompt").on("click", function () {
    document
      .getElementsByClassName("_2lMWa")[0]
      .removeEventListener("keydown", handlePrompts);

    var currentMessage = $('div[data-tab="10"]').text();
    $('div[data-tab="10"]').text("");
    currentMessage = currentMessage.trim() + " " + $(this).text();
    $('div[data-tab="10"]').focus();
    document.execCommand("insertText", false, currentMessage);
    $("#pprompts").remove();
    $('div[data-tab="10"]').siblings().hide();
  });

  // $(".prompt").on("Enter", function () {
  //   console.log("Enter pressed");
  // });

  function handlePrompts(e) {
    // console.log($("#pprompts").length);
    // console.log(e.keyCode);
    if ($("#pprompts").length) {
      // e.preventDefault();
      // e.stopPropagation();
      // console.log(e);

      // console.log("inside", currSelectedPrompt);
      //Up arrow
      if (e.keyCode === 38) {
        e.preventDefault();
        e.stopPropagation();
        currSelectedPrompt -= 1;
        if (currSelectedPrompt < 0) {
          currSelectedPrompt = totalPrompts - 1;
        }
        // console.log("Current Prompt key(up)", currSelectedPrompt);
        document
          .querySelectorAll(".prompt")
          [currSelectedPrompt].dispatchEvent(mouseoverEvent);
      }
      //Down arrow
      else if (e.keyCode === 40) {
        e.preventDefault();
        e.stopPropagation();
        currSelectedPrompt += 1;
        if (currSelectedPrompt >= totalPrompts) {
          currSelectedPrompt = 0;
        }
        // console.log("Current Prompt key(down)", currSelectedPrompt);
        document
          .querySelectorAll(".prompt")
          [currSelectedPrompt].dispatchEvent(mouseoverEvent);
      }
      //Esc
      else if (e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        $("#pprompts").remove();
        document
          .getElementsByClassName("_2lMWa")[0]
          .removeEventListener("keydown", handlePrompts);
        // console.log("Current Prompt key(escape)", currSelectedPrompt);

        var currentMessage = $('div[data-tab="10"]').text();
        $('div[data-tab="10"]').text("");
        $('div[data-tab="10"]').focus();
        document.execCommand("insertText", false, currentMessage);
      }
      //Enter
      else if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        document
          .getElementsByClassName("_2lMWa")[0]
          .removeEventListener("keydown", handlePrompts);
        // console.log("Current Prompt key(enter)", currSelectedPrompt);
        document.querySelectorAll(".prompt")[currSelectedPrompt].click();
      }
    }
  }
  document
    .getElementsByClassName("_2lMWa")[0]
    .addEventListener("keydown", handlePrompts);
  document.querySelector('[data-tab="8"]').scrollIntoView(false);
}

$(document).ready(function () {
  var chat_name, newChatName;
  // console.log("WhatsNxt?");
  tabKeyPress = false;

  var interval = setInterval(function () {
    // console.log("Loading...");
    if (tabKeyPress == false) {
      if ($('[data-tab="10"]').length > 0) {
        chat_name =
          document.getElementsByClassName("_21nHd")[0].childNodes[0]
            .childNodes[0].data;
        //console.log("CHAT NAME IN INNER LOOP: "+chat_name);

        // console.log($('[data-tab="10"]'));
        //console.log("Event Listerner");
        $('[data-tab="10"]').on("keydown", function (e) {
          if (e.keyCode == 9) {
            e.stopPropagation();
            e.preventDefault();
            //tabKeyPress = true;
            //console.log(tabKeyPress);
            $('[data-tab="10"]').blur();
            // console.log("TAB KEY PRESSED");
            //Generate Prompts
            //sampleFun();
            var context = getContextforAutocomplete();
            // console.log("CONTEXT: " + context);
            getAutocompleteResults(context);
          }
        });

        tabKeyPress = true;

        //console.log("Aha Tab key pressed is true now")
        //clearInterval(interval);
      }
    } else {
      newChatName =
        document.getElementsByClassName("_21nHd")[0].childNodes[0].childNodes[0]
          .data;
      //console.log("NEW CHAT NAME: "+newChatName);
      //console.log("CHAT NAME: "+chat_name);
      if (newChatName != chat_name) {
        //console.log(chat_name);
        //console.log(newChatName);
        // console.log("UNBINDING NOW");
        $('[data-tab="10"]').off("keydown");
        tabKeyPress = false;
      }
    }

    //if chat change detected tabKeyPress = false again
    //Also look into keyup
    // Problem is that it will call prompts multiple times which we dont want
  }, 1000);
});
