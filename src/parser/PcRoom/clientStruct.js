import Struct from "../../classes/Struct";

export default new Struct().fromSchema1([
  { child: { type: Number, name: "_nindex", len: 32 } },
  { child: { type: Boolean, name: "isUse", len: 32, def: 0 } },

  { child: { type: Number, name: "type1", len: 8, def: -1 }, repeat: 10 },
  { child: { type: Number, name: "type2", len: 8, def: -1 }, repeat: 10 },
  { child: { type: Number, name: "type3", len: 8, def: -1 }, repeat: 10 },
  { child: { type: Number, name: "type4", len: 8, def: -1 }, repeat: 10 },
  { child: { type: Number, name: "type5", len: 8, def: -1 }, repeat: 10 },

  { child: { type: Number, name: "unk1", len: 16, def: 0 } },

  {
    child: { type: String, name: "itm1", len: 32, as: "hex", def: "FFFFFFFF" },
    repeat: 10
  },
  {
    child: { type: String, name: "itm2", len: 32, as: "hex", def: "FFFFFFFF" },
    repeat: 10
  },
  {
    child: { type: String, name: "itm3", len: 32, as: "hex", def: "FFFFFFFF" },
    repeat: 10
  },
  {
    child: { type: String, name: "itm4", len: 32, as: "hex", def: "FFFFFFFF" },
    repeat: 10
  },
  {
    child: { type: String, name: "itm5", len: 32, as: "hex", def: "FFFFFFFF" },
    repeat: 10
  },

  { child: { type: Number, name: "num1", len: 8, def: -1 } },
  { child: { type: Number, name: "num2", len: 8, def: -1 } },
  { child: { type: Number, name: "num3", len: 8, def: -1 } },
  { child: { type: Number, name: "num4", len: 8, def: -1 } },
  { child: { type: Number, name: "num5", len: 8, def: -1 } },

  { child: { type: Number, name: "fixType", len: 8, def: -1 }, repeat: 10 },

  { child: { type: Number, name: "unk2", len: 8, def: 0 } },

  {
    child: {
      type: String,
      name: "fixItm",
      len: 32,
      as: "hex",
      def: "FFFFFFFF"
    },
    repeat: 10
  },
  { child: { type: Number, name: "fixNum", len: 8, def: -1 }, repeat: 10 },

  { child: { type: Number, name: "unk3", len: 16, def: 0 } }
]);
