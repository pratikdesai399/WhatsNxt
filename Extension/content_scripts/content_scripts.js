function sampleFun() {
  ////console.log("SAMPLE PROMPTS");
}

// function getChatName() {
//   var chat_name = "";

//   chat_title_element =
//     document.getElementsByClassName("_21nHd")[0].childNodes[0].childNodes;
//   for (let i = 0; i < chat_title_element.length; i++) {
//     if (chat_title_element[i].wholeText != undefined) {
//       // console.log(chat_title_element[i].wholeText);
//       chat_name += chat_title_element[i].wholeText;
//       // console.log(chat_title_element);
//     } else {
//       chat_name += chat_title_element[i].alt;
//     }
//   }
//   return chat_name;
// }

function getMessageValue(messageIndex) {
  // console.log(messageIndex);
  var msg_value;
  var msgs =
    document.getElementsByClassName("frMpI -sxBV")[0].childNodes[0].childNodes;
  msgs = Array.from(msgs);
  msgs = msgs.slice(-messageIndex - 2);
  // console.log(msgs);

  // console.log(msgs);
  // old_latest_msg = msgs[messageIndex - 1];
  try {
    msg_value =
      msgs[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0]
        .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        .childNodes[0].innerHTML;
    // console.log(msg_value);
  } catch {
    msg_value = "";
    console.log("error msg");
  }
  // console.log(msg_value);
  return msg_value;
}

function setMessageValue(messageIndex, msg_value) {
  var msgs =
    document.getElementsByClassName("frMpI -sxBV")[0].childNodes[0].childNodes;
  msgs = Array.from(msgs);
  msgs = msgs.slice(-messageIndex - 1);
  // console.log(msgs);
  // console.log("IN CONTEXT: ");
  try {
    // console.log(msgs[0]);
    msgs[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML =
      msg_value;
    // console.log(msg_value);
  } catch {}
}

function getChatboxData() {
  var chatbox_data =
    document.getElementsByClassName("uueGX")[0].childNodes[0].childNodes[1]
      .childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML;
  console.log(chatbox_data);
  return chatbox_data;
}

function setChatboxData(chatbox_data) {
  document.getElementsByClassName(
    "uueGX"
  )[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML =
    chatbox_data;
}

function getChatName() {
  var author = document.getElementsByClassName(
    "_7UhW9 vy6Bb qyrsm KV-D4 fDxYl"
  )[1].innerHTML;
  // console.log("getChatName", author);
  return author;
}

function setChatName(author) {
  document.getElementsByClassName(
    "_7UhW9 vy6Bb qyrsm KV-D4 fDxYl"
  )[1].innerHTML = author;
}

function getContextforEmotionDetection() {
  var myName = "";
  var context = "";
  var messageDOMs = [];

  var msgs = $(".focusable-list-item");
  msgs = msgs.slice(-10);
  // ////console.log("Messages: " + msgs);

  msgs.each(function () {
    var classes = $(this).attr("class");
    var type = "";

    if (classes.includes("message-in")) {
      type = "msg_incoming";
    } else if (classes.includes("message-out")) {
      type = "msg_outgoing";
    }

    var lines = $(this).find(".copyable-text");
    // ////console.log("LINES: " + lines);

    //If convesartion length is more than 2 than adding # at the end of each statement so that the model can easily predict till next #
    if (lines.length == 2) {
      var metadata = $(lines[0]).data("prePlainText");
      var msgAuthor = metadata.split("]")[1].trim();
      var time = metadata.split("]")[0].split("[")[1].trim();
      var message = $(lines[1]).text().trim();
      var msg = msgAuthor + " " + message + "#";
      messageDOMs.push(lines[1]);
      // ////console.log(msg);
      context += msg.trim();

      if (type === "msg_outgoing" && myName === "") {
        myName = msgAuthor;
      }
    }
  });

  // currentMessage = $('div[data-tab="10"]').text();

  // context += myName + " " + currentMessage;
  // context = context.trim();
  ////console.log("EMOTION CONTEXT: ");
  ////console.log(context);
  new_context = myName + "#" + context;
  // //console.log("EMOTION: ", new_context);
  return [messageDOMs, new_context];
}

var old_latest_msg;
var new_latest_msg;

function getContext(number_of_msgs) {
  var context = "";
  var messageDOMs = [];
  var authors = [];
  var myname = "";

  var msgs =
    document.getElementsByClassName("frMpI -sxBV")[0].childNodes[0].childNodes;
  msgs = Array.from(msgs);
  msgs = msgs.slice(-number_of_msgs);
  // console.log(msgs);
  old_latest_msg = msgs[number_of_msgs - 1];
  console.log("IN CONTEXT: ");
  console.log(old_latest_msg);
  for (var i = 0; i < number_of_msgs; i++) {
    // try {
    var text = getMessageValue(i);
    context += "Person1: " + text + "#";
    // } catch {}
  }
  // for (const msg of msgs) {
  //   try {
  //     var text =
  //       msg.childNodes[1].childNodes[0].childNodes[0].childNodes[0]
  //         .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
  //         .childNodes[0].innerHTML;
  //     // console.log(text);
  //     msg.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML =
  //       "hi";
  //     context += text + "#";
  //   } catch {}
  // }
  context += "Myname";
  console.log(context);

  author = getChatName();
  console.log("author", author);

  chatbox_data = getChatboxData();
  console.log("chatbox_data", chatbox_data);

  // msgs.each(function () {
  //   var classes = $(this).attr("class");
  //   var type = "";

  //   if (classes.includes("message-in")) {
  //     type = "msg_incoming";
  //   } else if (classes.includes("message-out")) {
  //     type = "msg_outgoing";
  //   }

  //   var texts = $(this).find(".copyable-text");

  //   if (texts.length == 2) {
  //     var metadata = $(texts[0]).data("prePlainText");
  //     // var author = metadata.split("]")[1].trim().slice(0, -1);
  //     var author = metadata.split("]")[1].trim();
  //     var message = $(texts[1]).text().trim();
  //     ////console.log("PRINGTING MESSAGE: ----->");
  //     // //console.log($(texts[1]).text());
  //     //console.log(message);

  //     // //console.log(message);
  //     messageDOMs.push(texts[1]);
  //     // message = message.replaceAll('?', '<Q>')
  //     // message = message.replaceAll('&', '<AND>')
  //     // Old context for calendar format
  //     // context += message + "<SPLIT>";

  //     // Merging context functions
  //     context += author + " " + message + "#";

  //     if (type === "msg_outgoing" && myname === "") {
  //       myname = author;
  //     }
  //     if (type != "msg_outgoing") {
  //       authors.push(author.split(":")[0]);
  //     } else if (authors.length < 1) {
  //       chat_name = getChatName();
  //       authors.push(chat_name);
  //     }
  //   }
  // });

  // currentMessage = $('div[data-tab="10"]').text();

  // context += myname + " " + currentMessage;
  // context = context.trim();

  // // Trim all the whitespce at the end of the message, but keep one whitespce that is needed for word complete to work
  // if (/\s$/.test(currentMessage)) {
  //   //console.log("SPACE FOUND");
  //   context += " ";
  // }

  // //console.log("calender context: ");
  // //console.log(context);
  // // //console.log("CALENDAR: ", context);
  // // console.log("Authors: ", authors);
  // // console.log("Myname: ", myname);
  // return [context, messageDOMs, authors, myname];
  return [context, author, chatbox_data];
}

function getContextforAutocomplete() {
  var myName = "";
  var context = "";

  var msgs = $(".focusable-list-item");
  msgs = msgs.slice(-5);
  //////console.log("MESSAGES: "+ msgs);

  msgs.each(function () {
    var classes = $(this).attr("class");
    var type = "";

    if (classes.includes("message-in")) {
      type = "msg_incoming";
    } else if (classes.includes("message-out")) {
      type = "msg_outgoing";
    }

    var lines = $(this).find(".copyable-text");
    //////console.log("LINES: "+ lines);

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
  //console.log("AUTOCOMPLETE: ", context);
  return context;
}

function getEmotionDetectionResults(emotion_context) {
  // Emotion context format for instagram: [context, author, chatbox_data]
  // ////console.log("Emotion Detection RESULTS");
  var context = emotion_context[0];
  var author = emotion_context[1];
  // var DOMs = emotion_context[1];
  new_context = "";
  $.ajax({
    url: "http://localhost:5000/emotion",
    crossDomain: true,
    async: false,
    dataType: "json",
    data: { context: context },
    success: (res) => {
      //console.log("Emotion done");
      //console.log(res.EMOTION);
      globalThis.new_context = displayEmotionResults(
        res.EMOTION,
        context,
        author
      );
    },
  });
  //console.log("New context: ");
  //console.log(new_context);
  return new_context;
}

function getCalendarResults(calendar_context, new_context) {
  // calendar_context = [context, author, chatbox_data]
  var context = new_context;
  // var DOMs = calendar_context[1];
  var author = calendar_context[1];
  // console.log(authors);
  var myname = "Myname";
  //console.log("Get new: ");
  //console.log(context);

  $.ajax({
    url: "http://localhost:5000/calendar",
    crossDomain: true,
    dataType: "json",
    data: { context: context },
    success: (d) => {
      ////console.log("Calender Response: ");
      ////console.log(d.CALENDAR);
      displayCalendar(d.CALENDAR, context, author, myname);
    },
  });
}

function getWordCompleteResults(context, key_pressed) {
  //console.log("Ajax context: ", context);
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
      autocomplete = [];
      displayAutocompleteResults(
        wordcomplete,
        autocomplete,
        context,
        key_pressed
      );
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
        data: { context: context.trim() },
        success: (res) => {
          autocomplete = res.AUTOCOMPLETE;
          //console.log("autocomplete: --->>>");

          //console.log(autocomplete);
          ////console.log(wordcomplete);
          displayAutocompleteResults(wordcomplete, autocomplete, context);
        },
      });
    },
  });
}

function displayAutocompleteResults(words, prompts, context, key_pressed) {
  console.log("WORD COMPLETE RESULTS: ");
  console.log("CONTEXT: ", context);
  console.log("res.COMPLETE, res.PREDICT, res.MANUAL");
  console.log("Complete: ", words[0]);
  console.log("Predict: ", words[1]);
  console.log("Manual: ", words[2]);
  console.log("Key_pressed: ", key_pressed);
  console.log("Prompt: ", prompts);

  ////console.log("words : ", words);
  $("#pprompts").remove();
  $('div[data-tab="8"]').append(
    "<div id='pprompts' style='padding: 20px;margin: 20px 20px 10px 20px; border-radius: 15px; background:#ecffe9'></div>"
  );
  $("#pprompts").append(
    '<div style="flex-direction: row;display: flex;"><p style="font-size: 12px; padding: 0px 15px 10px 5px; font-weight: 900; text-transform: uppercase">WhatsNxt: Autocomplete Responses</p></div>'
  );

  // Sentence
  // var currSelectedPrompt = 0;
  currSelectedPrompt = -1;
  curSelectWord = -1;
  var propmtLen = prompts.length;
  totalPrompts = prompts.length;
  prompts.forEach((p, i) => {
    p = p.generated_text.replace(context, "").trim();
    p = p.split("#")[0];
    if (p.length != 0) {
      $("#pprompts").append(
        `<p class='prompt' id="${i}" style='border-radius: 5px; padding: 12px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${p}</p>`
      );
    }
  });

  $("#pprompts").append(
    `<p class='endrow' id="endrow" style='border-radius: 5px; padding: 0px 0px 30px 0px;border: 0px solid #000000;margin: 5px; font-size: 14px'></p>`
  );

  // Words
  complete = words[0];
  predict = words[1];
  manual = words[2];

  var i = 0;
  var pred_complete = 0;
  var id_count = 0;
  // We have 3 word lists: Manual, complete and predict. So which to display first is determined by the key pressed.
  // If space(32) is pressed, then predict list is displayed first followed by complete and finally manual.
  // In predict if, we make key_pressed as 1, so that we can display complete next and in complete we make it 0 to display the manual if present
  while (i < 3) {
    i += 1;
    if (key_pressed == 0) {
      key_pressed = -1;
      //console.log("IN MANUAL");

      manual.forEach((w, i) => {
        $("#endrow").append(
          `<p class='predictmanual words' id="w${id_count}" style='display:inline;float:left;inline-size: min-content; border-radius: 5px; padding: 12px;border: 1px solid #000000;margin: 0px 5px 0px 0px; font-size: 14px'>${w[0]}</p>`
        );
        id_count += 1;
      });

      propmtLen = propmtLen + manual.length;
    } else if (key_pressed != 32 && key_pressed != 0 && key_pressed != -1) {
      //console.log("IN COMPLETE");
      if (pred_complete) {
        key_pressed = 0;
      } else {
        key_pressed = 32;
        pred_complete = 1;
      }

      complete.forEach((w, i) => {
        let currentMessage = $('div[data-tab="10"]').text().trim();
        let lastindex = currentMessage.lastIndexOf(" ");
        let lastword = currentMessage.slice(lastindex, currentMessage.length);
        //console.log("Lastword : " + lastword);
        //console.log("Complete word : " + w[0]);
        if (lastword.trim().localeCompare(w[0]) != 0) {
          $("#endrow").append(
            `<p class='complete words' id="w${id_count}" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 12px;border: 1px solid #000000;margin: 0px 5px 0px 0px; font-size: 14px'>${w[0]}</p>`
          );
          id_count += 1;
        }
      });

      propmtLen = propmtLen + complete.length;
    } else if (key_pressed == 32) {
      //console.log("IN PREDICT");

      if (pred_complete) {
        key_pressed = 0;
      } else {
        pred_complete = 1;
        key_pressed = 1;
      }
      predict.forEach((w, i) => {
        $("#endrow").append(
          `<p class='predictmanual words' id="w${id_count}" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 12px;border: 1px solid #000000;margin: 0px 5px 0px 0px; font-size: 14px'>${w[0]}</p>`
        );
        id_count += 1;
      });
    } else if (key_pressed == -1) {
      continue;
    }
    totalWords = id_count;
  }

  // words.forEach((w, i) => {
  //   $("#pprompts").append(
  //     `<p class='words' id="${
  //       propmtLen + i
  //     }" style='display:inline;float:left; border-radius: 5px;inline-size: min-content; padding: 15px;border: 1px solid #000000;margin: 5px; font-size: 14px'>${
  //       w[0]
  //     }</p>`
  //   );
  // });

  $(".words").on("mouseover", function () {
    $(".words").css("background", "none");
    $(this).css("background", "#FFF");
    try {
      curSelectWord = parseInt($(this)[0].id[1]);
      console.log("Hovor : " + curSelectWord);
    } catch (error) {
      curSelectWord = 0;
    }
  });

  // $(".predictmanual").on("mouseover", function () {
  //   $(".predictmanual").css("background", "none");
  //   $(this).css("background", "#FFF");
  //   try {
  //     curSelectWord = parseInt($(this)[0].id[1]);
  //     console.log("Hovor : " + curSelectWord);
  //   } catch (error) {
  //     curSelectWord = 0;
  //   }
  // });

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
  //console.log("Before Dispatch : " + totalPrompts);
  // if (document.querySelector(".prompt")) {
  //   document.querySelector(".prompt").dispatchEvent(mouseoverEvent);
  // }
  // totalPrompts = prompts.length;

  $(".prompt").on("click", function () {
    $("#pprompts").remove();
    document
      .getElementsByClassName("_2lMWa")[0]
      .removeEventListener("keydown", handlePrompts);

    var currentMessage =
      document.getElementsByClassName("p3_M1")[0].childNodes[0].childNodes[1]
        .innerHTML;
    currentMessage = currentMessage.trim() + " " + $(this).text();
    document.getElementsByClassName(
      "p3_M1"
    )[0].childNodes[0].childNodes[1].innerHTML = "";
    document.execCommand("insertText", false, currentMessage);
    $('div[data-tab="10"]').focus();
    $('div[data-tab="10"]').siblings().hide();
  });

  $(".predictmanual").on("click", function () {
    $("#pprompts").remove();
    document
      .getElementsByClassName("_2lMWa")[0]
      .removeEventListener("keydown", handlePrompts);

    var currentMessage =
      document.getElementsByClassName("p3_M1")[0].childNodes[0].childNodes[1]
        .innerHTML;
    currentMessage = currentMessage.trim() + " " + $(this).text();
    document.getElementsByClassName(
      "p3_M1"
    )[0].childNodes[0].childNodes[1].innerHTML = "";
    document.execCommand("insertText", false, currentMessage);
    $('div[data-tab="10"]').focus();
    $('div[data-tab="10"]').siblings().hide();
  });

  $(".complete").on("click", function () {
    $("#pprompts").remove();
    document
      .getElementsByClassName("_2lMWa")[0]
      .removeEventListener("keydown", handlePrompts);

    var currentMessage =
      document.getElementsByClassName("p3_M1")[0].childNodes[0].childNodes[1]
        .innerHTML;
    // $('div[data-tab="10"]').text("");
    const lastindex = currentMessage.lastIndexOf(" ");
    if (lastindex == -1) {
      currentMessage = $(this).text();
    } else {
      currentMessage = currentMessage.slice(0, lastindex);
      ////console.log("Word Complete : " + currentMessage);
      currentMessage = currentMessage + " " + $(this).text();
    }
    document.getElementsByClassName(
      "p3_M1"
    )[0].childNodes[0].childNodes[1].innerHTML = "";
    document.execCommand("insertText", false, currentMessage);
    $('div[data-tab="10"]').focus();
    $('div[data-tab="10"]').siblings().hide();
  });

  function handlePrompts(e) {
    // e.stopImmediatePropagation();
    if ($("#pprompts").length) {
      console.log("prompts : " + totalPrompts + " words : " + totalWords);
      //Up arrow
      if (e.keyCode === 38) {
        e.preventDefault();
        e.stopImmediatePropagation();
        isSelect = true;
        if (isAutoPrompt) {
          console.log("prompt count : " + totalPrompts);
          if (currSelectedPrompt == -1) {
            currSelectedPrompt = 0;
          } else {
            currSelectedPrompt -= 1;
            if (currSelectedPrompt < 0) {
              currSelectedPrompt = totalPrompts - 1;
            }
          }
          console.log("Current Prompt key(up)", currSelectedPrompt);
          document
            .querySelectorAll(".prompt")
            [currSelectedPrompt].dispatchEvent(mouseoverEvent);
        }
        // ////console.log("Current Prompt key(up)", currSelectedPrompt);
        // document
        // .querySelectorAll(".prompt")
        // [currSelectedPrompt].dispatchEvent(mouseoverEvent);
      }
      //Down arrow
      else if (e.keyCode === 40 || e.keyCode == 9) {
        e.preventDefault();
        e.stopImmediatePropagation();
        isSelect = true;
        if (isAutoPrompt) {
          console.log("prompt count : " + totalPrompts);
          if (currSelectedPrompt == -1) {
            currSelectedPrompt = 0;
          } else {
            currSelectedPrompt += 1;
            if (currSelectedPrompt >= totalPrompts) {
              currSelectedPrompt = 0;
            }
          }
          console.log("Current Prompt key(down)", currSelectedPrompt);
          document
            .querySelectorAll(".prompt")
            [currSelectedPrompt].dispatchEvent(mouseoverEvent);
        }
        // ////console.log("Current Prompt key(down)", currSelectedPrompt);
        // document
        //   .querySelectorAll(".prompt")
        //   [currSelectedPrompt].dispatchEvent(mouseoverEvent);
      }

      // left arrow
      if (e.keyCode === 37) {
        e.preventDefault();
        e.stopImmediatePropagation();
        isSelect = true;
        if (!isAutoPrompt) {
          console.log("word count : " + totalWords);
          if (curSelectWord == -1) {
            curSelectWord = 0;
          } else {
            curSelectWord -= 1;
            if (curSelectWord < 0) {
              curSelectWord = totalWords - 1;
            }
          }
          console.log("Cur select word : " + curSelectWord);
          document
            .getElementById("w" + curSelectWord)
            .dispatchEvent(mouseoverEvent);
        }
      }

      // right arow
      else if (e.keyCode === 39 || e.keyCode == 9) {
        e.preventDefault();
        e.stopImmediatePropagation();
        isSelect = true;
        if (!isAutoPrompt) {
          console.log("word count : " + totalWords);
          if (curSelectWord == -1) {
            curSelectWord = 0;
          } else {
            curSelectWord += 1;
            if (curSelectWord >= totalWords) {
              curSelectWord = 0;
            }
          }
          // if (curSelectWord >= totalWords) {
          //   curSelectWord = 0;
          // }
          console.log("Cur select word : " + curSelectWord);
          document
            .getElementById("w" + curSelectWord)
            .dispatchEvent(mouseoverEvent);
        }
      }

      //Esc
      else if (e.keyCode === 27) {
        isSelect = false;
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#pprompts").remove();
        document
          .getElementsByClassName("_2lMWa")[0]
          .removeEventListener("keydown", handlePrompts);
        //console.log("Current Prompt key(escape)", currSelectedPrompt);

        // var currentMessage = $('div[data-tab="10"]').text();
        // $('div[data-tab="10"]').text("");
        // $('div[data-tab="10"]').focus();
        // document.execCommand("insertText", false, currentMessage);
      }
      //Enter
      else if (e.keyCode === 13) {
        if (isSelect == true) {
          isSelect = false;
          e.preventDefault();
          e.stopImmediatePropagation();
          document
            .getElementsByClassName("_2lMWa")[0]
            .removeEventListener("keydown", handlePrompts);
          if (isAutoPrompt) {
            //console.log("Current Prompt key(enter)", currSelectedPrompt);
            document.querySelectorAll(".prompt")[currSelectedPrompt].click();
          } else {
            document.getElementById("w" + curSelectWord).click();
          }
        }
      }
    }
  }
  document
    .getElementsByClassName("_2lMWa")[0]
    .addEventListener("keydown", handlePrompts);
  document.querySelector('[data-tab="8"]').scrollIntoView(false);
}

function calculateAverageEmotion(emotionListVals) {
  var counts = {};
  var emotions = ["😡", "😄", "❤️", "😐", "😞", "😮"];

  for (const num of emotionListVals) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  // console.log("Average");
  // old_name =
  //   document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML;
  old_name = getChatName();
  // console.log(old_name);
  if (old_name.includes("[")) {
    old_name = old_name.split("]")[0];
    // console.log(old_name);
    for (const em of Object.keys(counts)) {
      if (!old_name.includes(em)) {
        old_name += em;
      }
    }
    old_name += "]";
    setChatName(old_name);
    // document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML =
    //   old_name;
    // console.log(old_name);
  } else {
    setChatName(getChatName() + " [");
    // document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML +=
    //   " [";

    for (const em of Object.keys(counts)) {
      setChatName(getChatName() + em);
      // document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML +=
      //   em;
    }

    // document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML += "]";
    setChatName(getChatName() + "]");
    // console.log("NEW");
  }
  //console.log(counts);
  return counts;
}

function displayEmotionResults(vals, context, author) {
  ////console.log("In Display emotion function");
  var myname;
  var msgs = [];
  // //console.log("context: ");
  // //console.log(context);
  // Structure of context: @rhugaved:#Aditya Patil Jio: Movie ahe
  // 1 hr remaining#@rhugaved: Nice#@rhugaved: Enjoy#
  // So, in below split we split at first ":", which gives an array like this
  // ["@rhugaved", "#Aditya Pa...", ""], so we slice to get the first 2 elements
  // context = context.split(/:(.*)/s).slice(0, 2);
  // myname = context[0];
  // context = context[1].split("#").slice(1, -1);

  // For new combined context format:
  // console.log(context);
  split = context.match(/((.|\n)*)\#(.|\n)*/);
  context = split[1];
  // myname = split[2];
  context = context.split("#");
  console.log("display emotion");
  console.log(context);
  console.log(vals);

  //console.log("displayEmotionResults context: ");
  //console.log(context);

  // for msg in context.split("#")[:-1]:
  for (let i = 0; i < context.length; i++) {
    //console.log(context[i]);
    //console.log(context[i].split(/:(.*)/s).slice(0, 2)[1]);
    //console.log(context[i].split(/:(.*)/s).slice(0, 2)[1].trim());

    msgs.push(context[i].split(/:(.*)/s).slice(0, 2)[1].trim());
    //console.log("Checking for :--->>>");
    // //console.log(context[i].split(":", 1));

    // context = context[i].split(/:(.*)/s).slice(0, 2);
    // myname = context[0];
    // context = context[1].split("#").slice(1, -1);
    //console.log(context[i].split(/:(.*)/s).slice(0, 2)[1].trim());
  }
  console.log("Messages: ");
  console.log(msgs);
  var new_context = "";

  // //console.log("IN DISPLAY EMOTION: ");
  for (var i = 0; i < vals.length; i++) {
    var temp = vals[i];
    var message = msgs[i];
    // console.log(message + " #" + temp + "#");
    // $(DOMs[i]).text("");
    // //console.log("<span>" + message + " #" + temp + "#" + "</span>");
    new_context += message + " [" + temp + "]" + "<SPLIT>";
    // $(DOMs[i]).append("<span>" + message + " [" + temp + "]" + "</span>");
    console.log(message + "[" + temp + "]");
    setMessageValue(i, message + "[" + temp + "]");
  }
  counts = calculateAverageEmotion(vals);

  // document.getElementsByClassName("_21nHd")[0].childNodes[0].innerHTML +=
  //   counts;
  //console.log("======name======");

  // //console.log("emotion context");
  // //console.log(new_context);
  return new_context;
}

function displayCalendar(vals, context, author, selfName) {
  // ////console.log("In Display Calendar function");
  var context = context.split("<SPLIT>");
  // authors = [...new Set(authors)];
  var nonSelfNames = "";
  // console.log(authors);
  // if (authors.length > 1) {
  //   nonSelfNames = authors.join(", ");
  // } else {
  //   nonSelfNames = authors[0];
  // }

  ////console.log(selfName, "-|-", nonSelfNames);
  // //console.log("DISPLAY CALENDAR: ");
  // //console.log(vals, vals.length);
  //console.log(context);

  for (var i = 0; i < vals.length; i++) {
    var temp = vals[i];
    ////console.log(context[i], temp);
    if (temp.has_calendar) {
      ////console.log("In if");
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
      ////console.log("Hour: ");
      ////console.log(hour);
      ////console.log(minute);
      ////console.log(String(parseInt(minute) + 30));
      // //console.log(
      //   year +
      //     month +
      //     day +
      //     "T" +
      //     hour +
      //     minute +
      //     "00/" +
      //     year +
      //     month +
      //     day +
      //     "T" +
      //     hour +
      //     String(parseInt(minute) + 30) +
      //     "00"
      // );

      // var link = "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " + nonSelfNames + "&details=This is a quick Chat with you (" + selfName + ") and " + nonSelfNames + ". This invite was automatically detected and created by You! &dates=20210222T190000Z/20210222T193000"
      var link =
        "https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with " +
        author +
        "&details=This is a quick Chat with you (" +
        selfName +
        ") and " +
        author +
        ". This invite was automatically detected and created by WhatsNxt! &dates=" +
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

      // console.log(nonSelfNames);
      console.log(link);
      setMessageValue(
        i,
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
      ////console.log("OUTSDIE");
    }
  }
}

$(document).ready(function () {
  var chat_name, newChatName;
  console.log("WhatsNxt?");
  console.log();
  tabKeyPress = true;
  totalPrompts = 0;
  currSelectedPrompt = -1;
  curSelectWord = -1;
  totalWords = 0;
  isAutoPrompt = false;
  isShift = false;
  isSelect = false;
  flag = true;
  emotion_call_flag = false;
  chat_name = "";
  newChatName = "";
  var interval = setInterval(function () {
    // if (
    //   document.getElementsByClassName("_7UhW9 vy6Bb qyrsm KV-D4 fDxYl").length >
    //     1
    // ) {
    //   flag = false;
    //   console.log("context");
    //   var context = getContext(10);
    //   var new_context = getEmotionDetectionResults(context);
    //   getCalendarResults(context, new_context);
    //   // getAutocompleteResults(context[0]);
    //   console.log(context);
    // }

    // console.log("Loading..." + curSelectWord);
    if (emotion_call_flag == true) {
      //console.log("emotion_call_flag == true");
      emotion_call_flag = false;
      // Format of returned context: [context, messageDOMs, authors, myname]
      // console.log("Calling EMOTION");
      var context = getContext(10);
      console.log("old_latest_msg");

      console.log(old_latest_msg);

      // var emotion_context = getContextforEmotionDetection();
      ////console.log("CONTEXT: " + calendar_context);
      //console.log("Calling Emotion 1");
      var new_context = getEmotionDetectionResults(context);
      getCalendarResults(context, new_context);
    }
    if (tabKeyPress == false) {
      console.log("INSIDE Tab key");
      if (
        document.getElementsByClassName("_7UhW9 vy6Bb qyrsm KV-D4 fDxYl")
          .length > 1
      ) {
        console.log("IN INSTAGRAM");
        // chat_name =
        //   document.getElementsByClassName("_21nHd")[0].childNodes[0]
        //     .childNodes[0].data;

        chat_name = getChatName();

        // console.log("CHAT NAME IN INNER LOOP: " + chat_name);
        chat_name = chat_name.split("[")[0];
        // console.log("CHAT NAME IN INNER LOOP: " + chat_name);

        // ////console.log($('[data-tab="10"]'));
        //////console.log("Event Listerner");

        // // Format of returned context: [context, messageDOMs, authors, myname]
        // var context = getContext();
        // // var emotion_context = getContextforEmotionDetection();
        // ////console.log("CONTEXT: " + calendar_context);
        // //console.log("Calling Emotion 1");
        // var new_context = getEmotionDetectionResults(context);
        // // getCalendarResults(context, new_context);
        $('[data-tab="10"]').on("keydown", function (e) {
          if (e.keyCode == 16) {
            isShift = true;
          }

          // Shift + tab key for prompts
          if (isShift && e.keyCode == 9) {
            e.stopPropagation();
            e.preventDefault();
            isAutoPrompt = true;
            //tabKeyPress = true;
            //////console.log(tabKeyPress);
            $('[data-tab="10"]').blur();
            //console.log("TAB KEY PRESSED");
            //Generate Prompts
            //sampleFun();
            // var context = getContextforAutocomplete();

            // Format of returned context: [context, messageDOMs, authors, myname]
            var context = getContext(3);
            // var emotion_context = getContextforEmotionDetection();
            // //console.log("CONTEXT: " + calendar_context);
            //console.log("Calling Emotion 2");

            // var new_context = getEmotionDetectionResults(context);
            // getCalendarResults(context, new_context);
            currSelectedPrompt = 0;
            //console.log(context[0]);
            getAutocompleteResults(context[0]);
          } else if (
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            (e.keyCode >= 97 && e.keyCode <= 122) ||
            e.keyCode == 32 ||
            e.keyCode == 8
          ) {
            key_pressed = e.keyCode;
            isAutoPrompt = false;
            isSelect = false;
            // On a keypress, the pressed key is not included in the context, so we need to add that char in the context.
            // So, first we convert the keycode to char
            var last_char = String.fromCharCode(key_pressed).toLowerCase();

            //console.log("KEY PRESSED");
            var context = getContext(5);
            //console.log(context[0]);
            //console.log("LAst char: ", last_char);

            // key_pressed == 8 is for backspace, so, for backspace, we remove the last char
            if (key_pressed != 8) {
              context[0] = context[0] + last_char;
              //console.log(context[0]);
            } else {
              context[0] = context[0].slice(0, -1);
              //console.log(context[0]);
            }

            getWordCompleteResults(context[0], key_pressed);
          }
        });

        $('[data-tab="10"]').on("keyup", function (e) {
          isShift = false;
        });

        tabKeyPress = true;

        //////console.log("Aha Tab key pressed is true now")
        //clearInterval(interval);
      }
    } else {
      // newChatName =
      //   document.getElementsByClassName("_21nHd")[0].childNodes[0].childNodes[0]
      //     .data;

      try {
        newChatName = getChatName();
        // console.log(newChatName);
        newChatName = newChatName.split("[")[0];
        // console.log(newChatName);
      } catch (err) {
        // console.log("Errorsss");
      }

      var msgs =
        document.getElementsByClassName("frMpI -sxBV")[0].childNodes[0]
          .childNodes;
      msgs = Array.from(msgs);

      msgs = msgs.slice(-2);

      new_latest_msg = msgs[1];

      if (
        old_latest_msg != new_latest_msg &&
        old_latest_msg != undefined &&
        new_latest_msg != undefined &&
        newChatName == chat_name
      ) {
        // console.log("different contexts");
        // console.log("NEW CHAT NAME: " + newChatName);
        // console.log("CHAT NAME: " + chat_name);
        var context_1 = getContext(1);
        // console.log(context_1);
        var new_context = getEmotionDetectionResults(context_1);
        getCalendarResults(context_1, new_context);
        emotion_call_flag = false;

        // removing prompt when new message arrives
        $("#pprompts").remove();
        isSelect = false;
        document
          .getElementsByClassName("_2lMWa")[0]
          .removeEventListener("keydown", handlePrompts);
        //console.log("Current Prompt key(escape)", currSelectedPrompt);

        var currentMessage = $('div[data-tab="10"]').text();
        $('div[data-tab="10"]').text("");
        $('div[data-tab="10"]').focus();
        document.execCommand("insertText", false, currentMessage);
      }
      // console.log("NEW CHAT NAME: " + newChatName);
      // console.log("CHAT NAME: " + chat_name);
      if (newChatName != chat_name) {
        //////console.log(chat_name);
        //////console.log(newChatName);
        //console.log("UNBINDING NOW");
        $('[data-tab="10"]').off("keydown");
        tabKeyPress = false;
        emotion_call_flag = true;
        // console.log("emotion_call_flag == False");
      }
    }

    //if chat change detected tabKeyPress = false again
    //Also look into keyup
    // Problem is that it will call prompts multiple times which we dont want
  }, 1000);
});

// https://calendar.google.com/calendar/u/0/r/create?text=Quick Chat with+ "&details=This is a quick Chat with you" + nonSelfNames + ". This invite was automatically detected and created by You! "
