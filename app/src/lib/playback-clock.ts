// A long frame gap means the animation was suspended or stalled, not watched.
export function activeFrameMilliseconds(
  delta: number,
  visible: boolean,
): number {
  return visible && delta >= 0 && delta <= 250 ? delta : 0;
}
