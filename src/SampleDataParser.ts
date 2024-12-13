import { parseValue } from "./DataParser";
import { parseIntegerValue } from "./ValueParser";
import {
  FieldMetadata,
  FormatMetadataContainer,
  Genotype,
  GenotypeAllele,
  GenotypeType,
  RecordSample,
  RecordSampleType,
  Value,
  ValueArray,
} from "./index";

export function parseRecordSample(
  token: string,
  formatFields: string[],
  formatMetadataContainer: FormatMetadataContainer,
): RecordSample {
  const parts = token.split(":");
  if (formatFields.length < parts.length) throw new Error(`invalid value '${token}'`);

  const recordSample: RecordSample = {};
  for (let i = 0; i < parts.length; ++i) {
    const field = formatFields[i]!;
    const fieldMetadata = formatMetadataContainer[field];
    if (fieldMetadata === undefined) throw new Error(`unknown format field '${field}'`);

    recordSample[field] = parseFormatValue(parts[i]!, fieldMetadata);
  }
  return recordSample;
}

export function parseFormatValue(token: string, formatMetadata: FieldMetadata): RecordSampleType {
  let value: Genotype | Value | ValueArray;
  if (formatMetadata.id === "GT") {
    value = parseGenotype(token);
  } else {
    value = parseValue(token, formatMetadata);
  }
  return value;
}

export function parseGenotype(token: string): Genotype {
  const alleles = token.split(/[|/]/).map((index) => parseIntegerValue(index));

  const genotype: Genotype = {
    a: alleles,
    t: determineGenotypeType(alleles),
  };
  if (alleles.length > 1) {
    genotype.p = token.indexOf("|") !== -1;
  }
  return genotype;
}

export function determineGenotypeType(alleles: GenotypeAllele[]): GenotypeType {
  let type: GenotypeType;
  if (alleles.every((allele) => allele === null)) {
    type = "miss";
  } else if (alleles.some((allele) => allele === null)) {
    type = "part";
  } else if (alleles.every((allele) => allele === 0)) {
    type = "hom_r";
  } else if (alleles.every((allele) => allele === alleles[0])) {
    type = "hom_a";
  } else {
    type = "het";
  }
  return type;
}
