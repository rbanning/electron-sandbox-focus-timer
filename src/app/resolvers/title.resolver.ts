import { ResolveFn } from "@angular/router";
import { strHelp } from "@common/general";
import { environment } from "@src/environments/environment";

export const titleResolver: ResolveFn<string> = (route) => {
  const DELIM = ' • ';
  const name = environment.appTitle;
  const path = route.url.map(m => strHelp.capitalize(m.path, true)).filter(Boolean).join(DELIM);
  return path.length === 0
    ? name
    : `${path} | ${name}`;
}