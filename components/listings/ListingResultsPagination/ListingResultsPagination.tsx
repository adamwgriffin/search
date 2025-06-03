import { useState, useCallback } from "react";
import MenuButton from "../../design_system/MenuButton/MenuButton";
import PaginationButton from "../PaginationButton/PaginationButton";
import ArrowRight from "../../design_system/icons/ArrorRight/ArrowRight";
import ArrowLeft from "../../design_system/icons/ArrowLeft/ArrowLeft";
import PageButton from "../PageButton/PageButton";
import styles from "./ListingResultsPagination.module.css";

export type Pagination = {
  start: number;
  end: number;
  total: number;
  pages: Array<number>;
  currentPage: number;
};

export type ListingResultsPaginationProps = {
  visiblePageAmount?: number;
  onClick: (page: number) => void;
} & Pagination;

const ListingResultsPagination: React.FC<ListingResultsPaginationProps> = ({
  start,
  end,
  total,
  pages,
  currentPage,
  visiblePageAmount = 6,
  onClick
}) => {
  const [morePagesOpen, setMorePagesOpen] = useState(false);

  const visiblePages = pages.slice(0, visiblePageAmount);
  const morePages = pages.slice(visiblePageAmount);
  const morePagesLabel = morePages.includes(currentPage)
    ? String(pages.indexOf(currentPage) + 1)
    : "More";
  const lastPage = pages.at(-1) ?? 0;

  const handlePreviousPageClick = useCallback(() => {
    if (currentPage !== pages[0]) {
      onClick(currentPage - 1);
    }
  }, [currentPage, onClick, pages]);

  const handleNextPageClick = useCallback(() => {
    if (currentPage !== lastPage) {
      onClick(currentPage + 1);
    }
  }, [currentPage, lastPage, onClick]);

  return (
    <div className={styles.listingResultsPagination}>
      {pages.length > 1 && (
        <div className={styles.paginationButtons}>
          <PaginationButton
            title="Previous Page"
            onClick={handlePreviousPageClick}
            disabled={currentPage === pages[0]}
          >
            <ArrowLeft />
          </PaginationButton>
          {visiblePages.map((page, i) => (
            <PageButton
              key={page.toString()}
              pageNumber={i + 1}
              disabled={page === currentPage}
              onClick={() => onClick(page)}
            />
          ))}
          {morePages.length > 0 && (
            <MenuButton
              label={morePagesLabel}
              open={morePagesOpen}
              highlighted={morePages.includes(currentPage)}
              alignRight
              alignBottom
              condensed
              onClick={() => setMorePagesOpen(!morePagesOpen)}
              onClickAway={() => setMorePagesOpen(false)}
            >
              <div className={styles.morePages}>
                {morePages.map((page, i) => (
                  <PageButton
                    key={page.toString()}
                    pageNumber={visiblePages.length + i + 1}
                    disabled={page === currentPage}
                    onClick={() => onClick(page)}
                  />
                ))}
              </div>
            </MenuButton>
          )}
          <PaginationButton
            title="Next Page"
            onClick={handleNextPageClick}
            disabled={currentPage === lastPage}
          >
            <ArrowRight />
          </PaginationButton>
        </div>
      )}
      <p className={styles.resultTotals}>
        {start.toLocaleString()}-{end.toLocaleString()} of{" "}
        {total.toLocaleString()} {total === 1 ? "Result" : "Results"}
      </p>
    </div>
  );
};

export default ListingResultsPagination;
