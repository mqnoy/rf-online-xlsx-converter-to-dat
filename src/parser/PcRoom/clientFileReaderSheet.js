import Field from "../../classes/Field";
import { COUNT, BLOCK_SIZE } from "../../classes/constants";

import Struct from "./clientStruct";

const Header = [
  new Field({ name: COUNT, type: Number, len: 32 }),
  new Field({ name: BLOCK_SIZE, type: Number, len: 32 })
];

export default [{ header: Header, block: Struct }].map((p, i) => ({
  ...p,
  type: `c${i}`
}));
