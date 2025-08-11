"use client";

import type { ListingDetail } from "../../../types/listing_types";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ListingImageContainer from "../ListingImageContainer/ListingImageContainer";
import ListingImageContainerElements from "../ListingImageContainerElements/ListingImageContainerElements";
import FavoriteButton from "../../../containers/FavoriteButton/FavoriteButton";
import ListingDetailMainImage from "./ListingDetailMainImage/ListingDetailMainImage";
import SlideShow from "./SlideShow/SlideShow";
import ListingBadges from "../ListingBadges/ListingBadges";

export type ListingDetailImageProps = {
  listing: ListingDetail;
};

const ListingDetailImage: React.FC<ListingDetailImageProps> = ({ listing }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [slideShowOpen, setSlideShowOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        // We're checking isMounted here because document.body doesn't exist
        // when this is first rendered on the server, which causes an error
        isMounted &&
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
