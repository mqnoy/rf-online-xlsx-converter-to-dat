import fs from "fs-extra";
import path from "path";
import BufferGenerator from "../../classes/BufferGenerator";
import Struct from "../../classes/Struct";
import serverReaderSheet from "./serverFileReaderSheet";
import clientReaderSheet from "./clientFileReaderSheet";

import { errorPrc } from "../../utils/logger";
import { OUT_PATH } from "../../config";

import {
  TOTAL_SIZE,
  BLOCK_SIZE,
  COUNT,
  COUNT_COLUMNS
} from "../../classes/constants";

import { getClientCodeByServerCode } from "../../utils/converters";
import { getFinitesByServerCode } from "../itemTypesUtils";
import { enCryptByBuf } from "../../utils/edf";

const getHeaderValues = ({ block, objects = [] }) => ({
  [TOTAL_SIZE]: block.getWeight() * objects.length + 8,
  [BLOCK_SIZE]: block.getWeight(),
  [COUNT]: objects.length,
  [COUNT_COLUMNS]: block.getFields().length
});

function converServerObjectToClientDataSheet(object) {
  const clientSheet = { ...object, unk3: { raw: 0, prc: 0, def: 0 } };
  const def = "FFFFFFFF";

  function convertItemSelectCodes() {
    [
      ...Array.from(Array(10)).map((_, i) => [1, i + 1]),
      ...Array.from(Array(10)).map((_, i) => [2, i + 1]),
      ...Array.from(Array(10)).map((_, i) => [3, i + 1]),
      ...Array.from(Array(10)).map((_, i) => [4, i + 1]),
      ...Array.from(Array(10)).map((_, i) => [5, i + 1])
    ].forEach(v => {
      const [group, n] = v;

      const fieldName = `itmSelect${group}_${n}`;
      const fieldValue = object[fieldName];
      const isValidServerCode =
        typeof fieldValue.prc === "string" && fieldValue.prc.length === 7;

      const clientCode = isValidServerCode
        ? getClientCodeByServerCode(fieldValue.prc)
        : null;

      const clientTypes = isValidServerCode
        ? getFinitesByServerCode(fieldValue.prc)
        : null;

      if (clientTypes !== null && clientTypes.length > 1) {
        throw new Error(`Too many finites by code ${fieldValue.prc}`);
      }

      clientSheet[`type${group}_${n}`] = {
        raw: clientTypes !== null ? clientTypes[0] : -1,
        prc: clientTypes !== null ? clientTypes[0] : -1,
        def: 0
      };

      clientSheet[`itm${group}_${n}`] = {
        raw: fieldValue.prc,
        prc: !clientCode ? def : clientCode,
        def
      };
    });

    [1, 2, 3, 4, 5].forEach(group => {
      const num = parseInt(object[`selNum${group}`].prc, 10);
      clientSheet[`num${group}`] = { raw: num, prc: !num ? 0 : num, def: 0 };
    });
  }

  function convertItemFixSelectCodes() {
    Array.from(Array(10)).forEach((_, i) => {
      const n = i + 1;
      const codeFieldName = `itmFix${n}`;
      const numFieldName = `fixNum${n}`;
      const codeFieldValue = object[codeFieldName];
      const numFieldValue = object[numFieldName];

      const isValidServerCode =
        typeof codeFieldValue.prc === "string" &&
        codeFieldValue.prc.length === 7;

      const clientCode = isValidServerCode
        ? getClientCodeByServerCode(codeFieldValue.prc)
        : null;

      const clientTypes = isValidServerCode
        ? getFinitesByServerCode(codeFieldValue.prc)
        : null;

      if (clientTypes !== null && clientTypes.length > 1) {
        throw new Error(`Too many finites by code ${codeFieldValue.prc}`);
      }

      clientSheet[`fixType_${n}`] = {
        raw: clientTypes !== null ? clientTypes[0] : -1,
        prc: clientTypes !== null ? clientTypes[0] : -1,
        def: 0
      };

      clientSheet[`fixItm_${n}`] = {
        raw: codeFieldValue.prc,
        prc: !clientCode ? def : clientCode,
        def
      };

      clientSheet[`fixNum_${n}`] = numFieldValue;
    });
  }

  convertItemSelectCodes();
  convertItemFixSelectCodes();

  return clientSheet;
}

async function generateClient({
  converted: {
    out: { results }
  }
}) {
  const { header, block } = clientReaderSheet[0];
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
    const processedObject = converServerObjectToClientDataSheet(object);
    blockFields.forEach((field, cindex) => {
      try {
        buffer.addByField(field, processedObject[field.getName()].prc);
      } catch (err) {
        errorPrc("PcRoom", "ClientConv", "PrcErrorStack", field.getName());
        throw err;
      }
    });
    buffers.push(buffer.getBuffer());
  });

  bufferGenerator.concat(...buffers);

  function createDat() {
    const buffer = bufferGenerator.getBuffer();
    const outPath = path.resolve(OUT_PATH, "Client/dat/DataTable");
    const outFilePath = path.resolve(outPath, "ItemPremium.dat");

    fs.ensureDirSync(outPath);
    fs.writeFileSync(outFilePath, buffer);
    return { filePath: outFilePath, buffer };
  }

  async function createEdf() {
    const buffer = await enCryptByBuf(bufferGenerator.getBuffer());
    const outPath = path.resolve(OUT_PATH, "Client/edf/DataTable");
    const outFilePath = path.resolve(outPath, "ItemPremium.edf");

    fs.ensureDirSync(outPath);
    fs.writeFileSync(outFilePath, buffer);
    return { filePath: outFilePath, buffer };
  }

  return [await createDat(), await createEdf()];
}

export default async function generator({
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
      try {
        buffer.addByField(field, object[field.getName()].prc);
      } catch (err) {
        errorPrc("PcRoom", "ServerConv", "PrcErrorStack", field.getName());
        throw err;
      }
    });
    buffers.push(buffer.getBuffer());
  });

  bufferGenerator.concat(...buffers);
  const buffer = bufferGenerator.getBuffer();

  const outPath = path.resolve(OUT_PATH, "Server/Script");
  const outFilePath = path.resolve(outPath, "PcRoom.dat");

  fs.ensureDirSync(outPath);
  fs.writeFileSync(outFilePath, buffer);

  const clientResults = await generateClient({
    converted: { out: { results } }
  });

  return [{ filePath: outFilePath, buffer }, ...clientResults];
}
