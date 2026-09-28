import { type MobileViewType } from "@/store/application/applicationSlice";
import styles from "./SearchResultsBody.module.css";

export type SearchResultsBodyProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  mobileViewType?: MobileViewType;
  children: React.ReactNode;
};

export default function SearchResultsBody({
  ref,
  mobileViewType = "list",
  children
}: SearchResultsBodyProps) {
  const className =
    mobileViewType === "list"
      ? styles.searchResultsMobileListView
      : styles.searchResults;
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
