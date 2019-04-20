import chalk from "chalk";
import Promise from "bluebird";
import { info, warn, success } from "./utils/logger";
import { getFilesList } from "./parser";
import { IN_PATH } from "./config";

const fs = require("fs");
const path = require("path");
const filesList = getFilesList();

info(
  "Initialized lists",
  Object.values(filesList)
    .map(v => chalk.blue(v.ProcName))
    .join(", ")
);

const files = fs
  .readdirSync(IN_PATH)
  .filter(name => path.extname(name).toLocaleLowerCase() === ".xlsx");

info(
  "Founded",
  chalk.green(files.length),
  "xlsx files in directory",
  files.join(", ")
);

const validFiles = files
  .map(file => {
    const ext = path.extname(file);
    const regexp = new RegExp(`^(.+?)${ext}$`, "gi");
    const name = file.replace(regexp, "$1");
    const inPath = path.resolve(IN_PATH, file);
    const hashPath = path.resolve(IN_PATH, `${file}_hash`);
    const procName = name.toUpperCase();
    const props = filesList[procName];
    return { ext, regexp, name, inPath, hashPath, procName, props };
  })
  .filter(fileData => {
    if (!fileData.props) {
      warn(fileData.name, "skipped, because conv props are not found");
    }
    return !!fileData.props;
  })
  .map(fileData => {
    fileData.xlsx = { buffer: fs.readFileSync(fileData.inPath) };
    fileData.xlsx.converted = fileData.props.converter(fileData.xlsx.buffer);
    info(fileData.name, "success parsed");
    return fileData;
  })
  .filter(fileData => {
    const isValid = fileData.props.validator(fileData.xlsx);
    if (!isValid) {
      warn(fileData.name, "skipped, because schema is incorrect");
    }
    return isValid;
  });

(async () => {
  Promise.mapSeries(validFiles, async fileData => {
    await fileData.props.generator(fileData.xlsx);
    success(fileData.name, "success generated, converted");
  });
})();
