---
translationKey: feynman-periods
lang: en
title: 'Feynman integrals and periods: a geometric viewpoint'
description: A first map of the geometric information encoded by parametric representations, Symanzik polynomials and differential equations.
category: MATHEMATICAL PHYSICS
tags: [Feynman integrals, Periods, Geometry, QFT]
date: 2026-11-12
order: 1
draft: false
---

## What is this note about?

A Feynman integral is often treated as an integral whose value must be computed. Yet its integrand, integration domain and parameter dependence are structured by the topology of the underlying graph. Understanding this structure helps explain why some graphs lead to multiple zeta values, while others involve elliptic curves or more complicated geometry.

## From graphs to parametric integrals

Let \(G\) be a connected graph with edge set \(E\), and introduce Schwinger parameters \(\alpha_e\). Under suitable assumptions on propagator powers and kinematics, momentum-space integrals can be rewritten as parametric integrals. Their denominators are controlled by the first and second Symanzik polynomials:

$$
\mathcal U_G(\alpha)
=
\sum_{T\ \mathrm{spanning\ tree}}
\prod_{e\notin T}\alpha_e,
$$

$$
\mathcal F_G(\alpha)
=
\sum_{F=T_1\cup T_2}
q_F^2\prod_{e\notin F}\alpha_e
+
\mathcal U_G(\alpha)\sum_{e\in E}m_e^2\alpha_e.
$$

The first sum runs over spanning trees and the second over spanning two-forests. The momentum \(q_F\) is induced by the external momentum flow across the cut defined by the two-forest. Sign conventions depend on the Euclidean or Minkowski convention and on how the mass terms are defined.

For a four-dimensional scalar theory, a parametric integral may schematically contain a factor such as

$$
I_G \sim
\int_{\alpha_e\geq 0}
\frac{\Omega}{\mathcal U_G^{\,2}}.
$$

This is only a schematic fragment: propagator powers, the overall scale, kinematic factors and subtraction terms have been suppressed. The actual exponents depend on the dimension, loop number and propagator indices.

## Why does geometry appear?

The equations \(\mathcal U_G=0\) and \(\mathcal F_G=0\) define algebraic hypersurfaces in parameter space. The singularities, parameter dependence and analytic continuation of the integral are therefore related to the geometry of these algebraic varieties.

A practical route of investigation is:

1. Compute the graph's Symanzik polynomials.
2. Choose kinematic variables and differentiate the integral with respect to them.
3. Search for Picard–Fuchs-type differential equations.
4. Study singular points, monodromy representations and boundary conditions.
5. Determine whether the resulting periods belong to a multiple-zeta, elliptic or more complicated class.

The degree of a polynomial or the visual appearance of a graph is not, by itself, enough to establish its period class. Geometric identification requires additional evidence, such as elimination, factorization, differential equations or period calculations.

## From mathematical structure back to physics

A geometric classification is useful only if it affects computable objects. It may help to:

- predict suitable function spaces and integral bases;
- construct differential equations and boundary conditions;
- identify thresholds, cuts and monodromy;
- connect graph geometry to UV subgraphs, forest subtraction and the renormalization group.

A reliable research record should state definitions, assumptions, derivations, independent checks and unresolved issues. Numerical agreement can reveal a relation, but it cannot replace a general proof.
