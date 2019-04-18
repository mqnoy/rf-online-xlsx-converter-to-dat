import path from "path";
import uuid from "uuid/v4";

import { TMP_FOLDER } from "./constants";
import { words } from "./random";

const getTmpPath = () => path.resolve("./", TMP_FOLDER);

const getRandomTmpPath = () => {
  const folders = [uuid(), words(6)];
  return path.resolve(getTmpPath(), folders.join("/"));
};

export { getTmpPath, getRandomTmpPath };
