// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['I once got my hand stuck in a cow!', 'My favourite movie (trilogy) is the Lord of The Rings', 'There isn\'t enough sunshine in Melb, I find myself accidentally working in semi-darkness a lot'];
  console.log("greeted");
  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

async function getMessage() {
  const response = await fetch('/data');
  const messages = await response.json();
  const messageContainer = document.getElementById('message-container')
  messageContainer.innerHTML = '';
  var i;
  for (i = 0; i < messages.length; i++) {
    messageContainer.appendChild(createListElt(messages[i]));
  }
}

function createListElt(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}