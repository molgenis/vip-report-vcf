import { createVepInfoMetadata, isVepInfoMetadata } from "../VepMetadataParser";
import { InfoMetadata } from "../MetadataParser";
import { expect, test } from "vitest";

const vepInfoMetadata: InfoMetadata = {
  id: "CSQ",
  number: { type: "OTHER", separator: "|" },
  type: "STRING",
  description:
    "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
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
  console.log(createVepInfoMetadata(vepInfoMetadata).items[0].parent);
  expect(createVepInfoMetadata(vepInfoMetadata)).toStrictEqual({
    separator: "|",
    items: [
      {
        id: "Consequence",
        number: { type: "OTHER", separator: "&" },
        type: "STRING",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        label: "Effect",
        description: "Effect(s) described as Sequence Ontology term(s)",
      },
      {
        id: "PHENO",
        description: "Phenotype match.",
        label: "Pheno",
        number: { type: "OTHER", separator: "&" },
        type: "INTEGER",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
      },
      {
        id: "STRAND",
        description: "The strand of the gene.",
        label: "Strand",
        number: { type: "NUMBER", count: 1 },
        type: "INTEGER",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
      },
      {
        id: "gnomAD_AF",
        number: { type: "NUMBER", count: 1 },
        type: "FLOAT",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        label: "gnomAD AF",
        description: "gnomAD allele frequency",
      },
      {
        id: "X",
        number: { type: "NUMBER", count: 1 },
        type: "STRING",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
      },
      {
        id: "clinVar",
        number: { type: "OTHER" },
        type: "INTEGER",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        label: "ClinVar ID",
        description: "ClinVar Variation ID",
      },
      {
        id: "clinVar_CLNSIG",
        number: { type: "OTHER", separator: "/" },
        type: "CATEGORICAL",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        categories: [
          "Benign",
          "Likely_benign",
          "Uncertain_significance",
          "Likely_pathogenic",
          "Pathogenic",
          "Conflicting_interpretations_of_pathogenicity",
        ],
        label: "ClinVar variant",
        description: "Clinical significance for this single variant",
      },
      {
        id: "clinVar_CLNSIGINCL",
        number: { type: "OTHER", separator: "&" },
        type: "CATEGORICAL",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        categories: [
          "Benign",
          "Likely_benign",
          "Uncertain_significance",
          "Likely_pathogenic",
          "Pathogenic",
          "Conflicting_interpretations_of_pathogenicity",
        ],
        label: "ClinVar variant combination",
        description: "Clinical significance for a haplotype or genotype that includes this variant",
      },
      {
        id: "clinVar_CLNREVSTAT",
        number: { type: "OTHER", separator: "&" },
        type: "CATEGORICAL",
        parent: {
          id: "CSQ",
          number: { type: "OTHER", separator: "|" },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Consequence|PHENO|STRAND|gnomAD_AF|X|clinVar|clinVar_CLNSIG|clinVar_CLNSIGINCL|clinVar_CLNREVSTAT",
          required: true,
        },
        categories: [
          "practice_guideline",
          "reviewed_by_expert_panel",
          "criteria_provided",
          "_multiple_submitters",
          "_no_conflicts",
          "_single_submitter",
          "_conflicting_interpretations",
          "no_assertion_criteria_provided",
          "no_assertion_provided",
        ],
        label: "ClinVar status",
        description: "ClinVar review status",
      },
    ],
  });
});

test("create vep metadata - invalid", () => {
  expect(() => createVepInfoMetadata(infoMetadata)).toThrow("invalid vep info metadata");
});
