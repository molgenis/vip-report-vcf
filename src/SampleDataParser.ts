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
  ValueInteger,
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
    if (fieldMetadata.id === "AD") {
      recordSample["VIAB"] = calculateAlleleBalance(recordSample[field] as number[]);
    }
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

/**
 * Calculate allele balance: allele depth of first allele divided by total allele depth
 *
 * @param allelicDepths allele depth values with each value an integer or null
 * @return allele balance or null if 1) allele depth array contains a null value 2) total allele depth is zero
 */
export function calculateAlleleBalance(allelicDepths: ValueInteger[]): ValueInteger {
  if (allelicDepths.includes(null) || allelicDepths.length === 0) {
    return null;
  }
  const total = (allelicDepths as number[]).reduce((x, y) => x + y);
  return total != 0 ? (allelicDepths as number[])[0]! / total : null;
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
