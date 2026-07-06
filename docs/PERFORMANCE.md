# KaruviLab Performance Audit

## Bundle Size
Monitored in `BUNDLE_DECISIONS.md`. Initial JS payload aims to be minimal.

## Worker Utilization
CPU-intensive tasks (e.g. hashing, PDF parsing) are offloaded to Web Workers.

## Memory Usage
Max worker concurrency is limited to prevent OOM errors.
