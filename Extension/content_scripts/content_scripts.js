function sampleFun() {
  console.log("SAMPLE PROMPTS");
}

function getContextforEmotionDetection() {
  var myName = "";
  var context = "";
  var messageDOMs = [];

  var msgs = $(".focusable-list-item");
  msgs = msgs.slice(-10);
  // console.log("Messages: " + msgs);

  msgs.each(function () {
    var classes = $(this).attr("class");
    var type = "";

    if (classes.includes("message-in")) {
      type = "msg_incoming";
    } else if (classes.includes("message-out")) {
      type = "msg_outgoing";
    }

    var lines = $(this).find(".copyable-text");
    // console.log("LINES: " + lines);

    //If convesartion length is more than 2 than adding # at the end of each statement so that the model can easily predict till next #
    if (lines.length == 2) {
      var metadata = $(lines[0]).data("prePlainText");
      var msgAuthor = metadata.split("]")[1].trim();
      var time = metadata.split("]")[0].split("[")[1].trim();
      var message = $(lines[1]).text().trim();
      var msg = msgAuthor + " " + message + "#";
      messageDOMs.push(lines[1]);
      // console.log(msg);
      context += msg.trim();

      if (type === "msg_outgoing" && myName === "") {
        myName = msgAuthor;
      }
    }
  });

  // currentMessage = $('div[data-tab="10"]').text();

  // context += myName + " " + currentMessage;
  // context = context.trim();
  console.log("EMOTION CONTEXT: ");
  console.log(context);
  new_context = myName + "#" + context;
  return [messageDOMs, new_context];
}

function getContextForCalendar() {
  var context = "";
  var messageDOMs = [];
  var authors = [];
  var myname = "";
  var msgs = $(".focusable-list-item");
  msgs = msgs.slice(-10);
  msgs.each(function () {
    var classes = $(this).attr("class");
    var type = "";
    if (classes.includes("message-in")) {
      type = "msg_incoming";
    } else if (classes.includes("message-out")) {
      type = "msg_outgoing";
    }

    var texts = $(this).find(".copyable-text");
    if (texts.length == 2) {
      var metadata = $(texts[0]).data("prePlainText");
      var author = metadata.split("]")[1].trim().slice(0, -1);
      var message = $(texts[1]).text().trim();
      messageDOMs.push(texts[1]);
      // message = message.replaceAll('?', '<Q>')
      // message = message.replaceAll('&', '<AND>')
      context += message + "<SPLIT>";
      if (type === "msg_outgoing" && myname === "") {
        myname = author;
      }
      if (type != "msg_outgoing") {
        authors.push(author);
      }
    }
  });
  console.log("calender context: ");
  console.log(context);
  return [context, messageDOMs, authors, myname];
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

function getEmotionDetectionResults(emotion_context) {
  // console.log("Emotion Detection RESULTS");
  var context = emotion_context[1];
  var DOMs = emotion_context[0];
  new_context = "";
  $.ajax({
    url: "http://localhost:5000/emotion",
    crossDomain: true,
    async: false,
    dataType: "json",
    data: { context: context },
    success: (res) => {
      // console.log("Emotion done");
      console.log(res.EMOTION);
      globalThis.new_context = displayEmotionResults(
        res.EMOTION,
        context,
        DOMs
      );
    },
  });
  console.log("New context: ");
  console.log(new_context);
  return new_context;
}

function getCalendarResults(calendar_context, new_context) {
  var context = new_context;
  var DOMs = calendar_context[1];
  var authors = calendar_context[2];
  var myname = calendar_context[3];
  console.log("Get new: ");
  console.log(context);

  $.ajax({
    url: "http://localhost:5000/calendar",
    crossDomain: true,
    dataType: "json",
    data: { context: context },
    success: (d) => {
      console.log("Calender Response: ");
      console.log(d.CALENDAR);
      displayCalendar(d.CALENDAR, DOMs, context, authors, myname);
    },
  });
}

function getAutocompleteResults(context) {
  $.ajax({
    url: "http://localhost:5000/wordcomplete",
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5000/",
    },
    dataType: "json",
    data: { context: context },
    success: (res) => {
      wordcomplete = [res.COMPLETE, res.PREDICT, res.MANUAL];
      autocomplete = "";

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
        },
      });
    },
  });
}

function displayAutocompleteResults(words, prompts, context) {
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
    p = p.split("#")[0];
    $("#pprompts").append(
      `<p class='prompt' id="${i}" style='border-radius: 5px; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${p}</p>`
    );
  });

  // Words
  complete = words[0];
  predict = words[1];
  manual = words[2];

  manual.forEach((w, i) => {
    $("#pprompts").append(
      `<p class='predictmanual' id="${
        propmtLen + i
      }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
        w[0]
      }</p>`
    );
  });

  propmtLen = propmtLen + manual.length;

  complete.forEach((w, i) => {
    $("#pprompts").append(
      `<p class='complete' id="${
        propmtLen + i
      }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
        w[0]
      }</p>`
    );
  });

  propmtLen = propmtLen + complete.length;

  predict.forEach((w, i) => {
    $("#pprompts").append(
      `<p class='predictmanual' id="${
        propmtLen + i
      }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
        w[0]
      }</p>`
    );
  });

  // words.forEach((w, i) => {
  //   $("#pprompts").append(
  //     `<p class='words' id="${
  //       propmtLen + i
  //     }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
  //       w[0]
  //     }</p>`
  //   );
  // });

  $(".predictmanual").on("mouseover", function () {
    $(".predictmanual").css("background", "none");
    $(this).css("background", "#FFF");
    try {
      currSelectedPrompt = parseInt($(this)[0].id);
    } catch (error) {
      currSelectedPrompt = 0;
    }
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

  $(".predictmanual").on("click", function () {
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

  $(".complete").on("click", function () {
    document
      .getElementsByClassName("_2lMWa")[0]
      .removeEventListener("keydown", handlePrompts);

    var currentMessage = $('div[data-tab="10"]').text();
    $('div[data-tab="10"]').text("");
    const lastindex = currentMessage.lastIndexOf(" ");
    currentMessage = currentMessage.slice(0, lastindex);
    console.log("Word Complete : " + currentMessage);
    currentMessage = currentMessage + " " + $(this).text();
    $('div[data-tab="10"]').focus();
    document.execCommand("insertText", false, currentMessage);
    $("#pprompts").remove();
    $('div[data-tab="10"]').siblings().hide();
  });

  function handlePrompts(e) {
    if ($("#pprompts").length) {
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

function displayEmotionResults(vals, context, DOMs) {
  console.log("In Display emotion function");
  var myname;
  var msgs = [];
  console.log("context: ");
  console.log(context);
  // Structure of context: @rhugaved:#Aditya Patil Jio: Movie ahe
  // 1 hr remaining#@rhugaved: Nice#@rhugaved: Enjoy#
  // So, in below split we split at first ":", which gives an array like this
  // ["@rhugaved", "#Aditya Pa...", ""], so we slice to get the first 2 elements
  context = context.split(/:(.*)/s).slice(0, 2);
  myname = context[0];
  context = context[1].split("#").slice(1, -1);
  console.log("context: ");
  console.log(context);

  // for msg in context.split("#")[:-1]:
  for (let i = 0; i < context.length; i++) {
    msgs.push(context[i].split(":")[1]);
  }
  console.log("Messages: ");
  console.log(msgs);
  var new_context = "";

  for (var i = 0; i < vals.length; i++) {
    var temp = vals[i];
    var message = msgs[i];
    $(DOMs[i]).text("");
    console.log("<span>" + message + " #" + temp + "#" + "</span>");
    new_context += message + " #" + temp + "#" + "<SPLIT>";
    $(DOMs[i]).append("<span>" + message + " #" + temp + "#" + "</span>");
  }
  console.log("emotion context");
  console.log(new_context);
  return new_context;
}

function displayCalendar(vals, DOMs, context, authors, selfName) {
  // console.log("In Display Calendar function");
  var context = context.split("<SPLIT>");
  authors = [...new Set(authors)];
  var nonSelfNames = "";

  if (authors.length > 1) {
    nonSelfNames = authors.join(", ");
  } else {
    nonSelfNames = authors[0];
  }

  console.log(selfName, "-|-", nonSelfNames);
  console.log(vals, vals.length);

  for (var i = 0; i < vals.length; i++) {
    var temp = vals[i];
    console.log(context[i], temp);
    if (temp.has_calendar) {
      console.log("In if");
      var message = context[i];
      var day = String(temp.day);
      if (parseInt(day) < 10) {
        day = "0" + day;
      }
      var month = String(temp.month);
      if (parseInt(month) < 10) {
        month = "0" + month;
      }
      var year = String(temp.year);
      var hour = String(temp.hour);
      if (parseInt(hour) < 10) {
        hour = "0" + hour;
      }
      var minute = String(temp.minute);
      if (parseInt(minute) < 10) {
        minute = "0" + minute;
      }
      // var sec = "0";
      console.log("Hour: ");
      console.log(hour);
      console.log(minute);
      console.log(String(parseInt(minute) + 30));
      console.log(
        year +
          month +
          day +
          "T" +
          hour +
          minute +
          "00/" +
          year +
          month +
          day +
          "T" +
          hour +
          String(parseInt(minute) + 30) +
          "00"
      );

      // var link = "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " + nonSelfNames + "&details=This is a quick Chat with you (" + selfName + ") and " + nonSelfNames + ". This invite was automatically detected and created by You! &dates=20210222T190000Z/20210222T193000"
      var link =
        "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " +
        nonSelfNames +
        "&details=This is a quick Chat with you (" +
        selfName +
        ") and " +
        nonSelfNames +
        ". This invite was automatically detected and created by You! &dates=" +
        year +
        month +
        day +
        "T" +
        hour +
        minute +
        "00/" +
        year +
        month +
        day +
        "T" +
        hour +
        String(parseInt(minute) + 30) +
        "00";

      console.log(link);
      $(DOMs[i]).text("");
      $(DOMs[i]).append(
        "<span>" +
          // message.slice(0, temp.start) +
          '<a target="_blank" href="' +
          link +
          '" style="text-decoration: underline;text-decoration-style: dashed;">' +
          message +
          "</a>" +
          // message.slice(temp.end) +
          "</span>"
      );
      console.log("OUTSDIE");
    }
  }
}

$(document).ready(function () {
  var chat_name, newChatName;
  console.log("WhatsNxt?");
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
            var calendar_context = getContextForCalendar();
            var emotion_context = getContextforEmotionDetection();
            console.log("CONTEXT: " + calendar_context);
            var new_context = getEmotionDetectionResults(emotion_context);
            getCalendarResults(calendar_context, new_context);
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

// https://calendar.google.com/calendar/u/0/r/create?text=Quick Chat with+ "&details=This is a quick Chat with you" + nonSelfNames + ". This invite was automatically detected and created by You! "
