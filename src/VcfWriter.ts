import {
  FieldMetadata,
  FieldMetadataContainer,
  Filter,
  FormatMetadataContainer,
  Genotype,
  InfoContainer,
  NestedFieldMetadata,
  RecordSample,
  RecordSampleType,
  Value,
  ValueArray,
  ValueObject,
  VcfContainer,
  VcfMetadata,
  VcfRecord,
} from "./index";
const MISSING = ".";

export function writeVcf(container: VcfContainer, filter: Filter = {}): string {
  const vcf = [];
  vcf.push(writeHeader(container.metadata, filter));

  for (const record of container.data) {
    const line = writeRecord(container.metadata, record, filter);
    vcf.push(line);
  }
  return vcf.join("\n") + "\n";
}

function writeHeader(metadata: VcfMetadata, filter: Filter): string {
  const vcf = [];
  for (const [index, line] of metadata.lines.entries()) {
    if (index !== metadata.lines.length - 1) {
      vcf.push(line);
    } else if (filter.samples !== undefined) {
      if (filter.samples.length === 0) {
        vcf.push(
          line
            .split("\t")
            .filter((token, index) => index <= 7)
            .join("\t"),
        );
      } else {
        vcf.push(
          line
            .split("\t")
            .filter((token, index) => index <= 8 || filter.samples?.indexOf(token) !== -1)
            .join("\t"),
        );
      }
    } else {
      vcf.push(line);
    }
  }
  return vcf.join("\n");
}

function writeRecord(metadata: VcfMetadata, record: VcfRecord, filter: Filter): string {
  const vcf = [];
  vcf.push(writeChr(record.c));
  vcf.push(writePos(record.p));
  vcf.push(writeIds(record.i));
  vcf.push(writeRef(record.r));
  vcf.push(writeAlts(record.a));
  vcf.push(writeQual(record.q));
  vcf.push(writeFilters(record.f));
  vcf.push(writeInfo(metadata.info, record.n));

  const samples = filter.samples ? filterSamples(metadata.samples, record.s, filter.samples) : record.s;
  if (Object.keys(samples).length > 0) {
    const formatKeys = writeFormat(samples);
    vcf.push(formatKeys.length > 0 ? formatKeys.map(writeString).join(":") : MISSING);
    Object.keys(samples).forEach((id) => {
      const sample = samples[Number(id)];
      vcf.push(writeSample(metadata.format, sample as RecordSample, formatKeys));
    });
  }

  return vcf.join("\t");
}

function filterSamples(sampleIds: string[], samples: RecordSample[], filterSampleIds: string[]): RecordSample[] {
  const filterSamples = [];
  for (const [index, sample] of sampleIds.entries()) {
    if (filterSampleIds.indexOf(sample) !== -1) {
      filterSamples.push(samples[index]!);
    }
  }
  return filterSamples;
}

function writeChr(chr: string): string {
  return writeString(chr);
}

function writePos(pos: number): string {
  return pos.toString();
}

function writeIds(ids: string[]): string {
  return ids.length > 0 ? ids.map(writeString).join(";") : MISSING;
}

function writeRef(ref: string): string {
  return writeString(ref);
}

function writeAlts(alts: (string | null)[]): string {
  return alts.length > 0 ? alts.map((alt) => (alt !== null ? writeString(alt) : MISSING)).join(",") : MISSING;
}

function writeQual(quality: number | null): string {
  return quality !== null ? quality.toString() : MISSING;
}

function writeFilters(filters: string[]): string {
  return filters.length > 0 ? filters.map(writeString).join(";") : MISSING;
}

function writeInfo(infoFields: FieldMetadataContainer, infoValues: InfoContainer): string {
  if (Object.keys(infoFields).length === 0) {
    return MISSING;
  }

  const vcf = [];
  for (const infoField of Object.values(infoFields)) {
    if (infoField.id in infoValues) {
      const infoFieldValue = writeInfoField(infoField, infoValues[infoField.id]!);
      if (infoFieldValue !== null) {
        vcf.push(infoFieldValue);
      }
    }
  }
  return vcf.join(";");
}

function writeInfoField(infoField: FieldMetadata, infoValue: Value | ValueArray): string | null {
  let vcf = null;
  if (infoField.number.count === 0) {
    if (infoValue === true) {
      vcf = infoField.id;
    }
  } else if (infoField.number.count === 1) {
    vcf = infoField.id + "=" + writeFieldValueSingle(infoField, infoValue);
  } else {
    vcf = infoField.id + "=" + writeFieldValueMultiple(infoField, infoValue as ValueArray, ",");
  }
  return vcf;
}

function writeFieldValueSingle(field: FieldMetadata, value: Value, missingValue = MISSING): string {
  let vcf;
  if (field.nested) {
    vcf = writeFieldValueNested(field.nested, value as ValueObject);
  } else {
    vcf = writeFieldValue(field, value, missingValue);
  }
  return vcf;
}

function writeFieldValueMultiple(
  field: FieldMetadata,
  values: ValueArray,
  separator: string,
  missingValue = MISSING,
): string {
  const vcf = [];

  for (const infoValue of values) {
    if (field.nested) {
      const separator = field.nested.separator !== undefined ? field.nested.separator : "&";
      vcf.push(writeFieldValueNested(field.nested, infoValue as ValueObject, separator));
    } else {
      vcf.push(writeFieldValue(field, infoValue, missingValue));
    }
  }
  return vcf.join(separator);
}

function writeFieldValueNested(
  nestedField: NestedFieldMetadata,
  nestedValues: ValueObject,
  separator?: string,
): string {
  const vcf = [];
  for (const infoField of nestedField.items) {
    if (nestedValues !== null) {
      if (infoField.number.count === 1) {
        vcf.push(writeFieldValueSingle(infoField, nestedValues[infoField.id]!, ""));
      } else {
        if (!separator) {
          throw new Error(`Missing separator for multiValue field '${infoField}'`);
        }
        const nestedSeparator = infoField.separator !== undefined ? infoField.separator : "&";
        vcf.push(writeFieldValueMultiple(infoField, nestedValues[infoField.id]! as ValueArray, nestedSeparator, ""));
      }
    }
  }
  return vcf.join(nestedField.separator);
}

function writeFieldValue(field: FieldMetadata, value: Value, missingValue: string = MISSING): string {
  let vcf;
  switch (field.type) {
    case "CATEGORICAL":
    case "CHARACTER":
    case "STRING":
      vcf = value !== null ? writeString(value as string) : missingValue;
      break;
    case "FLOAT":
    case "INTEGER":
      vcf = value !== null ? `${value as number}` : missingValue;
      break;
    //FLAG has a value in nested fields like VEP, this function is not called for unnested FLAGs since they have NUMBER=0
    case "FLAG":
      vcf = value !== null ? "1" : "";
      break;
    default:
      throw new Error(`invalid info value type '${field.type}'`);
  }
  return vcf;
}

function writeString(value: string) {
  return value
    .replace("%", "%25")
    .replace(":", "%3A")
    .replace(";", "%3B")
    .replace("=", "%3D")
    .replace(",", "%2C")
    .replace("\r", "%0D")
    .replace("\n", "%0A")
    .replace("\t", "%09");
}

function moveToFirstIndex(arr: string[], item: string): string[] {
  const idx = arr.indexOf(item);

  if (idx > -1) {
    arr.splice(idx, 1);
    arr.unshift(item);
  }

  return arr;
}

function writeFormat(samples: RecordSample[]): string[] {
  let keys: string[] = [];
  for (const sample of samples) {
    for (const key of Object.keys(sample)) {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
  }
  keys = moveToFirstIndex(keys, "GT");
  return keys;
}

//Trailing missing FORMAT values are not required
function removeTrailingEmptyStrings(arr: string[]): string[] {
  let lastNonEmpty = arr.length - 1;
  while (lastNonEmpty >= 0 && (arr[lastNonEmpty] === "" || arr[lastNonEmpty] === MISSING)) {
    lastNonEmpty--;
  }
  return arr.slice(0, lastNonEmpty + 1);
}

function writeSample(formatFields: FormatMetadataContainer, sample: RecordSample, keys: string[]): string {
  const vcf = [];
  for (const key of keys) {
    if (formatFields[key] === undefined) {
      throw new Error(`Unknown FORMAT field '${key}'`);
    }
    const value = sample[key] !== undefined ? sample[key] : "";
    vcf.push(writeSampleValue(formatFields[key], value));
  }
  return removeTrailingEmptyStrings(vcf).join(":");
}

function writeSampleValue(formatField: FieldMetadata, value: RecordSampleType): string {
  let vcf;
  if (formatField.id === "GT") {
    vcf = writeSampleValueGt(formatField, value as Genotype);
  } else {
    if (formatField.number.count === 0) {
      vcf = formatField.id;
    } else if (formatField.number.count === 1) {
      vcf = value !== null ? writeFieldValueSingle(formatField, value as Value) : MISSING;
    } else {
      const valueArray = value as ValueArray;
      vcf = valueArray.length > 0 ? writeFieldValueMultiple(formatField, valueArray, ",") : MISSING;
    }
  }
  return vcf;
}

function writeSampleValueGt(formatField: FieldMetadata, value: Genotype) {
  const vcfValues = value.a.map((alleleIndex) => (alleleIndex != null ? alleleIndex : MISSING));
  return vcfValues.join(value.p ? "|" : "/");
}
