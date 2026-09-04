import { ProviderResponse } from '../../../types/ai';

export function getDemoCouncilResponses(question: string, mode: string): ProviderResponse[] {
  const qLower = question.toLowerCase();
  const isCoding = mode === 'CODING' || qLower.includes('sort') || qLower.includes('code') || qLower.includes('bug') || qLower.includes('java') || qLower.includes('react');
  const isDebate = mode === 'DEBATE' || qLower.includes('vs') || qLower.includes('compare') || qLower.includes('better');

  if (isCoding) {
    return [
      {
        provider: 'demo-alpha',
        providerName: 'Councilor Alpha (Simulated Algorithmic Engine)',
        model: 'Demo-Model-V1',
        isDemo: true,
        status: 'success',
        responseTime: 850,
        reasoningSummary: 'Favors adaptive algorithmic approaches with minimal overhead for near-sorted distributions.',
        keyClaims: [
          'Insertion Sort achieves linear O(n) runtime on pre-sorted or nearly-sorted arrays.',
          'Adaptive algorithms minimize cache misses compared to recursive divide-and-conquer.',
          'Timsort provides industrial-grade guarantees combining insertion sort and merge sort.'
        ],
        uncertainties: ['Degrades to O(n^2) on reverse-ordered worst-case inputs.'],
        answer: `[Demo Response]
For nearly sorted data, **Insertion Sort** is theoretically and practically one of the best choices because its inner comparison loop terminates early as soon as the element finds its position. This achieves an adaptive **O(n + k)** time complexity where *k* is the number of inversions. When *k* is very small, this approaches true **O(n)** linear time.

Alternatively, **Timsort** (used in Python and Java's Arrays.sort for objects) detects existing ascending runs and uses insertion sort for small sub-runs, guaranteeing O(n) best case and O(n log n) worst case without risking quadratic blowup.`,
      },
      {
        provider: 'demo-beta',
        providerName: 'Councilor Beta (Simulated Systems & Memory Perspective)',
        model: 'Demo-Model-V2',
        isDemo: true,
        status: 'success',
        responseTime: 1120,
        reasoningSummary: 'Highlights cache locality, stability guarantees, and in-place memory constraints.',
        keyClaims: [
          'Standard Quicksort can degrade severely on nearly sorted arrays unless randomized median-of-3 pivoting is used.',
          'HeapSort avoids O(n^2) worst case but exhibits terrible cache locality for nearly sorted data.',
          'Memory overhead of MergeSort (O(n) auxiliary space) is wasteful when data is almost in position.'
        ],
        uncertainties: ['Requires knowing the approximate threshold of displacement (k-sorted array).'],
        answer: `[Demo Response]
From a systems and memory perspective:
1. If the array is **k-sorted** (every element is at most *k* positions away from its target index), a **Min-Heap of size k+1** sorts the collection in **O(n log k)** time with **O(k)** auxiliary memory.
2. Standard Quicksort with naive pivot selection (first or last element) will degrade to catastrophic **O(n²)** on already or nearly sorted arrays.
3. Therefore, unless in-place simple Insertion Sort is chosen for very small k, **Timsort** or **Min-Heap k-sort** is the safest systems recommendation.`,
      },
      {
        provider: 'demo-gamma',
        providerName: 'Councilor Gamma (Simulated Adversarial Critic)',
        model: 'Demo-Model-V3',
        isDemo: true,
        status: 'success',
        responseTime: 940,
        reasoningSummary: 'Questions naive assumptions about input size and stability requirements.',
        keyClaims: [
          'Insertion Sort is non-viable for massive arrays even if nearly sorted if inversion count k is unbounded.',
          'Primitive arrays vs object references dictate whether algorithm stability is required.',
          'Dual-pivot Quicksort with Dutch National Flag partitioning behaves differently than naive implementations.'
        ],
        uncertainties: ['Exact inversion count and hardware cache line size are unknown in abstract questions.'],
        answer: `[Demo Response]
Critique and Nuance:
Many developers reflexively answer 'Insertion Sort', but that can be dangerously slow if the definition of 'nearly sorted' includes even a single outlier shifted from index 0 to index n-1 (which creates O(n) inversions).
Furthermore, one must ask:
- Does the sort need to be **stable**? (Insertion sort and Timsort are stable; Quicksort and Heapsort are not).
- Is the data held entirely in RAM or paged from disk/stream?
The most robust real-world answer is **Timsort**, with specialized **Min-Heap (O(n log k))** if *k* is strictly bounded.`,
      },
    ];
  }

  if (isDebate) {
    return [
      {
        provider: 'demo-alpha',
        providerName: 'Councilor Alpha (Simulated Structural Advocate)',
        model: 'Demo-Model-V1',
        isDemo: true,
        status: 'success',
        responseTime: 790,
        reasoningSummary: 'Defends established architecture and decoupled boundaries.',
        keyClaims: [
          'Decoupled architectures prevent vendor lock-in and allow independent deployment velocity.',
          'Client-heavy SPAs offer maximum interactivity and client cache efficiency.',
        ],
        uncertainties: ['Initial page load performance and SEO trade-offs must be evaluated.'],
        answer: `[Demo Response]
**Position A (Independent & Client-Centric):**
Building with decoupled client SPAs (e.g. Vite + React) maintains strict boundaries between presentation and server APIs. It enables:
- Fast build pipelines and instantaneous client navigation.
- Complete portability across any hosting provider, edge CDN, or static bucket.
- Clear separation of backend concerns without tight coupling to a specific serverless framework runtime.`,
      },
      {
        provider: 'demo-beta',
        providerName: 'Councilor Beta (Simulated Integrated Systems Advocate)',
        model: 'Demo-Model-V2',
        isDemo: true,
        status: 'success',
        responseTime: 1050,
        reasoningSummary: 'Advocates for full-stack unification, zero-waterfall data fetching, and SSR efficiency.',
        keyClaims: [
          'Server Components eliminate client-side waterfall network requests.',
          'Automatic code splitting and streaming SSR improve Core Web Vitals significantly.',
          'Colocated server actions and route handlers streamline end-to-end type safety.'
        ],
        uncertainties: ['Framework churn and complex runtime caching mechanics.'],
        answer: `[Demo Response]
**Position B (Full-Stack Unified Framework):**
Modern integrated frameworks (like Next.js) solve fundamental web bottlenecks:
- Server Components render closer to the database, eliminating JSON over-the-wire serialization overhead and client-side waterfalls.
- SEO and First Contentful Paint (FCP) are optimized out of the box with edge rendering and streaming.
- A single unified deployment model reduces DevOps complexity compared to managing distinct micro-frontends and API gateways.`,
      },
    ];
  }

  // General questions fallback
  return [
    {
      provider: 'demo-alpha',
      providerName: 'Councilor Alpha (Simulated Analytical Logic)',
      model: 'Demo-Model-V1',
      isDemo: true,
      status: 'success',
      responseTime: 810,
      reasoningSummary: 'Provides primary analytical decomposition and first-principles argument.',
      keyClaims: [
        'Fundamental constraints determine optimal strategy.',
        'Direct trade-offs between simplicity, speed, and resilience must be balanced.'
      ],
      uncertainties: ['Contextual deployment specifics and scale.'],
      answer: `[Demo Response]
Analyzing "${question}":
From a first-principles perspective, the primary objective is to optimize for correctness while minimizing operational complexity. Key considerations include:
1. Core mechanics and requirements.
2. Immediate failure modes and mitigating strategies.
3. Scalability under heavy load or unforeseen boundary conditions.`,
    },
    {
      provider: 'demo-beta',
      providerName: 'Councilor Beta (Simulated Pragmatic Systems)',
      model: 'Demo-Model-V2',
      isDemo: true,
      status: 'success',
      responseTime: 970,
      reasoningSummary: 'Focuses on empirical real-world implementations, edge cases, and industry standards.',
      keyClaims: [
        'Empirical evidence shows conventional battle-tested solutions outperform complex novel abstractions.',
        'Observability and maintainability outweigh theoretical micro-optimizations in 95% of use cases.'
      ],
      uncertainties: ['Team expertise and legacy architecture constraints.'],
      answer: `[Demo Response]
Evaluating "${question}" through practical systems experience:
While theoretical models offer high promises, production reality demands:
- Clear debuggability and failure isolation.
- Standardized conventions that team members can maintain without cognitive friction.
- Quantifiable metrics to validate that the chosen approach meets actual service level objectives.`,
    },
  ];
}
