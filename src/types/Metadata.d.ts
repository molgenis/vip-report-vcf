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
