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
// Global variables for map and markers
let map;
let editMarker;

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings = [
    "I once got my hand stuck in a cow!",
    "My favourite movie (trilogy) is the Lord of The Rings",
    "There isn't enough sunshine in Melb, I find myself accidentally working in semi-darkness a lot",
  ];
  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById("greeting-container");
  greetingContainer.innerText = greeting;
}

/**
 * Handles Google Maps API.
 */
function createMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.866578, lng: 151.195688 },
    zoom: 13,
  });

  const harbourBridgeMarker = new google.maps.Marker({
    position: { lat: -33.8523, lng: 151.2108 },
    map: map,
    title: "Sydney Harbour Bridge",
  });

  map.addListener("click", (event) => {
    createMarkerForEdit(event.latLng.lat(), event.latLng.lng());
  });
}

function createMarkerForEdit(lat, lng) {
  if (editMarker) {
    editMarker.setMap(null);
  }

  editMarker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: buildInfoWindowInput(lat, lng),
  });

  google.maps.event.addListener(infoWindow, "closeclick", () => {
    editMarker.setMap(null);
  });

  infoWindow.open(map, editMarker);
}

function buildInfoWindowInput(lat, lng) {
  const textBox = document.createElement("textarea");
  const button = document.createElement("button");
  button.appendChild(document.createTextNode("Submit"));

  button.onclick = () => {
    postMarker(lat, lng, textBox.value);
    createMarkerForDisplay(lat, lng, textBox.value);
    editMarker.setMap(null);
  };

  const containerDiv = document.createElement("div");
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement("br"));
  containerDiv.appendChild(button);

  return containerDiv;
}

function postMarker(lat, lng, content) {
  const params = new URLSearchParams();
  params.append("lat", lat);
  params.append("lng", lng);
  params.append("content", content);

  fetch("/markers", { method: "POST", body: params });
}

function createMarkerForDisplay(lat, lng, content) {
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
  });

  const infoWindow = new google.maps.InfoWindow({ content: content });
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}

/**
 * Handles creating blobstore url and fetching comments on load.
 */

function loadComponents() {
  fetchBlobstoreURLAndShowSubmit();
  getComments(5);
}

async function fetchBlobstoreURLAndShowSubmit() {
  const response = await fetch("/blobstore-upload-url");
  const imageURL = await response.text();
  const commentForm = document.getElementById("comment-form");
  const submitButton = document.getElementById("submit-button");
  commentForm.action = imageURL;
  submitButton.classList.remove("hidden");
}

async function getComments(commentLimit) {
  const response = await fetch(
    `/data?commentLimit=${commentLimit}&order=${order}`
  );
  const messages = await response.json();
  const messageContainer = document.getElementById("message-container");
  const imageContainer = document.getElementById("image-container");
  messageContainer.innerHTML = "";
  imageContainer.innerHTML = "";
  for (const message of messages) {
    messageContainer.appendChild(createListElement(message));
    if (message.imageURL !== "") {
      document
        .getElementById("image-container")
        .appendChild(createImageElement(message.imageURL));
    }
  }

  function createListElement(comment) {
    const liElement = document.createElement("li");
    const emoji = String.fromCodePoint(comment.mood);
    liElement.innerText = `${comment.username}: ${comment.text} ${emoji}`;
    return liElement;
  }

  function createImageElement(imageURL) {
    const img = document.createElement("img");
    img.src = imageURL;
    return img;
  }
}

/**
 * Handles manipulating comments.
 */
function filterComments(value) {
  const commentLimit = Number(value);
  if (commentLimit >= 0) {
    getComments(commentLimit.toString(10));
  }
}

async function deleteComments() {
  const response = await fetch("/delete-data", {
    method: "POST",
  });
  getComments(document.getElementById("commentLimit").value);
}

function reorderComments() {
  if (order === "desc") {
    order = "asc";
    document.getElementById("reorderButton").innerText = "Newest first";
  } else {
    order = "desc";
    document.getElementById("reorderButton").innerText = "Oldest first";
  }
  getComments(document.getElementById("commentLimit").value);
}
