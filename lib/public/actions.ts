"use server";

import { EventsColumn } from "../dbTypes";
import { createClient } from "../supabase/client";
import { getGalleryImageUrlFromName } from "./utils";

const getEventGallery = async (eventId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("event")
    .list(`${eventId}/gallery`, { sortBy: { column: "name", order: "asc" } });
  if (error) throw new Error(error.message);
  const imageURLs: string[] = data.map(
    (d) =>
      supabase.storage
        .from("event")
        .getPublicUrl(`${eventId}/gallery/${d.name}`).data.publicUrl
  );
  console.log(imageURLs);

  return imageURLs;
};

const getEventCoverImage = async (eventId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("cover_image_url")
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  if (!data[0].cover_image_url) return null;
  const publicUrl = getGalleryImageUrlFromName(
    eventId,
    data[0].cover_image_url
  );
  return publicUrl;
};

const getEvents = async (
  page: number,
  limit = 10,
  onlyPublished: boolean = false
) => {
  const supabase = createClient();
  if (onlyPublished) {
    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("published", onlyPublished)
      .range(page * limit, page * limit + limit - 1)
      .order("registration_end", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data;
  }
  const { data, error } = await supabase
    .from("events")
    .select()
    .range(page * limit, page * limit + limit - 1)
    .order("registration_end", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  console.log(page);

  return data;
};

const searchEvents = async (
  term: string,
  column: Exclude<EventsColumn, "tags"> = "title",
  page: number = 0,
  limit = 10
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select()
    .ilike(column, `%${term}%`)
    .range(page * limit, page * limit + limit - 1)
    .order("registration_end", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  console.log(page);

  return data;
};

const searchEventsByTags = async (
  tags: string[],
  page: number = 0,
  limit = 10
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select()
    .contains("tags", tags)
    .range(page * limit, page * limit + limit - 1)
    .order("registration_end", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  console.log(page);

  return data;
};

const getAllEvents = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select();
  if (error) throw new Error(error.message);
  return data;
};
export {
  getEventGallery,
  getEventCoverImage,
  getEvents,
  getAllEvents,
  searchEvents,
  searchEventsByTags,
};
