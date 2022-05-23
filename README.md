[![Build Status](https://app.travis-ci.com/molgenis/vip-report-vcf.svg?branch=master)](https://app.travis-ci.com/molgenis/vip-report-vcf)

# vip-report-vcf
TypeScript VCF library with support for both reading and writing. Supports parsing of Ensembl VEP annotations.

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
