---
title: 量子场论中的重整化：概念地图
title_en: 'Renormalization in quantum field theory: a conceptual map'
description: 从正则化、反项与重整化群理解高阶微扰计算的组织方式。
description_en: A conceptual map of regularization, counterterms and the renormalization group in perturbative quantum field theory.
category: THEORETICAL PHYSICS
tags: [QFT, Renormalization, Feynman diagrams, Renormalization group]
date: 2026-11-12
order: 3
draft: false
---

## 为什么需要重整化？

微扰展开中的费曼图可能包含紫外发散。重整化并不是简单地把无穷大“减掉”，而是规定如何定义参数、场和可观测量，使理论在给定方案下产生有限且可比较的预测。

## 正则化与反项

先引入一个控制发散的正则化参数。例如维数正规化把时空维数延拓为

\[
D=4-2\epsilon.
\]

积分通常变成关于 \(\epsilon\) 的 Laurent 级数：

\[
I(\epsilon)=\frac{a_{-2}}{\epsilon^2}
+\frac{a_{-1}}{\epsilon}+a_0+O(\epsilon).
\]

反项来自作用量中裸参数与重整化参数之间的关系。具体需要哪些反项，由理论的对称性和幂次计数决定；不能仅凭某个积分出现极点就独立决定物理反项。

## 重整化群

改变重整化尺度 \(\mu\) 时，重整化参数随之变化。对耦合常数 \(g\)，定义

\[
\beta(g)=\mu\frac{dg}{d\mu}\bigg|_{\text{bare fixed}}.
\]

Beta 函数描述有效耦合随尺度的变化。它的系数依赖理论、规范化和重整化方案；在比较不同计算时，必须先统一这些约定。

## 计算与验证

高圈计算通常需要把图生成、对称因子、积分约化、主积分计算、极点装配和物理投影分开处理。可靠的计算链应包含：

- 解析约定和输入图集的版本；
- 主积分基与积分约化关系；
- 极点及有限部的独立检查；
- Ward 恒等式或其他对称性约束；
- 可重复运行的测试与数值/符号证书。

## English summary

Renormalization defines finite parameters and observables from regularized perturbative expressions. The beta function describes the scale dependence of renormalized couplings. In high-loop work, graph generation, integral reduction, master integrals, pole assembly and physical projection should be separate, independently testable stages.
