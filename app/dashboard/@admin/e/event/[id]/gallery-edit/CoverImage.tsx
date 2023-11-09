import { setEventCoverImage } from "@/app/dashboard/@admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEventCoverImage } from "@/lib/public/actions";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  eventId: string;
};

const CoverImage = async ({ eventId }: Props) => {
  const cover = await getEventCoverImage(eventId);
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-medium">Cover</h1>
      <p className="text-sm">
        Select an already uploaded image to set as cover
      </p>
      {cover ? (
        <Image
          className="h-64 w-auto rounded-md my-4 object-cover"
          width={512}
          height={256}
          src={cover}
          alt="No image"
        />
      ) : (
        <div className="h-64 flex flex-col justify-center items-center rounded-md bg-muted">
          <ImageIcon className="w-24 h-24" />
          <span>No Cover Image set</span>
          <span className="text-xs">
            Select an already uploaded image to set as cover
          </span>
        </div>
      )}
    </div>
  );
};

export default CoverImage;
