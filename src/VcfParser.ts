import {
  parseFloatValue,
  parseIntegerValueNonNull,
  parseStringArray,
  parseStringArrayNonNullValues,
  parseStringValueNonNull,
} from "./ValueParser";
import { MISSING } from "./Constants";
import { parseFormatMetadata, parseInfoMetadata } from "./MetadataParser";
import { parseValue } from "./DataParser";
import { parseRecordSample } from "./SampleDataParser";
import {
  FieldMetadata,
  FieldMetadataContainer,
  FormatMetadataContainer,
  InfoContainer,
  RecordSample,
  SupplementaryMetadata as ExternalMetadata,
  VcfContainer,
  VcfMetadata,
  VcfRecord,
} from "./types/Vcf";

const viabFormatMeta: FieldMetadata = {
  id: "VIAB",
  number: { type: "NUMBER", count: 1 },
  type: "FLOAT",
  description: "VIP calculated allele balance",
};

/**
 * @param vcf VCF file contents
 * @param meta additional VCF metadata e.g. to describe categorical or nested data
 */
export function parseVcf(vcf: string, meta?: ExternalMetadata): VcfContainer {
  const container: VcfContainer = {
    metadata: {
      lines: [],
      info: {},
      format: {},
      samples: [],
    },
    data: [],
  };
  if (meta) container.metadata.supplement = meta;

  for (const line of vcf.split(/\r?\n/)) {
    if (line.length !== 0) {
      parseLine(line, container);
    }
  }
  return container;
}

function parseLine(line: string, vcf: VcfContainer) {
  if (line.charAt(0) === "#") {
    vcf.metadata.lines.push(line);

    if (line.charAt(1) === "#") {
      parseMetadataLine(line, vcf.metadata);
    } else {
      parseHeaderLine(line, vcf.metadata);
    }
  } else {
    const record = parseDataLine(line, vcf.metadata);
    vcf.data.push(record);
  }
}

function parseMetadataLine(line: string, metadata: VcfMetadata) {
  if (line.startsWith("##INFO")) {
    const infoMetadata = parseInfoMetadata(line, metadata.supplement?.info);
    metadata.info[infoMetadata.id] = infoMetadata;
  } else if (line.startsWith("##FORMAT")) {
    const formatMetadata = parseFormatMetadata(line, metadata.supplement?.format);
    metadata.format[formatMetadata.id] = formatMetadata;
    if (formatMetadata.id === "AD") {
      metadata.format["VIAB"] = viabFormatMeta;
    }
  }
}

function parseHeaderLine(line: string, metadata: VcfMetadata): void {
  const tokens = line.split("\t");
  metadata.samples = tokens.length > 9 ? tokens.slice(9) : [];
}

function parseDataLine(line: string, metadata: VcfMetadata): VcfRecord {
  const tokens = line.split("\t");
  if (tokens.length < 8) throw new Error(`invalid vcf line '${line}'`);

  return {
    c: parseStringValueNonNull(tokens[0]!),
    p: parseIntegerValueNonNull(tokens[1]!),
    i: parseStringArrayNonNullValues(tokens[2]!, ";"),
    r: parseStringValueNonNull(tokens[3]!),
    a: parseStringArray(tokens[4]!, ","),
    q: parseFloatValue(tokens[5]!),
    f: parseStringArrayNonNullValues(tokens[6]!, ";"),
    n: parseInfoContainer(tokens[7]!, metadata.info),
    s: tokens.length > 8 ? parseRecordSamples(tokens, metadata.format) : [],
  };
}

function parseInfoContainer(token: string, infoMetadataContainer: FieldMetadataContainer): InfoContainer {
  if (token === MISSING) {
    return {};
  }
  const info: InfoContainer = {};
  for (const part of parseStringArray(token, ";", false)) {
    if (part !== null) {
      const idx = part.indexOf("=");
      const key = idx !== -1 ? part.substring(0, idx) : part;
      const value = idx !== -1 ? part.substring(idx + 1) : true.toString();
      const infoMetadata = infoMetadataContainer[key];
      if (infoMetadata === undefined) throw new Error(`invalid info value ${token}`);
      info[key] = parseValue(value, infoMetadata);
    }
  }
  return info;
}

function parseRecordSamples(tokens: string[], formatMetadataContainer: FormatMetadataContainer): RecordSample[] {
  const formatFields = parseStringArrayNonNullValues(tokens[8]!, ":");

  const recordSamples: RecordSample[] = [];
  for (let i = 9; i < tokens.length; ++i) {
    const recordSample = parseRecordSample(tokens[i]!, formatFields, formatMetadataContainer);
    recordSamples.push(recordSample);
  }
  return recordSamples;
}
