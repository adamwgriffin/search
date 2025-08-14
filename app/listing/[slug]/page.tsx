import type { ListingDetailParams } from "../../api/listing_detail/[slug]/route";
import GoogleMapsProvider from "../../../providers/GoogleMapsProvider";
import mongooseConnect from "../../../lib/mongooseConnect";
import { getListingDetail } from "../../../lib/listing_search_helpers";
import ListingDetailHeader from "../../../containers/ListingDetailHeader/ListingDetailHeader";
import ListingDetail from "../../../components/listings/listing_detail/ListingDetail/ListingDetail";
import LoginOrRegisterModal from "../../../containers/modals/LoginOrRegisterModal/LoginOrRegisterModal";
import styles from "./page.module.css";
import { SearchStateProvider } from "@/providers/SearchStateProvider";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export type ListingPageProps = {
  params: ListingDetailParams;
};

const ListingPage: React.FC<ListingPageProps> = async ({ params }) => {
  let listingDetail = null;
  let error = false;

  try {
    await mongooseConnect();
    const listing = await getListingDetail(params.slug);
    // We have to serialize the listing because we get errors when trying to pass
    // the POJO returned from the db query in getListingDetail()
    listingDetail = JSON.parse(
      JSON.stringify(listing, (_key, value) =>
        value instanceof Date ? value.toISOString() : value
      )
    );
  } catch (err) {
    console.error(err);
    error = true;
  }

  return (
    <GoogleMapsProvider libraries={["places"]}>
      <SearchStateProvider>
        <ReactQueryClientProvider>
          <div className={styles.page}>
            <ListingDetailHeader />
            <div className={styles.pageContainer}>
              {listingDetail && <ListingDetail listing={listingDetail} />}
              {!listingDetail && !error && (
                <div className={styles.message}>
                  <div className={styles.notFoundIcon}>🤷‍♂️</div>
                  <div>We couldn&apos;t find that one</div>
                </div>
              )}
              {error && (
                <div className={styles.message}>Something went wrong :(</div>
              )}
            </div>
          </div>
          <LoginOrRegisterModal />
        </ReactQueryClientProvider>
      </SearchStateProvider>
    </GoogleMapsProvider>
  );
};

export default ListingPage;
