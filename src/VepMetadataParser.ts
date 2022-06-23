import { InfoMetadata, NestedFieldMetadata, NumberMetadata, NumberType, ValueType } from "./MetadataParser";

const REG_EXP_VEP = /Consequence annotations from Ensembl VEP. Format: (.+)/;

export function isVepInfoMetadata(infoMetadata: InfoMetadata): boolean {
  return infoMetadata.description !== undefined && REG_EXP_VEP.test(infoMetadata.description);
}

export function createVepInfoMetadata(infoMetadata: InfoMetadata): NestedFieldMetadata {
  return {
    separator: "|",
    items: parseVepInfoMetadataArray(infoMetadata),
  };
}

function parseVepInfoMetadataArray(infoMetadata: InfoMetadata): InfoMetadata[] {
  const token = infoMetadata.description;
  const result = token ? token.match(REG_EXP_VEP) : null;
  if (result === null) {
    throw new Error(`invalid vep info metadata`);
  }

  const tokens = result[1].split("|");
  return tokens.map((part) => parseVepInfoMetadata(infoMetadata, part));
}

function parseVepInfoMetadata(infoMetadata: InfoMetadata, token: string): InfoMetadata {
  let numberType: NumberType;
  let numberCount;
  let separator;
  let type: ValueType;
  let categories: string[] | undefined;
  let required = false;
  let label, description;

  switch (token) {
    case "Consequence":
      label = "Effect";
      description = "Effect(s) described as Sequence Ontology term(s)";
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "VIPP":
      label = "VIP path";
      description = "VIP decision tree path";
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "InheritanceModesGene":
      label = "Inh.Pat.";
      description = "Inheritance pattern";
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "CLIN_SIG":
      label = "ClinVar";
      description = "ClinVar classification(s)";
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "clinVar":
      label = "ClinVar ID";
      description = "ClinVar Variation ID";
      numberType = "NUMBER";
      numberCount = 1;
      type = "INTEGER";
      break;
    case "clinVar_CLNSIG":
      label = "ClinVar";
      description = "ClinVar classification(s)";
      numberType = "OTHER";
      separator = "/";
      type = "CATEGORICAL";
      categories = [
        "Benign",
        "Likely_benign",
        "Uncertain_significance",
        "Likely_pathogenic",
        "Pathogenic",
        "Conflicting_interpretations_of_pathogenicity",
      ];
      break;
    case "clinVar_CLNREVSTAT":
      label = "ClinVar status";
      description = "ClinVar review status";
      numberType = "OTHER";
      separator = ",";
      type = "CATEGORICAL";
      categories = [
        "practice_guideline",
        "reviewed_by_expert_panel",
        "criteria_provided",
        "_multiple_submitters",
        "_no_conflicts",
        "_single_submitter",
        "_conflicting_interpretations",
        "no_assertion_criteria_provided",
        "no_assertion_provided",
      ];
      break;
    case "Existing_variation":
    case "FLAGS":
    case "HPO":
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "CAPICE_CL":
      label = "CAPICE";
      description = "CAPICE classification";
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["B", "LB", "VUS", "LP", "P"];
      break;
    case "VKGL_CL":
      label = "VKGL";
      description = "VKGL consensus classification";
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["B", "LB", "VUS", "LP", "P"];
      break;
    case "UMCG_CL":
      label = "MVL";
      description = "UMCG managed variant list classification";
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["B", "LB", "VUS", "LP", "P"];
      break;
    case "Feature_type":
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["Transcript", "RegulatoryFeature", "MotifFeature"];
      required = true;
      break;
    case "IMPACT":
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["LOW", "MODERATE", "HIGH", "MODIFIER"];
      required = true;
      break;
    case "PUBMED":
      label = "PubMed";
      description = "PubMed citations";
      numberType = "OTHER";
      separator = "&";
      type = "INTEGER";
      break;
    case "PHENO":
    case "SOMATIC":
      numberType = "OTHER";
      separator = "&";
      type = "INTEGER";
      break;
    case "gnomAD_HN":
      label = "gnomAD HN";
      description = "gnomAD number of homozygotes";
      numberType = "NUMBER";
      numberCount = 1;
      type = "INTEGER";
      break;
    case "STRAND":
      numberType = "NUMBER";
      numberCount = 1;
      type = "INTEGER";
      break;
    case "CAPICE_SC":
      label = "CAPICE";
      description = "CAPICE pathogenicity score";
      numberType = "NUMBER";
      numberCount = 1;
      type = "FLOAT";
      break;
    case "gnomAD_AF":
      label = "gnomAD AF";
      description = "gnomAD allele frequency";
      numberType = "NUMBER";
      numberCount = 1;
      type = "FLOAT";
      break;
    case "gnomAD_AFR_AF":
    case "gnomAD_AMR_AF":
    case "gnomAD_ASJ_AF":
    case "gnomAD_EAS_AF":
    case "gnomAD_FIN_AF":
    case "gnomAD_NFE_AF":
    case "gnomAD_OTH_AF":
    case "gnomAD_SAS_AF":
    case "PolyPhen":
    case "SIFT":
      numberType = "NUMBER";
      numberCount = 1;
      type = "FLOAT";
      break;
    case "VIPC":
      label = "VIP";
      description = "VIP classification";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    case "VIPL":
      label = "VIP labels";
      description = "VIP decision tree labels";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    case "IncompletePenetrance":
      label = "Inc.Pen.";
      description = "Incomplete Penetrance (1=true)";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    case "SYMBOL":
      label = "Gene";
      description = "Gene symbol";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    case "HGVSc":
      label = "HGVS C";
      description = "HGVS nomenclature: coding DNA reference sequence";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    case "HGVSp":
      label = "HGVS P";
      description = "HGVS nomenclature: protein reference sequence";
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
    default:
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
  }

  const numberMetadata: NumberMetadata = { type: numberType };
  if (numberCount) {
    numberMetadata.count = numberCount;
  }
  if (separator) {
    numberMetadata.separator = separator;
  }
  const metadata: InfoMetadata = {
    id: token,
    number: numberMetadata,
    type,
    parent: infoMetadata,
  };

  if (categories) metadata.categories = categories;
  if (required) metadata.required = required;
  if (label) metadata.label = label;
  if (description) metadata.description = description;

  return metadata;
}
