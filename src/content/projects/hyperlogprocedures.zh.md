---
translationKey: hyperlogprocedures
lang: zh
title: HyperlogProcedures Rewrite / hlogrs
description: 面向精确超越函数与费曼积分计算的 Rust/C++ 软件重构项目。
category: SCIENTIFIC SOFTWARE
status: active
date: 2026-11-12
tags: [Rust, C++, Symbolic computation, QFT]
repository: https://github.com/Ynotfound/HyperlogProcedures_Rewrite
featured: true
draft: false
---

## 项目目标

围绕 HyperlogProcedures 的计算流程开展软件重构，探索 Rust 实现、模块化接口、性能改进和可复核测试。关注对象包括超对数表达式、图函数、周期计算与相关符号运算。

## 工程原则

正确性优先于局部性能优化。每个新功能应有测试、基准输入和独立验证；对于计算链中的转换步骤，测试必须覆盖真实数据，而不只是空输入或恒等情形。
