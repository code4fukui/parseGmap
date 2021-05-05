import { TSV } from "https://js.sabae.cc/TSV.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { YAML } from "https://js.sabae.cc/YAML.js";
import { Table } from "https://js.sabae.cc/Table.js";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";
import { parseGmap } from "./parseGmap.js";

const data = TSV.decode(await Deno.readTextFile("./urls.tsv")).splice(1);

const ll2geo3x3 = (ll) => {
    return Geo3x3.encode(ll[0], ll[1], 20);
};
const list = data.map(url => ll2geo3x3(parseGmap(url[0])));
console.log(list, list.length);

let idx = 0;
const list2 = data.map(url => {
    const ll = parseGmap(url[0]);
    const geo3x3 = ll2geo3x3(ll);
    return {
        title: ++idx,
        lat: ll[0],
        lng: ll[1],
        zoom: 19,
        geo3x3,
        description: `<a href=https://geo3x3.com/#${geo3x3}>${geo3x3}</a>`,
    };
});
console.log(list2);

const tbl = Table.fromJSON(list2);
await Deno.writeTextFile("points.tsv", TSV.encode(tbl));
await Deno.writeTextFile("points.csv", CSV.encode(tbl));

const yml = YAML.dump(list2);
await Deno.writeTextFile("points.yml", yml);
console.log(yml);

const title = "越前市国高地区";
const html = 
`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${title}</title>
<script type="module" src="https://optgeo.github.io/s/module.js"></script>
</head>
<body>
<script type="text/yaml">
title: ${title}
accessToken: pk.eyJ1IjoiZ2VvcmVwdWJsaWMiLCJhIjoiY2tvMm53aWsxMTFiajJycGdyOXR4MW9iMiJ9.h7aSUinQuXd8EFRSWJvBPQ
style: https://optgeo.github.io/b3p/style.json
chapters:
${yml}
footer: >-
    <p>DATA: <a href=points.tsv>TSV</a> / <a href=points.csv>CSV</a> / <a href=points.yml>YAML</a></p>
    <p><a href='https://github.com/optgeo'>Adopt Geodata プロジェクト</a>を活用しています。</p>
</script>
</body>
</html>
`;
await Deno.writeTextFile("points.html", html);
