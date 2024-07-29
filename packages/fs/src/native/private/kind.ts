import Kind from "@rcompat/fs/#/kind";
import exists from "./exists.js";
import stats from "./stats.js";
import is from "@rcompat/invariant/is";

export default async (path: string) => {
  is(path).string();
  is(await exists(path)).true();

  const $stats = await stats(path);

  if ($stats.isFile()) {
    return Kind.File;
  }

  if ($stats.isDirectory()) {
    return Kind.Directory;
  }

  return Kind.Link;
};
