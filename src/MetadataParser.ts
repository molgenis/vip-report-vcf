import { parseIntegerValueNonNull, parseStringValueNonNull } from "./ValueParser";
import { createVepInfoMetadata, isVepInfoMetadata } from "./VepMetadataParser";
import {
  CategoryRecord,
  FieldMetadata,
  InfoMetadata,
  NestedFieldMetadata,
  NumberMetadata,
  NumberType,
  SupplementaryFieldMetadata,
  SupplementaryFieldMetadataItem,
  SupplementaryFieldMetadataNested,
  SupplementaryFieldMetadataRecord,
  ValueDescription,
  ValueType,
} from "./index";

export function parseNumberMetadata(token: string): NumberMetadata {
  let type: NumberType;
  let count;
  let separator;

  switch (token) {
    case "A":
      type = "PER_ALT";
      separator = ",";
      break;
    case "R":
      type = "PER_ALT_AND_REF";
      separator = ",";
      break;
    case "G":
      type = "PER_GENOTYPE";
      separator = ",";
      break;
    case ".":
      type = "OTHER";
      separator = ",";
      break;
    default:
      type = "NUMBER";
      count = parseIntegerValueNonNull(token);
      if (count > 1) {
        separator = ",";
      }
      break;
  }

  const numberMetaData: NumberMetadata = { type };
  if (separator !== undefined) {
    numberMetaData.separator = separator;
  }
  if (count !== undefined) {
    numberMetaData.count = count;
  }
  return numberMetaData;
}

export function parseValueType(token: string): ValueType {
  let type: ValueType;

  switch (token) {
    case "Character":
      type = "CHARACTER";
      break;
    case "Flag":
      type = "FLAG";
      break;
    case "Float":
      type = "FLOAT";
      break;
    case "Integer":
      type = "INTEGER";
      break;
    case "String":
      type = "STRING";
      break;
    default:
      throw new Error(`invalid value type '${token}'`);
  }

  return type;
}

function isNestedFieldMetadata(identifier: string, meta: SupplementaryFieldMetadataRecord) {
  const supplementaryFieldMetadata = meta[identifier];

  let isNestedFieldMetadata: boolean;
  if (supplementaryFieldMetadata === undefined) {
    isNestedFieldMetadata = false;
  } else {
    // to avoid a metadata model change, use this workaround to distinguish between nested and non-nested items
    isNestedFieldMetadata = Object.hasOwn(supplementaryFieldMetadata, "nestedFields");
  }
  return isNestedFieldMetadata;
}

function parseFieldMetadata(
  identifier: string,
  number: string,
  type: string,
  description: string,
  meta?: SupplementaryFieldMetadataRecord,
): FieldMetadata {
  const parsedIdentifier = parseStringValueNonNull(identifier);
  let parsedNumber: NumberMetadata;
  let parsedType: ValueType;
  let categories: CategoryRecord | undefined;
  let nullValue: ValueDescription | undefined;
  let required;
  let label, parsedDescription: string | undefined;

  if (meta !== undefined && meta[parsedIdentifier] !== undefined && !isNestedFieldMetadata(parsedIdentifier, meta)) {
    const fieldMetadata: SupplementaryFieldMetadata = meta[parsedIdentifier] as SupplementaryFieldMetadataItem;
    parsedNumber = {
      type: fieldMetadata.numberType,
      count: fieldMetadata.numberCount,
      separator: fieldMetadata.separator,
    };
    parsedType = fieldMetadata.type;
    required = fieldMetadata.required !== undefined ? fieldMetadata.required : false;
    label = fieldMetadata.label;
    parsedDescription = fieldMetadata.description;
    categories = fieldMetadata.categories;
    nullValue = fieldMetadata.nullValue;
  } else {
    parsedNumber = parseNumberMetadata(number);
    parsedType = parseValueType(type);
    parsedDescription = parseStringValueNonNull(description);
  }
  const metadata: FieldMetadata = {
    id: parsedIdentifier,
    number: parsedNumber,
    type: parsedType,
  };
  if (categories) metadata.categories = categories;
  if (nullValue) metadata.nullValue = nullValue;
  if (required) metadata.required = required;
  if (label) metadata.label = label;
  if (parsedDescription) metadata.description = parsedDescription;

  const supplementaryFieldMetadataNested = meta !== undefined ? meta[parsedIdentifier] : undefined;
  const nested = parseFieldMetadataNested(metadata, supplementaryFieldMetadataNested);
  if (nested != null) {
    metadata.nested = nested;
  }

  return metadata;
}

//FIXME order might differ
const REG_EXP_FORMAT = /##FORMAT=<ID=(.+?),Number=(.+?),Type=(.+?),Description="(.+?)">/;

/**
 * @param token VCF format header line
 * @param meta VCF format metadata not stored in the VCF e.g. to describe categorical data
 */
export function parseFormatMetadata(token: string, meta?: SupplementaryFieldMetadataRecord): FieldMetadata {
  const result = token.match(REG_EXP_FORMAT);
  if (result === null) {
    throw new Error(`invalid format metadata '${token}'`);
  }
  return parseFieldMetadata(result[1]!, result[2]!, result[3]!, result[4]!, meta);
}

//FIXME order might differ
const REG_EXP_INFO =
  /##INFO=<ID=(.+?),Number=(.+?),Type=(.+?),Description="(.+?)"(?:,Source="(.+?)")?(?:,Version="(.+?)")?>/;

/**
 * @param token VCF info header line
 * @param meta VCF info metadata not stored in the VCF e.g. to describe nested data from VEP
 */
export function parseInfoMetadata(token: string, meta?: SupplementaryFieldMetadataRecord): InfoMetadata {
  const result = token.match(REG_EXP_INFO);
  if (result === null) {
    throw new Error(`invalid info metadata '${token}'`);
  }

  const infoMetadata = parseFieldMetadata(result[1]!, result[2]!, result[3]!, result[4]!, meta) as InfoMetadata;

  const source = result[5];
  if (source !== undefined) {
    infoMetadata.source = source;
  }
  const version = result[6];
  if (version !== undefined) {
    infoMetadata.version = version;
  }

  return infoMetadata;
}

function parseFieldMetadataNested(
  fieldMetadata: FieldMetadata,
  meta?: SupplementaryFieldMetadata,
): NestedFieldMetadata | null {
  let nestedInfoMetadata: NestedFieldMetadata | null;
  if (isVepInfoMetadata(fieldMetadata)) {
    nestedInfoMetadata = createVepInfoMetadata(fieldMetadata, meta as SupplementaryFieldMetadataNested | undefined);
  } else {
    nestedInfoMetadata = null;
  }
  return nestedInfoMetadata;
}
