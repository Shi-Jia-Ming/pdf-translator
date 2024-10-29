export const percentToNumber = (percent: string): string => {
  return (parseInt(percent.replace("%", "")) / 100).toString();
};

export const scaleUp = (value: string, span: number, max: number = 200): string => {
  return (Math.min(parseInt(value.replace("%", "")) + span, max)).toString() + "%";
};

export const scaleDown = (value: string, span: number, min: number = 20): string => {
  return (Math.max(parseInt(value.replace("%", "")) - span, min)).toString() + "%";
};