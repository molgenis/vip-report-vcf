export interface VcfContainer {
  metadata: VcfMetadata;
  data: VcfRecord[];
}

export interface VcfMetadata {
  lines: string[];
  info: FieldMetadataContainer;
  format: FormatMetadataContainer;
  samples: string[];
  supplement?: SupplementaryMetadata;
}

export interface VcfRecord {
  c: string;
  p: number;
  i: string[];
  r: string;
  a: (string | null)[];
  q: number | null;
  f: string[];
  n: InfoContainer;
  s: RecordSample[];
}

export interface InfoContainer {
  [index: string]: Value | ValueArray;
}

export interface RecordSample {
  [index: string]: RecordSampleType;
}

export type Value = ValueCharacter | ValueFlag | ValueFloat | ValueInteger | ValueObject | ValueString | ValueArray;
export type ValueArray = Array<Value | Array<Value>>;
export type ValueCharacter = string | null;
export type ValueFlag = boolean | null;
export type ValueFloat = number | null;
export type ValueInteger = number | null;
export type ValueObject = { [key: string]: Value } | null;
export type ValueString = string | null;

export type NumberType = "NUMBER" | "PER_ALT" | "PER_ALT_AND_REF" | "PER_GENOTYPE" | "OTHER";

export interface NumberMetadata {
  type: NumberType;
  count?: number;
  separator?: string;
}

export type ValueType = "CATEGORICAL" | "CHARACTER" | "INTEGER" | "FLAG" | "FLOAT" | "STRING";
export type FieldId = string; // use separate type to ease potential transition to numerical identifiers
export type CategoryId = string; // use separate type to ease potential transition to numerical identifiers
export type CategoryRecord = Record<CategoryId, ValueDescription>;
export type ValueDescription = {
  label: string;
  description?: string;
};

export interface FieldMetadata {
  id: FieldId;
  number: NumberMetadata;
  type: ValueType;
  label?: string;
  description?: string;
  categories?: CategoryRecord;
  required?: boolean;
  nullValue?: ValueDescription;
  nested?: NestedFieldMetadata;
  parent?: FieldMetadata;
}

export interface NestedFieldMetadata {
  separator: string;
  items: FieldMetadata[];
}

export interface InfoMetadata extends FieldMetadata {
  source?: string;
  version?: string;
}

export interface FieldMetadataContainer {
  [key: string]: FieldMetadata;
}

export type RecordSampleType = Genotype | Value;
export type GenotypeAllele = number | null;
export type GenotypeType = "het" | "hom_a" | "hom_r" | "miss" | "part";

export interface Genotype {
  a: GenotypeAllele[];
  p?: boolean;
  t: GenotypeType;
}

export interface FormatMetadataContainer {
  [key: string]: FieldMetadata;
}

/**
 * Metadata that supplements VCF metadata e.g. to describe categorical or nested data
 */
export interface SupplementaryMetadata {
  info: SupplementaryFieldMetadataRecord;
  format: SupplementaryFieldMetadataRecord;
}

// separate type to avoid naming collision with VCF record
export type SupplementaryFieldMetadataRecord = Record<string, SupplementaryFieldMetadata>;
export type SupplementaryFieldMetadata = SupplementaryFieldMetadataItem | SupplementaryFieldMetadataNested;

export interface SupplementaryFieldMetadataItem {
  type: ValueType;
  label: string;
  description: string;
  numberType: NumberType;
  numberCount?: number;
  categories?: CategoryRecord;
  nullValue?: ValueDescription;
  required?: boolean;
  separator?: string;
}

export interface SupplementaryFieldMetadataNested {
  nestedFields: Record<string, SupplementaryFieldMetadataItem>;
}

// vcf writer filter
export type Filter = {
  samples?: string[];
};
