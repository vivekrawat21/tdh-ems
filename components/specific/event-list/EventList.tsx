"use client";
import React from "react";
import EventListItem from "./EventListItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteLoading from "./infinte-loading";
import useNavHeight from "@/hooks/useNavHeight";
import useViewportHeight from "@/hooks/useViewportHeight";
import { getEvents } from "@/lib/public/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { EventsRow } from "@/lib/dbTypes";
import _ from "lodash";
import { getUserRegisteredEvents } from "@/lib/userActions";

type Props = {};

const EventList = ({}: Props) => {
  const fetchEvents = async ({ pageParam = 0 }) => {
    let events: EventsRow[];

    events = await getEvents(pageParam, 3);
    return { events, pageParam };
  };

  // const fetchOwnEvents = async () => {
  //   return await getUserRegisteredEvents();
  // };

  // const registeredEventsQuery = useQuery({
  //   queryKey: ["events"],
  //   queryFn: fetchOwnEvents,
  // });

  const navHeight = useNavHeight();
  const viewHeight = useViewportHeight();

  const eventsQuery = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    initialPageParam: 0,
    // enabled: !!registeredEventsQuery.data,
    getNextPageParam: (lastPage, pages) => lastPage.pageParam + 1,
  });

  const { data, error, status } = eventsQuery;

  // const determineHasRegistered = (eventId: string | number) => {
  //   if (!registeredEventsQuery.data) return false;
  //   for (const e of registeredEventsQuery.data) {
  //     if (e.id === eventId) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  return (
    <div
      style={{ height: viewHeight - navHeight - 1 }}
      autoFocus
      className="relative snap-y overflow-y-scroll snap-mandatory flex flex-col items-center gap-3 py-3"
    >
      {status === "pending" ? null : status === "error" ? (
        <p>Error: {JSON.stringify(error.message)}</p>
      ) : (
        data.pages.map((group, i) =>
          group.events.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))
        )
      )}
      <InfiniteLoading eventsQuery={eventsQuery} />
    </div>
  );
};

export { EventList };
