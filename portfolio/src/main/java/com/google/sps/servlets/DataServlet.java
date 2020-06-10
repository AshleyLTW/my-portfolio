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
import java.util.*;

/** Servlet that returns a hardcoded message */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  ArrayList<String> commentsList = new ArrayList();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Convert ArrayList to Json
    Gson gson = new Gson();
    String json = gson.toJson(commentsList);
    // Send JSON as response
    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Add comment to list of comments
    // TODO: Add functionality to store and display usernames
    String newComment = request.getParameter("comment");
    commentsList.add(newComment);
    response.sendRedirect("/index.html");
  }
}
