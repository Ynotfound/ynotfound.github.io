---
translationKey: hyperlogprocedures
lang: en
title: HyperlogProcedures Rewrite / hlogrs
description: A Rust/C++ software refactoring project for exact transcendental-function and Feynman-integral computations.
category: SCIENTIFIC SOFTWARE
status: active
date: 2026-11-12
tags: [Rust, C++, Symbolic computation, QFT]
repository: https://github.com/Ynotfound/HyperlogProcedures_Rewrite
featured: true
draft: false
---

## Objective

This project refactors computational workflows around HyperlogProcedures, exploring a Rust implementation, modular interfaces, performance improvements and reproducible tests. Its objects of interest include hyperlogarithmic expressions, graph functions, period computations and related symbolic operations.

## Engineering principles

Correctness takes priority over local performance improvements. Each new feature should have tests, benchmark inputs and independent checks. Conversion stages in the computational pipeline must be tested on real data, not only on empty inputs or identity cases.
