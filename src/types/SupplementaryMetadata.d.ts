import { CategoryRecord, NumberType, ValueDescription, ValueType } from "./Metadata";

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
  nestedFields: SupplementaryFieldMetadataNestedRecord;
}

// separate type to avoid naming collision with VCF record
export type SupplementaryFieldMetadataNestedRecord = Record<string, SupplementaryFieldMetadataItem>;
