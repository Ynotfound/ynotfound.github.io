---
translationKey: qft-renormalization
lang: en
title: Renormalization in quantum field theory: a conceptual map
description: A conceptual map of regularization, counterterms and the renormalization group in perturbative quantum field theory.
category: THEORETICAL PHYSICS
tags: [QFT, Renormalization, Feynman diagrams, Renormalization group]
date: 2026-11-12
order: 3
draft: false
---

## Why is renormalization needed?

Feynman diagrams in perturbation theory may contain ultraviolet divergences. Renormalization is not merely a procedure for deleting infinities. It specifies how parameters, fields and observables are defined so that a theory makes finite and comparable predictions within a chosen scheme.

## Regularization and counterterms

First introduce a parameter that controls the divergences. Dimensional regularization, for example, analytically continues spacetime dimension to

[
D=4-2epsilon.
]

An integral then often becomes a Laurent series in (epsilon):

[
I(epsilon)=rac{a_{-2}}{epsilon^2}
+rac{a_{-1}}{epsilon}+a_0+O(epsilon).
]

Counterterms arise from the relation between bare and renormalized parameters in the action. The required counterterms are determined by the symmetries and power counting of the theory; a pole in an individual integral does not by itself determine the physical counterterm.

## The renormalization group

When the renormalization scale (mu) changes, renormalized parameters run. For a coupling (g), define

[
eta(g)=murac{dg}{dmu}igg|_{	ext{bare fixed}}.
]

The beta function describes how the effective coupling changes with scale. Its coefficients depend on the theory, normalization and renormalization scheme, so these conventions must be aligned before comparing calculations.

## Computation and verification

A high-loop calculation should separate graph generation, symmetry factors, integral reduction, master integrals, pole assembly and physical projection. A reliable computational chain should preserve:

- versioned analytic conventions and graph inputs;
- the master-integral basis and reduction identities;
- independent checks of poles and finite parts;
- Ward identities or other symmetry constraints;
- reproducible tests and symbolic or numerical certificates.
