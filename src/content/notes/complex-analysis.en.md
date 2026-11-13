---
translationKey: complex-analysis
lang: en
title: 'Complex analysis: analyticity, branches and residues'
description: A compact guide connecting holomorphic functions, multivalued functions, monodromy and contour integration.
category: MATHEMATICS
tags: [Complex analysis, Holomorphic functions, Branches, Residues]
date: 2026-11-12
order: 2
draft: false
---

## Why is holomorphicity so powerful?

Complex differentiability is much more restrictive than real differentiability. A function that is complex differentiable at every point of an open set \(U\subset\mathbb C\) is holomorphic. Cauchy's integral formula determines every derivative near a point from values on a surrounding contour:

$$
f^{(n)}(z_0)
=
\frac{n!}{2\pi i}
\oint_\gamma
\frac{f(z)}{(z-z_0)^{n+1}}\,dz.
$$

Consequently, holomorphic functions automatically admit local power-series expansions. This rigidity is the source of many strong results in complex analysis.

## Multivalued functions and analytic continuation

Expressions such as \(\log z\), \(z^\alpha\) and \(\sqrt z\) do not necessarily return to the same analytic value after one turn around the origin. For the logarithm,

$$
\log z
=
\ln|z|+i(\arg z+2\pi k),
\qquad k\in\mathbb Z.
$$

Choosing a branch means selecting a continuous analytic value on a region from which a suitable cut has been removed. Analytic continuation around a branch point may change the value of a function germ; this transformation is called monodromy.

A systematic way to test for branching is to analytically continue a local function germ along a closed loop and check whether it returns to its original value. Fractional powers, logarithmic terms in local expansions and zeros of algebraic discriminants are useful clues when locating branch points.

## Residues and contour integrals

If \(f\) has a Laurent expansion near an isolated singularity \(a\),

$$
f(z)=\sum_{n=-\infty}^{\infty}c_n(z-a)^n,
$$

its residue is \(\operatorname{Res}(f,a)=c_{-1}\). If a closed contour encloses only finitely many isolated singularities, then

$$
\oint_\gamma f(z)\,dz
=
2\pi i
\sum_{a\ \mathrm{inside}\ \gamma}
\operatorname{Res}(f,a),
$$

provided the contour avoids the singularities and the function is otherwise holomorphic on and inside it.

## Uniform convergence and termwise operations

Pointwise convergence controls each fixed point separately. Uniform convergence requires one error bound to work simultaneously over the whole domain. The Weierstrass M-test is a common sufficient condition: if \(|f_n(z)|\le M_n\) and \(\sum M_n\) converges, then \(\sum f_n\) converges uniformly and absolutely.

In complex analysis, the conditions needed to interchange limits with integration, differentiation or holomorphicity are not identical. For example, a sequence of holomorphic functions that converges uniformly on every compact subset of a domain has a holomorphic limit. This is called locally uniform or compact-uniform convergence.
