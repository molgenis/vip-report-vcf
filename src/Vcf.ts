// this is .ts instead of .d.ts file to work around https://github.com/TypeStrong/ts-loader/issues/1036
import { FormatMetadataContainer, Genotype, RecordSample } from "./SampleDataParser";
import { FieldMetadataContainer, InfoContainer } from "./VcfParser";
import { Metadata as ExternalMetadata } from "./FieldMetadata";

export type { FormatMetadataContainer, Genotype, RecordSample };

export interface Metadata {
  lines: string[];
  info: FieldMetadataContainer;
  format: FormatMetadataContainer;
  samples: string[];
  external?: ExternalMetadata;
}

export interface Container {
  metadata: Metadata;
  data: Record[];
}

export type Record = {
  c: string;
  p: number;
  i: string[];
  r: string;
  a: (string | null)[];
  q: number | null;
  f: string[];
  n: InfoContainer;
  s: RecordSample[];
};
