import type { OpenHouse } from "../../../../types/listing_types";
import type { NextPage } from "next";
import {
  formatOpenHouseDate,
  formatOpenHouseTime
} from "../../../../lib/listing_helpers";
import styles from "./OpenHouseList.module.css";

export interface OpenHouseListProps {
  openHouses: OpenHouse[];
}

const OpenHouseList: NextPage<OpenHouseListProps> = ({ openHouses }) => {
  return (
    <div>
      <h4>Open House</h4>
      <ul className={styles.openHouseList}>
        {openHouses.map(({ start, end }, i) => (
          <li key={i} className={styles.openHouse}>
            <div className={styles.date}>{formatOpenHouseDate(start)}</div>
            <div className={styles.time}>
              {formatOpenHouseTime(start)} to {formatOpenHouseTime(end)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenHouseList;
