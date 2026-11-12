---
title: 复分析：解析性、分支与留数
title_en: 'Complex analysis: analyticity, branches and residues'
description: 一份连接解析函数、多值函数、单值化与复积分的复分析导览。
description_en: A compact guide connecting holomorphic functions, multivalued functions, monodromy and contour integration.
category: MATHEMATICS
tags: [Complex analysis, Holomorphic functions, Branches, Residues]
date: 2026-11-12
order: 2
draft: false
---

## 解析性为什么强？

复可微比实可微严格得多。若函数在开集 \(U\subset\mathbb C\) 上处处复可微，则它是全纯函数。Cauchy 积分公式意味着函数在一个点附近的全部导数，都由边界上的函数值决定：

\[
f^{(n)}(z_0)=\frac{n!}{2\pi i}
\oint_\gamma\frac{f(z)}{(z-z_0)^{n+1}}\,dz.
\]

因此全纯函数自动具有局部幂级数展开。这种刚性是复分析许多强结论的来源。

## 多值函数与解析延拓

像 \(\log z\)、\(z^\alpha\) 和 \(\sqrt{z}\) 这样的表达式，不能在绕原点一圈后仍保持同一个解析值。以对数为例：

\[
\log z=\ln|z|+i(\arg z+2\pi k),\qquad k\in\mathbb Z.
\]

选择一个分支，相当于在去掉适当割线的区域上连续选取一个解析值。绕分支点做解析延拓，函数值可能发生变化；这种变化称为 monodromy（单值群作用）。

判断分支点时，一个系统方法是：考察沿闭合回路解析延拓后的函数芽是否回到原值。局部展开中的分数次幂、对数项，以及代数方程判别式的零点，都是寻找分支点的重要线索。

## 留数与围道积分

若 \(f\) 在孤立奇点 \(a\) 附近有 Laurent 展开

\[
f(z)=\sum_{n=-\infty}^{\infty}c_n(z-a)^n,
\]

则留数定义为 \(\operatorname{Res}(f,a)=c_{-1}\)。若闭曲线内部只有有限个孤立奇点，则

\[
\oint_\gamma f(z)\,dz
=2\pi i\sum_{a\ \mathrm{inside}\ \gamma}
\operatorname{Res}(f,a),
\]

前提是曲线不经过奇点，并且函数在曲线及其内部除这些孤立奇点外解析。

## 一致收敛与逐项运算

逐点收敛只保证每个固定点的函数值收敛；一致收敛则要求同一个误差界对整个定义域同时成立。对函数项级数 \(\sum f_n\)，Weierstrass M 判别法给出一个常用充分条件：若 \(|f_n(z)|\le M_n\) 且 \(\sum M_n\) 收敛，则函数项级数一致且绝对收敛。

在复分析中，还要注意积分、求导和解析性所需的具体条件并不完全相同。例如，全纯函数列若在区域的每个紧子集上一致收敛，则极限仍全纯；这称为局部一致收敛或紧致一致收敛。

## English summary

Holomorphicity imposes strong rigidity through Cauchy's integral formula. Multivalued functions are understood through local branches and analytic continuation; monodromy records how a function germ changes around loops. Residues extract the coefficient of \((z-a)^{-1}\), while uniform convergence supplies the control needed for reliable limiting operations.
