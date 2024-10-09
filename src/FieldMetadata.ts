import { CategoryRecord, NumberType, ValueDescription, ValueType } from "./MetadataParser";

export interface Metadata {
  info: NestedMetadatas;
  format: NestedFields;
}

export interface NestedMetadatas {
  [index: string]: NestedMetadata;
}

export interface NestedMetadata {
  nestedFields: NestedFields;
}

export interface NestedFields {
  [index: string]: Field;
}

export interface Field {
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
