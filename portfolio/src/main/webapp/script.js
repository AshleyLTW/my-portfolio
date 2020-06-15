// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Global variable for ordering of comments
let order = "desc";

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['I once got my hand stuck in a cow!', 'My favourite movie (trilogy) is the Lord of The Rings', 'There isn\'t enough sunshine in Melb, I find myself accidentally working in semi-darkness a lot'];
  console.log('greeted');
  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

async function getComments(commentLimit) {
  const response = await fetch('/data?commentLimit=' + commentLimit + '&order=' + order);
  const messages = await response.json();
  const messageContainer = document.getElementById('message-container')
  messageContainer.innerHTML = '';
  for (const message of messages) {
    messageContainer.appendChild(createListElement(message));
  }
}

function filterComments(value) {
  const commentLimit = Number(value);
  if (commentLimit >= 0) {
    getComments(commentLimit.toString(10));
  }
}

async function deleteComments() {
  const response = await fetch('/delete-data', {
    method: 'POST'
    })
  getComments(document.getElementById('commentLimit').value);
}

function reorderComments() {
  if (order === 'desc') {
    order = 'asc';
    document.getElementById('reorderButton').innerText = "Newest first";
  } else {
    order = 'desc';
    document.getElementById('reorderButton').innerText = "Oldest first";
  }
  getComments(document.getElementById('commentLimit').value);
}

function createListElement(comment) {
  const liElement = document.createElement('li');
  liElement.innerText = comment.username + ': ' + comment.text + ' ' + comment.mood;
  return liElement;
}
