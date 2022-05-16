import { createVepInfoMetadata, isVepInfoMetadata } from "../VepMetadataParser";
import { InfoMetadata } from "../MetadataParser";

const vepInfoMetadata: InfoMetadata = {
  id: "CSQ",
  number: { type: "OTHER", separator: "|" },
  type: "STRING",
  description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
  required: true,
};

test("is vep info metadata", () => {
  expect(isVepInfoMetadata(vepInfoMetadata)).toBe(true);
});

test("is vep info metadata - non CSQ", () => {
  expect(
    isVepInfoMetadata({
      id: "ABC",
      number: { type: "OTHER", separator: "|" },
      type: "STRING",
      description: "Consequence annotations from Ensembl VEP. Format: X|Y",
      required: true,
    })
  ).toBe(true);
});

const infoMetadata: InfoMetadata = {
  id: "ID",
  number: { type: "OTHER", separator: "|" },
  type: "STRING",
  description: "Not VEP",
  required: true,
};

test("is vep info metadata - false", () => {
  expect(isVepInfoMetadata(infoMetadata)).toBe(false);
});

test("create vep metadata", () => {
  expect(createVepInfoMetadata(vepInfoMetadata)).toStrictEqual({
    items: [
      {
        description: "Consequence",
        id: "Consequence",
        number: {
          separator: "&",
          type: "OTHER",
        },
        parent: {
          description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
          id: "CSQ",
          number: { separator: "|", type: "OTHER" },
          type: "STRING",
          required: true,
        },
        type: "STRING",
      },
      {
        description: "PHENO",
        id: "PHENO",
        number: {
          separator: "&",
          type: "OTHER",
        },
        parent: {
          description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
          id: "CSQ",
          number: { separator: "|", type: "OTHER" },
          type: "STRING",
          required: true,
        },
        type: "INTEGER",
      },
      {
        description: "STRAND",
        id: "STRAND",
        number: {
          count: 1,
          type: "NUMBER",
        },
        parent: {
          description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
          id: "CSQ",
          number: { separator: "|", type: "OTHER" },
          type: "STRING",
          required: true,
        },
        type: "INTEGER",
      },
      {
        description: "gnomAD_AF",
        id: "gnomAD_AF",
        number: {
          count: 1,
          type: "NUMBER",
        },
        parent: {
          description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
          id: "CSQ",
          number: { separator: "|", type: "OTHER" },
          type: "STRING",
          required: true,
        },
        type: "FLOAT",
      },
      {
        description: "X",
        id: "X",
        number: {
          count: 1,
          type: "NUMBER",
        },
        parent: {
          description: "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X",
          id: "CSQ",
          number: { separator: "|", type: "OTHER" },
          type: "STRING",
          required: true,
        },
        type: "STRING",
      },
    ],
    separator: "|",
  });
});

test("create vep metadata - invalid", () => {
  expect(() => createVepInfoMetadata(infoMetadata)).toThrow("invalid vep info metadata 'Not VEP'");
});
