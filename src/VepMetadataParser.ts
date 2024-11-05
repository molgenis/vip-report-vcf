import {
  CategoryRecord,
  FieldMetadata,
  InfoMetadata,
  NestedFieldMetadata,
  NumberMetadata,
  NumberType,
  SupplementaryFieldMetadataItem,
  SupplementaryFieldMetadataNested,
  ValueDescription,
  ValueType,
} from "./types/Vcf";

const REG_EXP_VEP = /Consequence annotations from Ensembl VEP. Format: (.+)/;

export function isVepInfoMetadata(fieldMetadata: FieldMetadata): boolean {
  return fieldMetadata.description !== undefined && REG_EXP_VEP.test(fieldMetadata.description);
}

export function createVepInfoMetadata(
  fieldMetadata: FieldMetadata,
  meta?: SupplementaryFieldMetadataNested,
): NestedFieldMetadata {
  return {
    separator: "|",
    items: parseVepInfoMetadataArray(fieldMetadata, meta),
  };
}

function parseVepInfoMetadataArray(
  infoMetadata: InfoMetadata,
  meta?: SupplementaryFieldMetadataNested,
): InfoMetadata[] {
  const token = infoMetadata.description;
  const result = token ? token.match(REG_EXP_VEP) : null;
  if (result === null) {
    throw new Error(`invalid vep info metadata`);
  }

  const tokens = result[1]!.split("|");
  return tokens.map((part) => parseVepInfoMetadata(infoMetadata, part, meta));
}

function parseVepInfoMetadata(
  infoMetadata: InfoMetadata,
  token: string,
  meta?: SupplementaryFieldMetadataNested,
): InfoMetadata {
  let numberType: NumberType;
  let numberCount;
  let separator: string | undefined;
  let type: ValueType;
  let categories: CategoryRecord | undefined;
  let nullValue: ValueDescription | undefined;
  let required;
  let label, description: string | undefined;

  const fieldMetadata: SupplementaryFieldMetadataItem | undefined = meta?.nestedFields[token];

  if (fieldMetadata !== undefined) {
    numberType = fieldMetadata.numberType;
    numberCount = fieldMetadata.numberCount;
    separator = fieldMetadata.separator;
    type = fieldMetadata.type;
    required = fieldMetadata.required !== undefined ? fieldMetadata.required : false;
    label = fieldMetadata.label;
    description = fieldMetadata.description;
    categories = fieldMetadata.categories;
    nullValue = fieldMetadata.nullValue;
  } else {
    numberType = "NUMBER";
    numberCount = 1;
    type = "STRING";
    required = false;
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
  if (nullValue) metadata.nullValue = nullValue;
  if (required) metadata.required = required;
  if (label) metadata.label = label;
  if (description) metadata.description = description;

  return metadata;
}
