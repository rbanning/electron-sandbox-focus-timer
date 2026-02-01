import { castAs, Nullable } from "../types";
import { strHelp } from "./str-help";

export const htmlHelp = {
  findParent
} as const;


function findParent<TResult extends HTMLElement = HTMLElement>(element: HTMLElement, selector: string): Nullable<TResult> {
  if (element) {
    const parent = element.parentElement;
    if (parent) {
      if (selector.startsWith('.')) {
        //check class
        if (parent.classList.contains(selector.substring(1))) {
          return castAs<TResult>(parent); //found
        }
      }
      else if (selector.startsWith('#')) {
        //check id
        if (strHelp.equals(parent.id === selector.substring(1), true)) {
          return castAs<TResult>(parent); //found
        }
      }
      else {
        //check node name
        if (strHelp.equals(parent.nodeName, selector, true)) {
          return castAs<TResult>(parent); //found
        }
      }
      //else traverse up
      return findParent<TResult>(parent, selector);
    }
  }
  //else not found
  return null;
}