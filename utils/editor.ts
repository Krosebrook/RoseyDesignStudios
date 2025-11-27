
/**
 * Calculates a natural language description of a position within a container
 * based on x/y coordinates relative to width/height.
 */
export const getPositionDescription = (x: number, y: number, width: number, height: number): string => {
  let horizontal = 'in the center';
  if (x < width / 3) horizontal = 'on the left';
  else if (x > (width * 2) / 3) horizontal = 'on the right';

  let vertical = '';
  if (y < height / 3) vertical = 'in the background';
  else if (y > (height * 2) / 3) vertical = 'in the foreground';

  return `${vertical} ${horizontal}`.trim();
};
