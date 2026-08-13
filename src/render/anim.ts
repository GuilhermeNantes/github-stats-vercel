export interface AnimOptions {
  beginSec?: number;
  durSec?: number;
  fill?: "freeze" | "remove";
  repeatCount?: string | number;
}

export interface AnimationConfig {
  enabled: boolean;
  stepMs: number;
}

export function beginSec(step: number, stepMs: number): number {
  return (step * stepMs) / 1000;
}

export function durSec(steps: number, stepMs: number): number {
  return Math.max((steps * stepMs) / 1000, 0.05);
}

export function fadeIn(begin: number, dur: number, from = 0, to = 1): string {
  return `
    <animate
      attributeName="opacity"
      from="${from}"
      to="${to}"
      begin="${begin}s"
      dur="${dur}s"
      fill="freeze"
    />
  `;
}

export function widthGrow(
  begin: number,
  dur: number,
  fromWidth: number,
  toWidth: number,
): string {
  return `
    <animate
      attributeName="width"
      from="${fromWidth}"
      to="${toWidth}"
      begin="${begin}s"
      dur="${dur}s"
      fill="freeze"
    />
  `;
}

export function dasharrayGrow(
  begin: number,
  dur: number,
  fromDash: number,
  gap: number,
): string {
  return `
    <animate
      attributeName="stroke-dasharray"
      from="0 ${gap}"
      to="${fromDash} ${gap}"
      begin="${begin}s"
      dur="${dur}s"
      fill="freeze"
    />
  `;
}

export function numberTween(
  begin: number,
  dur: number,
  fromValue: number,
  toValue: number,
  decimals: number = 0,
): string {
  return `
    <animate
      attributeName="data-value"
      from="${fromValue}"
      to="${toValue}"
      begin="${begin}s"
      dur="${dur}s"
      fill="freeze"
    />
  `;
}

export function blink(beginSecVal: number = 0): string {
  return `
    <animate
      attributeName="opacity"
      values="1;0;1;0;1"
      keyTimes="0;0.25;0.5;0.75;1"
      begin="${beginSecVal}s"
      dur="1s"
      repeatCount="indefinite"
    />
  `;
}
