import Struct from "../../classes/Struct";

export default new Struct().fromSchema1([
  { child: { type: Number, name: "_nindex", len: 32 } },
  { child: { type: String, name: "code", len: 60, def: 0 } },
  { child: { type: Boolean, name: "unk1", len: 32, def: 0 } },
  { child: { type: Boolean, name: "isUse", len: 32, def: 0 } },
  { child: { type: String, name: "name", len: 60, def: "---" } },
  { child: { type: Boolean, name: "unk2", len: 32, def: "0" } },

  {
    child: { type: String, len: 8, name: "itmSelect1", def: "-1" },
    repeat: 10
  },
  { child: { type: Number, name: "selNum1", len: 32, def: -1 } },

  {
    child: { type: String, len: 8, name: "itmSelect2", def: "-1" },
    repeat: 10
  },
  { child: { type: Number, name: "selNum2", len: 32, def: -1 } },

  {
    child: { type: String, len: 8, name: "itmSelect3", def: "-1" },
    repeat: 10
  },
  { child: { type: Number, name: "selNum3", len: 32, def: -1 } },

  {
    child: { type: String, len: 8, name: "itmSelect4", def: "-1" },
    repeat: 10
  },
  { child: { type: Number, name: "selNum4", len: 32, def: -1 } },

  {
    child: { type: String, len: 8, name: "itmSelect5", def: "-1" },
    repeat: 10
  },
  { child: { type: Number, name: "selNum5", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix1", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum1", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix2", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum2", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix3", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum3", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix4", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum4", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix5", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum5", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix6", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum6", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix7", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum7", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix8", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum8", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix9", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum9", len: 32, def: -1 } },

  { child: { type: String, name: "itmFix10", len: 8, def: "-1" } },
  { child: { type: Number, name: "fixNum10", len: 32, def: -1 } }
]);
