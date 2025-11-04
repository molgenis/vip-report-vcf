import { writeVcf } from "../VcfWriter";
import { expect, test } from "vitest";
import { FieldMetadata, VcfContainer } from "../index";

test("write vcf: ID,REF,ALT,QUAL,FILTER", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##FILTER=<ID=q10,Description="Quality below 10">',
        '##FILTER=<ID=q20,Description="Quality below 20">',
        '##FILTER=<ID=PASS,Description="All filters passed">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO",
      ],
      info: {},
      format: {},
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: 25,
        f: ["PASS"],
        n: {},
        s: [],
      },
      {
        c: "1",
        p: 2,
        i: ["id0"],
        r: "A",
        a: ["G", "T"],
        q: 15,
        f: ["q10"],
        n: {},
        s: [],
      },
      {
        c: "1",
        p: 3,
        i: ["id1", "id2"],
        r: "A",
        a: [],
        q: 5.5,
        f: ["q10", "q20"],
        n: {},
        s: [],
      },
      {
        c: "1",
        p: 4,
        i: [],
        r: "A",
        a: ["G", null],
        q: null,
        f: [],
        n: {},
        s: [],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfIdRefAltQualFilter);
});

test("parse and write vcf: Numbers", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=STR_A,Number=A,Type=String,Description="String:A">',
        '##INFO=<ID=STR_R,Number=R,Type=String,Description="String:R">',
        '##INFO=<ID=STR_G,Number=G,Type=String,Description="String:G">',
        '##INFO=<ID=STR_X,Number=.,Type=String,Description="String:X">',
        '##INFO=<ID=STR_1,Number=1,Type=String,Description="String:1">',
        '##INFO=<ID=STR_2,Number=2,Type=String,Description="String:2">',
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0",
      ],
      info: {
        STR_A: {
          id: "STR_A",
          number: {
            type: "PER_ALT",
            separator: ",",
          },
          type: "STRING",
          description: "String:A",
        },
        STR_R: {
          id: "STR_R",
          number: {
            type: "PER_ALT_AND_REF",
            separator: ",",
          },
          type: "STRING",
          description: "String:R",
        },
        STR_G: {
          id: "STR_G",
          number: {
            type: "PER_GENOTYPE",
            separator: ",",
          },
          type: "STRING",
          description: "String:G",
        },
        STR_X: {
          id: "STR_X",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "STRING",
          description: "String:X",
        },
        STR_1: {
          id: "STR_1",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "String:1",
        },
        STR_2: {
          id: "STR_2",
          number: {
            type: "NUMBER",
            separator: ",",
            count: 2,
          },
          type: "STRING",
          description: "String:2",
        },
      },
      format: {
        GT: {
          id: "GT",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "Genotype",
        },
      },
      samples: ["SAMPLE0"],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: [],
        q: null,
        f: [],
        n: {
          STR_R: ["A"],
          STR_G: ["H"],
          STR_X: ["B", "C", "D"],
          STR_1: "E",
          STR_2: ["F", "G"],
        },
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
          },
        ],
      },
      {
        c: "1",
        p: 2,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {
          STR_A: ["A"],
          STR_R: ["B", "C"],
          STR_G: ["J"],
          STR_X: ["D", "E", "F"],
          STR_1: "G",
          STR_2: ["H", "I"],
        },
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
          },
        ],
      },
      {
        id: 1,
        c: "1",
        p: 3,
        i: [],
        r: "A",
        a: ["G", "T"],
        q: null,
        f: [],
        n: {
          STR_A: ["A", "B"],
          STR_R: ["C", "D", "E"],
          STR_G: ["L"],
          STR_X: ["F", "G", "H"],
          STR_1: "I",
          STR_2: ["J", "K"],
        },
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
          },
        ],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfInfoNumber);
});

test("parse and write vcf: Types", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=CHAR,Number=.,Type=Character,Description="Character">',
        '##INFO=<ID=FLAG,Number=0,Type=Flag,Description="Flag">',
        '##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float">',
        '##INFO=<ID=INT,Number=.,Type=Integer,Description="Integer">',
        '##INFO=<ID=STRING,Number=.,Type=String,Description="String">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO",
      ],
      info: {
        CHAR: {
          id: "CHAR",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "CHARACTER",
          description: "Character",
        },
        FLAG: {
          id: "FLAG",
          number: {
            type: "NUMBER",
            count: 0,
          },
          type: "FLAG",
          description: "Flag",
        },
        FLOAT: {
          id: "FLOAT",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "FLOAT",
          description: "Float",
        },
        INT: {
          id: "INT",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "INTEGER",
          description: "Integer",
        },
        STRING: {
          id: "STRING",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "STRING",
          description: "String",
        },
      },
      format: {},
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {
          CHAR: ["X"],
          FLAG: true,
          FLOAT: [1.2],
          INT: [3],
          STRING: ["ABC"],
        },
        s: [],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfInfoType);
});

test("parse and write vcf: Value escaping", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=STRING,Number=.,Type=String,Description="String">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO",
      ],
      info: {
        STRING: {
          id: "STRING",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "STRING",
          description: "String",
        },
      },
      format: {},
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {
          STRING: [":;=%,\r\n\t"],
        },
        s: [],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfInfoTypeStringCornerCases);
});

test("parse and write vcf: Float corner cases", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float corner cases">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO",
      ],
      info: {
        FLOAT: {
          id: "FLOAT",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "FLOAT",
          description: "Float corner cases",
        },
      },
      format: {},
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {
          FLOAT: [Infinity, -Infinity, NaN],
        },
        s: [],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfInfoTypeFloatCornerCasesExpected);
});

test("parse and write vcf: Nested", () => {
  const parent = {
    id: "CSQ",
    number: {
      type: "OTHER",
      separator: ",",
    },
    type: "STRING",
    description:
      "Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|ALLELE_NUM|DISTANCE|STRAND|FLAGS|PICK|SYMBOL_SOURCE|HGNC_ID|REFSEQ_MATCH|REFSEQ_OFFSET|SOURCE|SIFT|PolyPhen|HGVS_OFFSET|CLIN_SIG|SOMATIC|PHENO|PUBMED|CHECK_REF|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS|SpliceAI_pred_DP_AG|SpliceAI_pred_DP_AL|SpliceAI_pred_DP_DG|SpliceAI_pred_DP_DL|SpliceAI_pred_DS_AG|SpliceAI_pred_DS_AL|SpliceAI_pred_DS_DG|SpliceAI_pred_DS_DL|SpliceAI_pred_SYMBOL|CAPICE_CL|CAPICE_SC|IncompletePenetrance|InheritanceModesGene|VKGL_CL|gnomAD|gnomAD_AF|gnomAD_HN",
    nested: {
      separator: "|",
      items: [],
    },
  } as FieldMetadata;

  const items = [
    {
      id: "Allele",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: parent,
    },
    {
      id: "Consequence",
      number: {
        type: "OTHER",
      },
      type: "STRING",
      parent: parent,
    },
    {
      id: "IMPACT",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: parent,
    },
    {
      id: "SYMBOL",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: parent,
    },
    {
      id: "Gene",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: parent,
    },
    {
      id: "Feature_type",
      number: {
        type: "NUMBER",
        count: 1,
      },
      type: "STRING",
      parent: parent,
    },
  ] as FieldMetadata[];
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|ALLELE_NUM|DISTANCE|STRAND|FLAGS|PICK|SYMBOL_SOURCE|HGNC_ID|REFSEQ_MATCH|REFSEQ_OFFSET|SOURCE|SIFT|PolyPhen|HGVS_OFFSET|CLIN_SIG|SOMATIC|PHENO|PUBMED|CHECK_REF|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS|SpliceAI_pred_DP_AG|SpliceAI_pred_DP_AL|SpliceAI_pred_DP_DG|SpliceAI_pred_DP_DL|SpliceAI_pred_DS_AG|SpliceAI_pred_DS_AL|SpliceAI_pred_DS_DG|SpliceAI_pred_DS_DL|SpliceAI_pred_SYMBOL|CAPICE_CL|CAPICE_SC|IncompletePenetrance|InheritanceModesGene|VKGL_CL|gnomAD|gnomAD_AF|gnomAD_HN">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO",
      ],
      info: {
        CSQ: {
          id: "CSQ",
          number: {
            type: "OTHER",
            separator: ",",
          },
          type: "STRING",
          description:
            "Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type",
          nested: {
            separator: "-",
            items: items,
          },
        },
      },
      format: {},
      samples: [],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: ["PASS"],
        n: {
          CSQ: [
            {
              Allele: "G",
              Consequence: ["splice_acceptor_variant", "intro_variant"],
              IMPACT: "HIGH",
              SYMBOL: "SHOX",
              Gene: "6473",
              Feature_type: "Transcript",
            },
            {
              Allele: "G",
              Consequence: ["splice_acceptor_variant"],
              IMPACT: "HIGH",
              SYMBOL: "SHOX",
              Gene: "6473",
              Feature_type: "Transcript",
            },
            {
              Allele: "G",
              Consequence: ["regulatory_region_variant"],
              IMPACT: "MODIFIER",
              SYMBOL: null,
              Gene: null,
              Feature_type: "RegulatoryFeature",
            },
          ],
        },
        s: [],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfInfoNested);
});

test("parse and write vcf: Samples", () => {
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        '##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">',
        '##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">',
        '##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2",
      ],
      info: {},
      format: {
        GT: {
          id: "GT",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "Genotype",
        },
        GQ: {
          id: "GQ",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "INTEGER",
          description: "Genotype Quality",
        },
        HQ: {
          id: "HQ",
          number: {
            type: "NUMBER",
            separator: ",",
            count: 2,
          },
          type: "INTEGER",
          description: "Haplotype Quality",
        },
        AD: {
          id: "AD",
          number: {
            type: "PER_ALT_AND_REF",
            separator: ",",
          },
          type: "INTEGER",
          description: "Allelic depths for the ref and alt alleles in the order listed",
        },
      },
      samples: ["SAMPLE0", "SAMPLE1", "SAMPLE2"],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {},
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
            AD: [1, 50],
            GQ: 1,
            HQ: [2, 3],
          },
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: false,
            },
            AD: [20, 80],
            GQ: null,
            HQ: [4, 5],
          },
          {
            GT: {
              a: [1, 1],
              t: "hom_a",
              p: false,
            },
          },
        ],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(vcfSamples);
});

test("parse and write vcf: Samples filtered", () => {
  const expectedVcfSamples = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE1\tSAMPLE2
1\t1\t.\tA\tG\t.\t.\t.\tGT:AD:GQ:HQ\t0/1:20,80:.:4,5\t1/1
`;
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        '##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">',
        '##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">',
        '##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2",
      ],
      info: {},
      format: {
        GT: {
          id: "GT",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "Genotype",
        },
        GQ: {
          id: "GQ",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "INTEGER",
          description: "Genotype Quality",
        },
        HQ: {
          id: "HQ",
          number: {
            type: "NUMBER",
            separator: ",",
            count: 2,
          },
          type: "INTEGER",
          description: "Haplotype Quality",
        },
        AD: {
          id: "AD",
          number: {
            type: "PER_ALT_AND_REF",
            separator: ",",
          },
          type: "INTEGER",
          description: "Allelic depths for the ref and alt alleles in the order listed",
        },
      },
      samples: ["SAMPLE0", "SAMPLE1", "SAMPLE2"],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {},
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
            AD: [1, 50],
            GQ: 1,
            HQ: [2, 3],
          },
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: false,
            },
            AD: [20, 80],
            GQ: null,
            HQ: [4, 5],
          },
          {
            GT: {
              a: [1, 1],
              t: "hom_a",
              p: false,
            },
          },
        ],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input, { samples: ["SAMPLE1", "SAMPLE2"] })).toBe(expectedVcfSamples);
});

test("parse and write vcf: Samples none", () => {
  const expectedVcfSamples = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\t.
`;
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        '##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">',
        '##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">',
        '##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2",
      ],
      info: {},
      format: {
        GT: {
          id: "GT",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "Genotype",
        },
        GQ: {
          id: "GQ",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "INTEGER",
          description: "Genotype Quality",
        },
        HQ: {
          id: "HQ",
          number: {
            type: "NUMBER",
            separator: ",",
            count: 2,
          },
          type: "INTEGER",
          description: "Haplotype Quality",
        },
        AD: {
          id: "AD",
          number: {
            type: "PER_ALT_AND_REF",
            separator: ",",
          },
          type: "INTEGER",
          description: "Allelic depths for the ref and alt alleles in the order listed",
        },
      },
      samples: ["SAMPLE0", "SAMPLE1", "SAMPLE2"],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {},
        s: [
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: true,
            },
            AD: [1, 50],
            GQ: 1,
            HQ: [2, 3],
          },
          {
            GT: {
              a: [0, 1],
              t: "het",
              p: false,
            },
            AD: [20, 80],
            GQ: null,
            HQ: [4, 5],
          },
          {
            GT: {
              a: [1, 1],
              t: "hom_a",
              p: false,
            },
          },
        ],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input, { samples: [] })).toBe(expectedVcfSamples);
});

test("parse and write vcf: Samples missing values", () => {
  const expectedVcfSamplesMissingValues = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2
1\t1\t.\tA\tG\t.\t.\t.\tGT:GQ:HQ\t.|1:1\t0/.:2:1\t1/1
`;

  // both ".,." and "." are valid MISSING values for HQ, see VCF v4.5 specs in 1.6.2 Genotype fields
  const input = {
    metadata: {
      lines: [
        "##fileformat=VCFv4.2",
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">',
        '##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">',
        '##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">',
        "##contig=<ID=1,length=249250621,assembly=b37>",
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2",
      ],
      info: {},
      format: {
        GT: {
          id: "GT",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "STRING",
          description: "Genotype",
        },
        HQ: {
          id: "HQ",
          number: {
            type: "NUMBER",
            separator: ",",
            count: 2,
          },
          type: "INTEGER",
          description: "Haplotype Quality",
        },
        GQ: {
          id: "GQ",
          number: {
            type: "NUMBER",
            count: 1,
          },
          type: "INTEGER",
          description: "Genotype Quality",
        },
      },
      samples: ["SAMPLE0", "SAMPLE1", "SAMPLE2"],
    },
    data: [
      {
        c: "1",
        p: 1,
        i: [],
        r: "A",
        a: ["G"],
        q: null,
        f: [],
        n: {},
        s: [
          {
            GT: {
              a: [null, 1],
              t: "part",
              p: true,
            },
            GQ: 1,
          },
          {
            GT: {
              a: [0, null],
              t: "part",
              p: false,
            },
            HQ: [1],
            GQ: 2,
          },
          {
            GT: {
              a: [1, 1],
              t: "hom_a",
              p: false,
            },
          },
        ],
      },
    ],
  } as VcfContainer;
  expect(writeVcf(input)).toBe(expectedVcfSamplesMissingValues);
});

const vcfIdRefAltQualFilter = `##fileformat=VCFv4.2
##FILTER=<ID=q10,Description="Quality below 10">
##FILTER=<ID=q20,Description="Quality below 20">
##FILTER=<ID=PASS,Description="All filters passed">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t25\tPASS\t.
1\t2\tid0\tA\tG,T\t15\tq10\t.
1\t3\tid1;id2\tA\t.\t5.5\tq10;q20\t.
1\t4\t.\tA\tG,.\t.\t.\t.
`;

const vcfInfoNumber = `##fileformat=VCFv4.2
##INFO=<ID=STR_A,Number=A,Type=String,Description="String:A">
##INFO=<ID=STR_R,Number=R,Type=String,Description="String:R">
##INFO=<ID=STR_G,Number=G,Type=String,Description="String:G">
##INFO=<ID=STR_X,Number=.,Type=String,Description="String:X">
##INFO=<ID=STR_1,Number=1,Type=String,Description="String:1">
##INFO=<ID=STR_2,Number=2,Type=String,Description="String:2">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0
1\t1\t.\tA\t.\t.\t.\tSTR_R=A;STR_G=H;STR_X=B,C,D;STR_1=E;STR_2=F,G\tGT\t0|1
1\t2\t.\tA\tG\t.\t.\tSTR_A=A;STR_R=B,C;STR_G=J;STR_X=D,E,F;STR_1=G;STR_2=H,I\tGT\t0|1
1\t3\t.\tA\tG,T\t.\t.\tSTR_A=A,B;STR_R=C,D,E;STR_G=L;STR_X=F,G,H;STR_1=I;STR_2=J,K\tGT\t0|1
`;

const vcfInfoType = `##fileformat=VCFv4.2
##INFO=<ID=CHAR,Number=.,Type=Character,Description="Character">
##INFO=<ID=FLAG,Number=0,Type=Flag,Description="Flag">
##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float">
##INFO=<ID=INT,Number=.,Type=Integer,Description="Integer">
##INFO=<ID=STRING,Number=.,Type=String,Description="String">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tCHAR=X;FLAG;FLOAT=1.2;INT=3;STRING=ABC
`;

const vcfInfoTypeStringCornerCases = `##fileformat=VCFv4.2
##INFO=<ID=STRING,Number=.,Type=String,Description="String">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tSTRING=%3A%3B%3D%25%2C%0D%0A%09
`;

const vcfInfoTypeFloatCornerCasesExpected = `##fileformat=VCFv4.2
##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float corner cases">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tFLOAT=Infinity,-Infinity,NaN
`;

const vcfInfoNested = `##fileformat=VCFv4.2
##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|ALLELE_NUM|DISTANCE|STRAND|FLAGS|PICK|SYMBOL_SOURCE|HGNC_ID|REFSEQ_MATCH|REFSEQ_OFFSET|SOURCE|SIFT|PolyPhen|HGVS_OFFSET|CLIN_SIG|SOMATIC|PHENO|PUBMED|CHECK_REF|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS|SpliceAI_pred_DP_AG|SpliceAI_pred_DP_AL|SpliceAI_pred_DP_DG|SpliceAI_pred_DP_DL|SpliceAI_pred_DS_AG|SpliceAI_pred_DS_AL|SpliceAI_pred_DS_DG|SpliceAI_pred_DS_DL|SpliceAI_pred_SYMBOL|CAPICE_CL|CAPICE_SC|IncompletePenetrance|InheritanceModesGene|VKGL_CL|gnomAD|gnomAD_AF|gnomAD_HN">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\tPASS\tCSQ=G-splice_acceptor_variant&intro_variant-HIGH-SHOX-6473-Transcript,G-splice_acceptor_variant-HIGH-SHOX-6473-Transcript,G-regulatory_region_variant-MODIFIER---RegulatoryFeature
`;

const vcfSamples = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles in the order listed">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2
1\t1\t.\tA\tG\t.\t.\t.\tGT:AD:GQ:HQ\t0|1:1,50:1:2,3\t0/1:20,80:.:4,5\t1/1
`;
