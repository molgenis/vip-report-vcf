import { InfoMetadata, NestedFieldMetadata, NumberMetadata, NumberType, ValueType } from "./MetadataParser";
import { Field, NestedMetadata, NestedMetadatas } from "./FieldMetadata";

const REG_EXP_VEP = /Consequence annotations from Ensembl VEP. Format: (.+)/;

export function isVepInfoMetadata(infoMetadata: InfoMetadata): boolean {
  return infoMetadata.description !== undefined && REG_EXP_VEP.test(infoMetadata.description);
}

export function createVepInfoMetadata(infoMetadata: InfoMetadata, meta?: NestedMetadatas): NestedFieldMetadata {
  return {
    separator: "|",
    items: parseVepInfoMetadataArray(infoMetadata, meta),
  };
}

function parseVepInfoMetadataArray(infoMetadata: InfoMetadata, meta?: NestedMetadatas): InfoMetadata[] {
  const token = infoMetadata.description;
  const result = token ? token.match(REG_EXP_VEP) : null;
  if (result === null) {
    throw new Error(`invalid vep info metadata`);
  }

  const tokens = result[1].split("|");
  return tokens.map((part) => parseVepInfoMetadata(infoMetadata, part, meta));
}

function parseVepInfoMetadata(infoMetadata: InfoMetadata, token: string, meta?: NestedMetadatas): InfoMetadata {
  let numberType: NumberType;
  let numberCount;
  let separator: string | undefined;
  let type: ValueType;
  let categories: string[] | undefined;
  let required;
  let label, description: string | undefined;

  const nestedMetadata: NestedMetadata | undefined = meta ? meta["CSQ"] : undefined;
  const fieldMetadata: Field | undefined = nestedMetadata?.nestedFields[token];

  if (fieldMetadata !== undefined) {
    numberType = fieldMetadata.numberType;
    numberCount = fieldMetadata.numberCount;
    separator = fieldMetadata.separator;
    type = fieldMetadata.type;
    required = fieldMetadata.required !== undefined ? fieldMetadata.required : false;
    label = fieldMetadata.label;
    description = fieldMetadata.description;
    categories = fieldMetadata.categories;
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
  if (required) metadata.required = required;
  if (label) metadata.label = label;
  if (description) metadata.description = description;

  return metadata;
}
