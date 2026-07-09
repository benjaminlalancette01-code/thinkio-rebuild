# Glossary

## Governed Task

A task object with status, authority, dependencies, context boundaries, required evidence, transition rules, and checkpoint behavior.

## Authority

The level of trust a task or artifact currently has. Authority is earned through evidence and review.

## Context Packet

The bounded set of files and task metadata that a model or runtime may use for a specific task.

## Gate

Runtime logic that blocks unsafe promotion or execution.

## Checkpoint

A recorded project state used to preserve evidence, decisions, and restart points.

## Governor

The ThinkIO layer that decides whether work can move, write, execute, or become canonical. The governor is implemented through explicit runtime policy, evidence, approvals, validation, and checkpoints.

## Orchestrator

The runtime path that assembles context, routes work through mode policy, calls model/provider boundaries, receives output, and sends proposed changes through governance. The orchestrator coordinates records; it does not replace the governor.

## Model

An external reasoning or generation provider. A model may suggest, classify, summarize, or propose work, but it does not own ThinkIO state and cannot directly write canonical project files.

## Y-X-Z Vocabulary

Optional conceptual language from earlier identity work. Y-X-Z terms may help describe orientation or perspective in docs, but they are not kernel metrics, task authority fields, or transition rules.
