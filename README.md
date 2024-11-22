[![Build Status](https://app.travis-ci.com/molgenis/vip-report-vcf.svg?branch=main)](https://app.travis-ci.com/molgenis/vip-report-vcf)

# vip-report-vcf

TypeScript VCF library with support for both reading and writing.

- Supports parsing of nested data such as Ensembl VEP annotations
- Optionally supply a supplementary metadata.json to describe
    - Categorical values
    - Required values
    - Null values

# Usage

```ts
import { parseVcf } from "../VcfParser";
import { writeVcf } from "../VcfWriter";

const vcf = `
##fileformat=VCFv4.2
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=H2,Number=0,Type=Flag,Description="HapMap2 membership">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS0
1\t12\t.\tC\tT\t.\tPASS\tDP=2;H2;\tGT\t0/1
`;

const parsedVcf = parseVcf(vcf);

console.log(writeVcf(parsedVcf));
```

## Supplementary metadata

Optionally supply a supplementary metadata.json when parsing VCF:

```ts
import { parseVcf } from "../VcfParser";

const metadata: SupplementaryMetadata = {
  format: {
    IP: {
      label: "Inheritance",
      description: "Inheritance pattern",
      numberType: "OTHER",
      separator: ",",
      type: "CATEGORICAL",
      categories: {
        0: { label: "AD", description: "Autosomal dominant" },
        1: { label: "AR", description: "Autosomal recessive" },
      },
      nullValue: { label: "Unknown", description: "Inheritance pattern unknown" },
    },
  },
  info: {
    CL: {
      label: "Classification",
      description: "Variant classification",
      numberType: "NUMBER",
      numberCount: 1,
      type: "CATEGORICAL",
      categories: {
        B: { label: "Benign" },
        LB: { label: "Likely benign" },
        VUS: { label: "Variant of uncertain significance" },
        LP: { label: "Likely pathogenic" },
        P: { label: "Pathogenic" },
      },
      required: true,
    },
  },
};

const vcf = `
##fileformat=VCFv4.2
##INFO=<ID=CL,Number=1,Type=STRING,Description="Classification">
##FORMAT=<ID=IP,Number=.,Type=String,Description="Inheritance pattern">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS0
1\t12\t.\tC\tT\t.\tPASS\tCL=P\tIP\t0
`;

const parsedVcf = parseVcf(vcf, metadata);
console.log(parsedVcf.data);
console.log(parsedVcf.metadata);
```

results in

```
[{"c":"1","p":12,"i":[],"r":"C","a":["T"],"q":null,"f":["PASS"],"n":{"CL":"P"},"s":[{"IP":["0"]}]}]
<prints metadata object here>
```

Note that currently the metadata is not used in any way when parsing VCF, but only stored in the output container for
usage in downstream tools. 