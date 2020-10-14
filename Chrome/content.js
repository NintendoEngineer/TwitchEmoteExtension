// ********* CHANGE THESE TWO VALUES ONLY ********* //
var emotes = [];
var emoteDict = {};

// ********* LEAVE EVERYTHING DOWN HERE ALONE ********* //
window.onload = function () {
  const targetNode = document.getElementsByClassName("chat-scrollable-area__message-container").item(0);
  const config = { childList: true };

  const callback = function (mutationsList, observer) {
    var lastChild = targetNode.lastElementChild.getElementsByClassName("chat-line__no-background").item(0);
    var lastChildNodes = lastChild.childNodes;

    var newChildNodes = [];

    for (i = 2; i < lastChildNodes.length; i++) {
      var currentNode = lastChildNodes.item(i);
      if (currentNode.nodeName === "SPAN") {
        getNodesFromFragment(currentNode.textContent).forEach(node => {
          newChildNodes.push(node);
        });
      } else {
        newChildNodes.push(currentNode);
      }
    }

    while (lastChild.childNodes.length > 2) {
      lastChild.removeChild(lastChild.childNodes.item(2));
    }

    newChildNodes.forEach(ncn => lastChild.appendChild(ncn));
  }

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
};

function getNodesFromFragment(fragment) {
  var textArray = [];
  var nodeArray = [];
  
  var chunks = fragment.split(" ");
  chunks.forEach(chunk => {
    if (emotes.includes(chunk.trim())) {
      if (textArray.length > 0) {
        nodeArray.push(createTextSpan(" " + textArray.join(" ") + " "));
        textArray = [];
      }
      nodeArray.push(createEmoteDiv(chunk.trim()));
    } else {
      textArray.push(chunk);
    }
  });

  if (textArray.length > 0) {
    nodeArray.push(createTextSpan(" " + textArray.join(" ") + " "));
  }

  return nodeArray;
}

function createTextSpan(text) {
  var span = document.createElement("span");
  span.className = "text-fragment";
  span.textContent = text;

  return span;
}

function createEmoteDiv(emoteName) {
  var emote = emoteDict[emoteName];
  var width = emote.width;
  var height = emote.height;

  var div1 = document.createElement("div");
  div1.className = "chat-line__message--emote-button";
  div1.style.height = height;
  div1.style.width = width;

  var div2 = document.createElement("div");
  div2.className = "tw-inline tw-relative tw-tooltip-wrapper";
  div2.style.height = height;
  div2.style.width = width;

  var span = document.createElement("span");
  span.style.height = height;
  span.style.width = width;

  var div3 = document.createElement("div");
  div3.className = "chat-image__container tw-align-center tw-inline-block";
  div3.style.height = height;
  div3.style.width = width;

  var img = document.createElement("img");
  img.src = emote.base64;
  img.className = "chat-image chat-line__message--emote";
  img.style.height = height;
  img.style.width = width;

  div3.appendChild(img);
  span.appendChild(div3);
  div2.appendChild(span);
  div1.appendChild(div2);

  return div1;
}