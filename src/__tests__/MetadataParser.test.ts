import { parseFormatMetadata, parseInfoMetadata, parseNumberMetadata, parseValueType } from "../MetadataParser";
import { expect, test } from "vitest";
import metadataJson from "./field_metadata.json";

import { FieldMetadata, SupplementaryMetadata } from "../index";

test("parse number metadata - A", () => {
  expect(parseNumberMetadata("A")).toStrictEqual({ type: "PER_ALT", separator: "," });
});

test("parse number metadata - R", () => {
  expect(parseNumberMetadata("R")).toStrictEqual({ type: "PER_ALT_AND_REF", separator: "," });
});

test("parse number metadata - G", () => {
  expect(parseNumberMetadata("G")).toStrictEqual({ type: "PER_GENOTYPE", separator: "," });
});

test("parse number metadata - .", () => {
  expect(parseNumberMetadata(".")).toStrictEqual({ type: "OTHER", separator: "," });
});

test("parse number metadata - number 1", () => {
  expect(parseNumberMetadata("1")).toStrictEqual({ type: "NUMBER", count: 1 });
});

test("parse number metadata - number 2", () => {
  expect(parseNumberMetadata("2")).toStrictEqual({ type: "NUMBER", count: 2, separator: "," });
});

test("parse value type - Character", () => {
  expect(parseValueType("Character")).toBe("CHARACTER");
});

test("parse value type - Flag", () => {
  expect(parseValueType("Flag")).toBe("FLAG");
});

test("parse value type - Float", () => {
  expect(parseValueType("Float")).toBe("FLOAT");
});

test("parse value type - Integer", () => {
  expect(parseValueType("Integer")).toBe("INTEGER");
});

test("parse value type - String", () => {
  expect(parseValueType("String")).toBe("STRING");
});

test("parse value type - invalid type", () => {
  expect(() => parseValueType("xx")).toThrow("invalid value type 'xx'");
});

test("parse format metadata", () => {
  const token = '##FORMAT=<ID=DP,Number=1,Type=String,Description="Depth">';
  expect(parseFormatMetadata(token)).toStrictEqual({
    id: "DP",
    number: { type: "NUMBER", count: 1 },
    type: "STRING",
    description: "Depth",
  });
});

test("parse format metadata from json", () => {
  const meta = metadataJson as unknown as SupplementaryMetadata;
  const token =
    '##FORMAT=<ID=VI,Number=.,Type=String,Description="An enumeration of possible inheritance modes based on the pedigree of the sample. Potential values: AD, AD_IP, AR, AR_C, XLR, XLD, YL, MT">';
  expect(parseFormatMetadata(token, meta.format)).toStrictEqual({
    id: "VI",
    number: { type: "OTHER", count: undefined, separator: "," },
    type: "CATEGORICAL",
    categories: [
      {
        id: "AD",
        label: "AD",
        description: "Autosomal dominant",
      },
      {
        id: "AD_IP",
        label: "AD incomplete penetrance",
        description: "Autosomal dominant incomplete penetrance",
      },
      {
        id: "AR",
        label: "AR",
        description: "Autosomal recessive",
      },
      {
        id: "AR_C",
        label: "AR compound hetrozygote",
        description: "Autosomal recessive compound hetrozygote",
      },
      { id: "XLD", label: "XLD", description: "X-linked dominant" },
      {
        id: "XLR",
        label: "XLR",
        description: "X-linked recessive",
      },
      { id: "YL", label: "YL", description: "Y-linked" },
      { id: "MT", label: "MT", description: "Mitochondrial" },
    ],
    label: "Inheritance",
    description: "An enumeration of possible inheritance modes based on the pedigree of the sample",
  });
});

test("parse unnested metadata from json", () => {
  const meta = metadataJson as unknown as SupplementaryMetadata;
  const token = '##INFO=<ID=TEST,Number=.,Type=String,Description="field desc from file">';
  expect(parseInfoMetadata(token, meta.info)).toStrictEqual({
    id: "TEST",
    number: { type: "NUMBER", count: 1, separator: undefined },
    type: "CATEGORICAL",
    categories: [
      {
        id: "1",
        label: "cat1",
        description: "desc1",
      },
      {
        id: "2",
        label: "cat2",
        description: "desc2",
      },
    ],
    label: "Test info",
    description: "Test info field.",
  });
});

test("parse format metadata - invalid", () => {
  expect(() => parseFormatMetadata("xx")).toThrow("invalid format metadata 'xx'");
});

test("parse info metadata", () => {
  const token = '##INFO=<ID=KEY,Number=1,Type=Float,Description="Single Float">';
  expect(parseInfoMetadata(token)).toStrictEqual({
    id: "KEY",
    number: { type: "NUMBER", count: 1 },
    type: "FLOAT",
    description: "Single Float",
  });
});

test("parse info metadata - flag", () => {
  const token = '##INFO=<ID=FL,Number=0,Type=Flag,Description="Flag">';
  expect(parseInfoMetadata(token)).toStrictEqual({
    id: "FL",
    number: { type: "NUMBER", count: 0 },
    type: "FLAG",
    description: "Flag",
  });
});

test("parse info metadata - with source and version", () => {
  const token = '##INFO=<ID=KEY,Number=1,Type=Float,Description="Single Float",Source="Source",Version="12">';
  expect(parseInfoMetadata(token)).toStrictEqual({
    id: "KEY",
    number: { type: "NUMBER", count: 1 },
    type: "FLOAT",
    description: "Single Float",
    source: "Source",
    version: "12",
  });
});

test("parse info metadata - with nested", () => {
  const token =
    '##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: Allele">';
  const expected: FieldMetadata = {
    id: "CSQ",
    number: { type: "OTHER", separator: "," },
    type: "STRING",
    description: "Consequence annotations from Ensembl VEP. Format: Allele",
    nested: {
      separator: "|",
      items: [{ id: "Allele", number: { type: "NUMBER", count: 1 }, type: "STRING" }],
    },
  };
  if (expected.nested) {
    for (const item of expected.nested.items) {
      item.parent = expected;
    }
  }
  expect(parseInfoMetadata(token)).toStrictEqual(expected);
});

test("parse info metadata - invalid", () => {
  expect(() => parseInfoMetadata("xx")).toThrow("invalid info metadata 'xx'");
});
