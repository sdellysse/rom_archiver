import { VNode } from "preact";
import { render } from "preact-render-to-string";

export const htmlFrom = (node: VNode): string => {
  return ["<!DOCTYPE HTML>", render(node)].join("");
};
