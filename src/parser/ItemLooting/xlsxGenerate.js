import fs from "fs-extra";
import path from "path";
import BufferGenerator from "../../classes/BufferGenerator";
import Struct from "../../classes/Struct";
import serverReaderSheet from "./serverFileReaderSheet";

import { OUT_PATH } from "../../config";

import {
  TOTAL_SIZE,
  BLOCK_SIZE,
  COUNT,
  COUNT_COLUMNS
} from "../../classes/constants";

const getHeaderValues = ({ block, objects = [] }) => ({
  [TOTAL_SIZE]: block.getWeight() * objects.length + 8,
  [BLOCK_SIZE]: block.getWeight(),
  [COUNT]: objects.length,
  [COUNT_COLUMNS]: block.getFields().length
});

export default function generator({
  converted: {
    out: { results }
  }
}) {
  const { header, block } = serverReaderSheet[0];
  const bufferGenerator = new BufferGenerator();
  const blockFields = block.getFields();
  const headerFields = header instanceof Struct ? header.getFields() : header;

  const objects = results;
  const headerValues = getHeaderValues({ block, objects });

  headerFields.forEach(field =>
    bufferGenerator.addByField(field, headerValues[field.getName()])
  );

  const buffers = [];
  objects.forEach((object, rindex) => {
    const buffer = new BufferGenerator();
    blockFields.forEach((field, cindex) => {
      buffer.addByField(field, object[field.getName()].prc);
    });
    buffers.push(buffer.getBuffer());
  });

  bufferGenerator.concat(...buffers);
  const buffer = bufferGenerator.getBuffer();

  const serverScriptPath = path.resolve(OUT_PATH, "Server/Script");
  const serverScriptFilePath = path.resolve(
    serverScriptPath,
    "ItemLooting.dat"
  );

  fs.ensureDirSync(serverScriptPath);
  fs.writeFileSync(serverScriptFilePath, buffer);

  return [{ filePath: serverScriptFilePath, buffer }];
}
