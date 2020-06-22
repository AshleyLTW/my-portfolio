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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public final class FindMeetingQuery {
  // Initialise intial free time array
  private Collection<TimeRange> freeTimes = new HashSet<>();

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> requestAttendees = request.getAttendees();
    freeTimes.add(TimeRange.WHOLE_DAY);

    // Eliminate all times with conflicting events
    for (Event event : events) {
      if (!Collections.disjoint(requestAttendees, event.getAttendees())) {
        modifyFreeTime(event.getWhen());
      }
    }

    // Eliminate all blocks too short for the meeting
    for (TimeRange freeTime : freeTimes) {
      if (freeTime.duration() < request.getDuration()) {
        freeTimes.remove(freeTime);
      }
    }

    ArrayList<TimeRange> freeTimesList = new ArrayList<TimeRange>(freeTimes);
    Collections.sort(freeTimesList, TimeRange.ORDER_BY_START);
    return freeTimesList;
  }

  private void modifyFreeTime(TimeRange eventTime) {
    for (TimeRange freeTime : freeTimes) {
      int freeStart = freeTime.start();
      int eventStart = eventTime.start();
      int freeEnd = freeTime.end();
      int eventEnd = eventTime.end();
      if (Math.max(freeStart, eventStart) < Math.min(freeEnd, eventEnd)) {
        if (freeStart < eventStart) {
          freeTimes.add(TimeRange.fromStartEnd(freeStart, eventStart, false));
        }
        if (eventEnd < freeEnd) {
          freeTimes.add(TimeRange.fromStartEnd(eventEnd, freeEnd, false));
        }
        freeTimes.remove(freeTime);
      }
    }
  }
}
