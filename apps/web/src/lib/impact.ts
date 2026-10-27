export const stringifyImpact = (value: number) =>
  value > 0 ? `+${value}` : `${value}`;

export const impactColor = (value: number) => {
  if (value === 0) return "#20adba";
  if (value < -2) return "#c0492e";
  if (value < 0) return "#c0702e";
  if (value > 2) return "#60ba20";
  return "#8c9a0b";
};
