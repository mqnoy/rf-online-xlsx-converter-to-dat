import xlsx from "node-xlsx";

export default function xlsxConverter(buffer) {
  const raw = xlsx.parse(buffer);
  const naming = raw[0].data[0];
  const defaults = raw[0].data[1];
  const rows = raw[0].data.slice(2, raw[0].data.length);
  const results = [];

  rows.forEach((columns, rindex) => {
    const rr = { raw: rindex, prc: rindex, def: rindex };
    const row = { _rowindex: rr, _nindex: rr };

    naming.forEach((name, cindex) => {
      const value = columns[cindex];
      row[name] = {
        raw: value,
        prc: !value ? defaults[cindex] : value,
        def: defaults[cindex]
      };
    });

    results.push(row);
  });

  return { raw, out: { naming, defaults, results } };
}
