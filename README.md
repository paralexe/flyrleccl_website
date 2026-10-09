# FlyRLECCL Landing Page & Custom Web Telemetry Engine

## 1. What is FlyRLECCL?
FlyRLECCL is a production-ready, dependency-free C99 library engineered for high-throughput Connected Component Labeling & Analysis (CCL+CCA) in computer vision (embedded systems, medical imaging, document processing). 
* **Zero-allocation architecture:** Pre-allocated memory model for deterministic execution.
* **Performance:** On average up to 5-6× faster than OpenCV (`cv2::connectedComponentsWithStats`) on high-density industrial and medical datasets.

## 2. Web Telemetry & Event Analytics Architecture
This repository contains the official landing page integrated with a custom, zero-dependency client-side telemetry module (`analytics.js`) designed to track behavioral metrics and spatial-temporal section engagement without third-party libraries.

### Key Analytical Features:
* **Declarative Event Taxonomy:** Bottom-Up DOM event delegation using `data-atg` (Analytics Target Group) and `data-ate` (Analytics Target Event) attributes.
* **Spatial-Temporal View Tracking:** High-precision engagement tracking (`time_spent_seconds`) using `IntersectionObserver` and memory-efficient `WeakMap` timestamping.
* **GA4 Integration:** Custom Data Layer initialization with programmatic `gtag.js` injection and clean event parameter mapping (`element_group`, `interaction_type`, `element_id`).
