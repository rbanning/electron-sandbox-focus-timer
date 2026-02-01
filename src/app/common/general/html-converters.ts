import { Nullable } from "../types";
import { primitive } from "./primitive";
import { replaceAll } from "./str-replace-all.utility"

const htmlConversions: Record<string, string> = {
  "&#160;": " ",
  "&amp;": "&",
  //... add any others
}

export function convertHtmlEntities(text: Nullable<string>) {
  if (primitive.isNullish(text)) { return text; }
  
  if (primitive.isString(text)) {
    Object.keys(htmlConversions).forEach(key => {
      text = replaceAll(text as string, key, htmlConversions[key]);
    });
  }
  return text;
}