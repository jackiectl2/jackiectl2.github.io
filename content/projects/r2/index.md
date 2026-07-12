---
title: "EPCOT Foundation Model — TSS-to-Expression Data Pipeline"
summary: "Made a genomic foundation model 2–5× faster to train — and found a 50 kb bug that was quietly wrecking its interpretability."
date: 2026-01-01
tags:
  - Research
---

Pseudobulk pipeline from raw snMultiome (1 bp sparse ATAC → 600 kb HDF5 windows; CP10K-normalized 19,264-gene RNA vectors across 7 cell types). Five bit-equivalent training optimizations for a 2–5× speedup at identical numerics. Reset-head fine-tuning for small-data generalization. Located and fixed a ~50 kb TSS-bin offset.
