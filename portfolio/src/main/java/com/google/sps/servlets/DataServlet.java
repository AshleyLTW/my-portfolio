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

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.sps.data.Comment;

/** Servlet that returns users comments */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Load comments from Datastore
    int commentLimit = Integer.parseInt(request.getParameter("commentLimit"));
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    List<Entity> results = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(commentLimit));

    ArrayList<Comment> commentsList = new ArrayList();
    for (Entity entity : results) {
      String text = (String) entity.getProperty("text");
      String username = (String) entity.getProperty("username");
      String mood = (String) entity.getProperty("mood");
      long timestamp = (long) entity.getProperty("timestamp");
      commentsList.add(new Comment(text, username, mood, timestamp));
    }

    Gson gson = new Gson();
    String jsonComments = gson.toJson(commentsList);

    response.setContentType("application/json");
    response.getWriter().println(jsonComments);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Store comment
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("text", request.getParameter("comment"));
    commentEntity.setProperty("username", request.getParameter("username"));
    commentEntity.setProperty("mood", request.getParameter("mood"));
    commentEntity.setProperty("timestamp", System.currentTimeMillis());

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }
}
