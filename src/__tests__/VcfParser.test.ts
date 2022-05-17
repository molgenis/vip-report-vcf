import { parseVcf } from "../VcfParser";
import { Container } from "../Vcf";
import { ValueArray } from "../ValueParser";
import { expect, test } from "vitest";

// trailing info semicolon placed on purpose
const vcf = `
##fileformat=VCFv4.2
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=H2,Number=0,Type=Flag,Description="HapMap2 membership">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS0
1\t12\t.\tC\tT\t.\tPASS\tDP=2;H2;\tGT\t0/1
`;

test("parse vcf", () => {
  expect(parseVcf(vcf)).toStrictEqual({
    metadata: {
      format: {
        GT: {
          id: "GT",
          description: "Genotype",

          type: "STRING",
          number: {
            count: 1,
            type: "NUMBER",
          },
        },
      },
      info: {
        DP: {
          id: "DP",
          description: "Total Depth",

          type: "INTEGER",
          number: {
            count: 1,
            type: "NUMBER",
          },
        },
        H2: {
          id: "H2",
          description: "HapMap2 membership",

          type: "FLAG",
          number: {
            count: 0,
            type: "NUMBER",
          },
        },
      },
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">',
        '##INFO=<ID=H2,Number=0,Type=Flag,Description="HapMap2 membership">',
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        "#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	S0",
      ],
      samples: ["S0"],
    },
    data: [
      {
        c: "1",
        p: 12,
        i: [],
        r: "C",
        a: ["T"],
        q: null,
        f: ["PASS"],
        n: {
          DP: 2,
          H2: true,
        },
        s: [
          {
            GT: {
              a: [0, 1],
              p: false,
              t: "het",
            },
          },
        ],
      },
    ],
  });
});

const vcfNoSamples = `
##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t12\t.\tC\tT\t1.2\t.\t.
`;

test("parse vcf - no samples", () => {
  expect(parseVcf(vcfNoSamples)).toStrictEqual({
    metadata: {
      format: {},
      info: {},
      lines: ["##fileformat=VCFv4.2", "#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO"],
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 12,
        i: [],
        r: "C",
        a: ["T"],
        q: 1.2,
        f: [],
        n: {},
        s: [],
      },
    ],
  });
});

const vcfWithCSQ = `
##fileformat=VCFv4.2
##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: X|Y|Z">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t12\t.\tC\tT\t.\t.\tCSQ=x0|y0|z0,x1|y1a%2Cy1b|z1,x2|y2|z2

`;

test("parse vcf - escaped nested info values", () => {
  const actual = parseVcf(vcfWithCSQ);
  const expected: Container = {
    metadata: {
      info: {
        CSQ: {
          id: "CSQ",
          number: {
            type: "OTHER",
            separator: ",",
          },

          type: "STRING",
          description: "Consequence annotations from Ensembl VEP. Format: X|Y|Z",
          nested: {
            separator: "|",
            items: [
              {
                id: "X",
                number: {
                  type: "NUMBER",
                  count: 1,
                },

                type: "STRING",

                description: "X",
              },
              {
                id: "Y",
                number: {
                  type: "NUMBER",
                  count: 1,
                },

                type: "STRING",
                description: "Y",
              },
              {
                id: "Z",
                number: {
                  type: "NUMBER",
                  count: 1,
                },

                type: "STRING",
                description: "Z",
              },
            ],
          },
        },
      },
      format: {},
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: X|Y|Z">',
        "#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO",
      ],
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 12,
        i: [],
        r: "C",
        a: ["T"],
        q: null,
        f: [],
        n: {
          CSQ: [
            ["x0", "y0", "z0"],
            ["x1", "y1a,y1b", "z1"],
            ["x2", "y2", "z2"],
          ] as ValueArray,
        },
        s: [],
      },
    ],
  };
  if (expected.metadata.info.CSQ?.nested) {
    for (const item of expected.metadata.info.CSQ.nested.items) {
      item.parent = expected.metadata.info.CSQ;
    }
  }
  expect(actual).toStrictEqual(expected);
});
