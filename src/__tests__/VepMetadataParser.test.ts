import { createVepInfoMetadata, isVepInfoMetadata } from "../VepMetadataParser";
import { expect, test } from "vitest";
import metadataJson from "./field_metadata.json";

import { InfoMetadata, SupplementaryFieldMetadataNested, SupplementaryMetadata } from "../types/Vcf";

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
    }),
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
  const meta = metadataJson as unknown as SupplementaryMetadata;
  expect(createVepInfoMetadata(vepInfoMetadata, meta.info["CSQ"] as SupplementaryFieldMetadataNested)).toStrictEqual({
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
        description: "The strand of the gene (0=- 1=+).",
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
          {
            id: "Benign",
            label: "Benign",
          },
          {
            id: "Likely_benign",
            label: "Likely benign",
          },
          {
            id: "Uncertain_significance",
            label: "Uncertain significance",
            description: "Variant of uncertain significance",
          },
          {
            id: "Likely_pathogenic",
            label: "Likely pathogenic",
          },
          {
            id: "Pathogenic",
            label: "Pathogenic",
          },
          {
            id: "Conflicting_interpretations_of_pathogenicity",
            label: "Conflicting",
            description: "Conflicting interpretations of pathogenicity",
          },
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
          {
            id: "Benign",
            label: "Benign",
          },
          {
            id: "Likely_benign",
            label: "Likely benign",
          },
          {
            id: "Uncertain_significance",
            label: "Uncertain significance",
            description: "Variant of uncertain significance",
          },
          {
            id: "Likely_pathogenic",
            label: "Likely pathogenic",
          },
          {
            id: "Pathogenic",
            label: "Pathogenic",
          },
          {
            id: "Conflicting_interpretations_of_pathogenicity",
            label: "Conflicting interpretations",
            description: "Conflicting interpretations of pathogenicity",
          },
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
          {
            id: "practice_guideline",
            label: "Practice guideline",
            description: "There is a submitted record with a classification from a practice guideline",
          },
          {
            id: "reviewed_by_expert_panel",
            label: "Reviewed by expert panel",
            description: "There is a submitted record with a classification from an expert panel",
          },
          {
            id: "criteria_provided",
            label: "Criteria provided",
            description: "Assertion criteria and evidence for the classification (or a public contact) were provided",
          },
          {
            id: "_multiple_submitters",
            label: "Multiple submitters",
            description: "There are multiple submitted records with a classification",
          },
          {
            id: "_no_conflicts",
            label: "No conflicts",
            description: "The classifications agree",
          },
          {
            id: "_single_submitter",
            label: "Single submitter",
            description: "There is a single submitted record with a classification",
          },
          {
            id: "_conflicting_interpretations",
            label: "Conflicting_interpretations",
            description: "There are conflicting classifications",
          },
          {
            id: "no_assertion_criteria_provided",
            label: "No assertion criteria provided",
            description:
              "There are one or more submitted records with a classification but without assertion criteria and evidence for the classification (or a public contact)",
          },
          {
            id: "no_assertion_provided",
            label: "No assertion provided",
          },
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
