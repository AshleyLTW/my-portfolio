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

package com.google.sps;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public final class FindMeetingQuery {
  // Initialise intial free time array
  private Collection<TimeRange> freeTimes = new HashSet<>();

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> requestAttendees = request.getAttendees();
    freeTimes.add(TimeRange.fromStartEnd(0, TimeRange.getTimeInMinutes(23, 59), false));

    for (Event event : events) {
      if (event.getAttendees().contains(requestAttendees)) {
        modifyFreeTime(event.getWhen());
        break;
      }
    }

    throw new UnsupportedOperationException("TODO: Implement this method.");
  }

  private void modifyFreeTime(TimeRange timeRange) {

  }
}
