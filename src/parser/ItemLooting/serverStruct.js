import Struct from "../../classes/Struct";

export default new Struct().fromSchema1([
  { child: { type: Number, name: "_nindex", len: 32 } },
  { child: { type: String, name: "monster", len: 64, def: "00000" } },
  { child: { type: Number, name: "chanse", len: 32, def: 0 } },
  { child: { type: Number, name: "loottime", len: 32, def: 0 } },
  { child: { type: Number, name: "count", len: 32, def: 0 } },
  { child: { type: Number, name: "num", len: 32, def: 0 } },
  ...Array.from(Array(200)).map((_, i) => ({
    child: { type: String, name: (i + 1).toString(), len: 8, def: 0 }
  }))
]);
