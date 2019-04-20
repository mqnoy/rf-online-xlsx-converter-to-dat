import xlsx from "node-xlsx";

export default function xlsxConverter(buffer) {
  const raw = xlsx.parse(buffer);
  const naming = raw[0].data[0];
  const rows = raw[0].data.slice(1, raw[0].data.length);
  const results = [];

  rows.forEach((columns, rindex) => {
    const row = { _rowindex: rindex, _nindex: rindex };

    naming.forEach((name, cindex) => {
      const value = columns[cindex];
      row[name] = value;
    });

    results.push(row);
  });

  return { raw, out: { naming, results } };
}
