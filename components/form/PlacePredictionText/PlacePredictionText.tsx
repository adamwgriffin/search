import { useMemo } from "react";
import uniq from "lodash/uniq";
import styles from "./PlacePredictionText.module.css";

export type PlacePredictionTextProps = {
  prediction: google.maps.places.PlacePrediction;
};

const getSubStringObjs = (
  matches: google.maps.places.StringRange[],
  str: string
) => {
  const matchOffsets = matches.flatMap(({ startOffset, endOffset }) => [
    startOffset,
    endOffset
  ]);
  const allOffsets = uniq([0, ...matchOffsets, str.length]);
  const allOffsetPairs = allOffsets
    .slice(1)
    .map((end, i) => [allOffsets[i], end]);
  return allOffsetPairs.map(([start, end]) => {
    const text = str.substring(start, end);
    const match = !!matches.find(
      ({ startOffset, endOffset }) => startOffset === start && endOffset === end
    );
    return { text, match };
  });
};

const PlacePredictionText: React.FC<PlacePredictionTextProps> = ({
  prediction
}) => {
  // mainText can be null, in which case we fall back to the full text
  const mainText = prediction.mainText ?? prediction.text;
  const mainTextSubstrings = useMemo(() => {
    if (mainText.matches.length === 0) {
      return [{ text: mainText.text, match: false }];
    }
    return getSubStringObjs(mainText.matches, mainText.text);
  }, [mainText]);

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
        {prediction.secondaryText?.text}
      </span>
    </span>
  );
};

export default PlacePredictionText;
