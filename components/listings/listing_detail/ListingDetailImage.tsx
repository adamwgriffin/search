"use client";

import type { ListingDetail } from "@/types/listing_types";
import { useState } from "react";
import { createPortal } from "react-dom";
import ListingImageContainer from "@/components/listings/ListingImageContainer/ListingImageContainer";
import ListingImageContainerElements from "@/components/listings/ListingImageContainerElements/ListingImageContainerElements";
import FavoriteButton from "@/containers/FavoriteButton/FavoriteButton";
import ListingDetailMainImage from "./ListingDetailMainImage/ListingDetailMainImage";
import SlideShow from "./SlideShow/SlideShow";
import ListingBadges from "@/components/listings/ListingBadges/ListingBadges";
import { useIsHydrated } from "@/hooks/useIsHydrated";

export type ListingDetailImageProps = {
  listing: ListingDetail;
};

const ListingDetailImage: React.FC<ListingDetailImageProps> = ({ listing }) => {
  const isHydrated = useIsHydrated();
  const [slideShowOpen, setSlideShowOpen] = useState(false);

  return (
    <>
      <ListingImageContainer>
        <ListingImageContainerElements>
          <ListingBadges listing={listing} showActiveStatus={true} />
          <FavoriteButton listingId={listing._id} />
        </ListingImageContainerElements>
        <ListingDetailMainImage
          imageUrl={listing.photoGallery?.[0]?.url}
          streetViewLat={listing.latitude}
          streetViewLng={listing.longitude}
          onClick={() => setSlideShowOpen(true)}
        />
      </ListingImageContainer>
      {
        // We're checking isHydrated here because document.body doesn't exist
        // when this is first rendered on the server, which causes an error
        isHydrated &&
          createPortal(
            <SlideShow
              open={slideShowOpen}
              onClose={() => setSlideShowOpen(false)}
              images={listing.photoGallery || []}
            />,
            document.body
          )
      }
    </>
  );
};

export default ListingDetailImage;
