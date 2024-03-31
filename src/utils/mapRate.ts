export const changeRateColor = (rate: string) => {
  if (rate === 'A') {
    return '#52AC66';
  } else if (rate === 'B' || rate === 'B+') {
    return '#87AE54';
  } else if (rate === 'C' || rate === 'C+') {
    return '#ADAA54';
  } else if (rate === 'D' || rate === 'D+') {
    return '#AD7353';
  } else if (rate === 'F') {
    return '#B15555';
  }
};

export const mapScoreToLabel = (score: number) => {
  if (score >= 4.5) {
    return 'A';
  } else if (score >= 4.0) {
    return 'B+';
  } else if (score >= 3.5) {
    return 'B';
  } else if (score >= 3.0) {
    return 'C+';
  } else if (score >= 2.5) {
    return 'C';
  } else if (score >= 2.0) {
    return 'D+';
  } else {
    return 'D';
  }
};
