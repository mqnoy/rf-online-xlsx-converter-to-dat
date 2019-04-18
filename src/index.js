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

/*
const CHECK_HASHES = false;
const IN_PATH = path.resolve(__dirname, "../in");
const OUT_PATH = path.resolve(__dirname, "../out");
const logger = (...messages) => console.info(chalk.blue("[INFO]"), ...messages);

const Props = {
  ["PcRoom".toUpperCase()]: {
    generate: generatePcRoom
  },
  ["ItemLooting".toUpperCase()]: {
    generate: generateItemLooting
  }
};

const files = fs.readdirSync(IN_PATH);

const arrayOfFiles = files
  .filter(name => path.extname(name).toLocaleLowerCase() === ".xlsx")
  .map(name => {
    const ext = path.extname(name);
    const regexp = new RegExp(`^(.+?)${ext}$`, "gi");
    const filename = name.replace(regexp, "$1");
    const inPath = path.resolve(IN_PATH, name);
    const hashPath = path.resolve(IN_PATH, `${name}_hash`);

    return {
      name: filename,
      ext,
      in: inPath,
      out: path.resolve(OUT_PATH, `${filename}.dat`),
      storedHash: (() => {
        if (!CHECK_HASHES) {
          return undefined;
        }
        try {
          if (fs.statSync(hashPath)) {
            return fs.readFileSync(hashPath).toString();
          }
          return undefined;
        } catch (err) {
          return undefined;
        }
      })(),
      hashPath,
      props: Props[filename.toUpperCase()],
      flogger: (...messages) => logger(chalk.cyan(name), ...messages)
    };
  })
  .filter(({ props, flogger }) => {
    if (!props) {
      flogger(chalk.red("ERROR"), "File skipped because props not exists");
    }
    return !!props;
  })
  .map(fileData => {
    const buffer = fs.readFileSync(fileData.in);
    return {
      ...fileData,
      xlsxBuffer: buffer,
      xlsxHash: md5(buffer.toString())
    };
  })
  .filter(fileData => {
    if (fileData.storedHash && fileData.xlsxHash === fileData.storedHash) {
      fileData.flogger("File skipped because hashes are the same");
      return false;
    }
    return true;
  })
  .map(fileData => ({
    ...fileData,
    sheets: (() => {
      fileData.flogger("Reading");
      return xlsx.parse(fileData.xlsxBuffer);
    })()
  }))
  .filter(fileData => {
    const buffers = fileData.props.generate(fileData);
    const totalLen = buffers.reduce((acc, cur) => acc + cur.length, 0);
    fs.writeFileSync(fileData.hashPath, fileData.xlsxHash);
    fileData.flogger(chalk.green("Write done!"), "Total Filesize:", totalLen);
    return true;
  });

logger(chalk.bgWhite.black(`Processed ${arrayOfFiles.length} files.`));
*/
