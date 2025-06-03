import type { NextPage } from "next";
import { useMemo } from "react";
import uniq from "lodash/uniq";
import styles from "./PlacePredictionText.module.css";

export interface PlacePredictionTextProps {
  prediction: google.maps.places.AutocompletePrediction;
}

const getSubStringObjs = (
  matches: google.maps.places.PredictionSubstring[],
  str: string
) => {
  const matchOffsets = matches.flatMap(({ offset, length }) => [
    offset,
    offset + length
  ]);
  const allOffsets = uniq([0, ...matchOffsets, str.length]);
  const allOffsetPairs = allOffsets
    .slice(1)
    .map((end, i) => [allOffsets[i], end]);
  return allOffsetPairs.map(([start, end]) => {
    const text = str.substring(start, end);
    const match = !!matches.find(
      ({ offset, length }) => offset === start && offset + length === end
    );
    return { text, match };
  });
};

const PlacePredictionText: NextPage<PlacePredictionTextProps> = ({
  prediction
}) => {
  const mainTextSubstrings = useMemo(() => {
    const { main_text_matched_substrings, main_text } =
      prediction.structured_formatting;
    if (!main_text_matched_substrings) {
      return [{ text: main_text, match: false }];
    }
    return getSubStringObjs(main_text_matched_substrings, main_text);
  }, [prediction.structured_formatting]);

  return (
    <span className="placesPredictionText">
      <span className={styles.mainText}>
        {mainTextSubstrings.map((substringMatch) => (
          <span
            key={substringMatch.text}
            className={substringMatch.match ? styles.matched : ""}
          >
            {substringMatch.text}
          </span>
        ))}
      </span>
      <span className={styles.secondaryText}>
        {prediction.structured_formatting.secondary_text}
      </span>
    </span>
  );
};

export default PlacePredictionText;
