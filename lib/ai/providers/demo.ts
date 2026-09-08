import { ProviderResponse } from '../../../types/ai';

export function getDemoCouncilResponses(question: string, mode: string): ProviderResponse[] {
  const qLower = question.toLowerCase();
  const isCoding = mode === 'CODING' || qLower.includes('sort') || qLower.includes('code') || qLower.includes('bug') || qLower.includes('java') || qLower.includes('react') || qLower.includes('array') || qLower.includes('linked list');
  const isDebate = mode === 'DEBATE' || qLower.includes('vs') || qLower.includes('compare') || qLower.includes('better');
  const isArrayVsLinkedList = qLower.includes('array') && qLower.includes('linked list');

  if (isArrayVsLinkedList) {
    return [
      {
        provider: 'gemini',
        providerName: 'Google Gemini (Simulated)',
        model: 'gemini-3.8-flash (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 820,
        reasoningSummary: 'Analyzes memory contiguity, random access O(1), and cache line prefetching.',
        keyClaims: [
          'Arrays store contiguous elements in RAM, enabling O(1) index arithmetic.',
          'Modern CPU caches prefetch contiguous array data with near-zero cache misses.',
          'Linked lists incur pointer overhead (8 bytes per node on 64-bit) and pointer chasing.'
        ],
        uncertainties: ['Dynamic array reallocation amortized cost vs node allocation overhead.'],
        answer: `### Core Structural Distinction
An **Array** is a linear data structure that stores elements in **contiguous memory locations**. This enables true $O(1)$ constant-time random access via direct memory offset indexing:
$$\\text{Address}(A[i]) = \\text{Base} + i \\times \\text{sizeof}(\\text{element})$$

In contrast, a **Linked List** is composed of disjoint nodes scattered across the heap, each containing data and a pointer/reference to the next node:
- **Random Access:** $O(n)$ because the runtime must traverse pointer chains.
- **Cache Locality:** Arrays benefit enormously from hardware CPU L1/L2 cache prefetching (spatial locality). Linked lists suffer from frequent cache misses ("pointer chasing").`
      },
      {
        provider: 'openai',
        providerName: 'OpenAI GPT (Simulated)',
        model: 'gpt-4o-mini (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 950,
        reasoningSummary: 'Evaluates insertion and deletion complexity at boundaries and arbitrary positions.',
        keyClaims: [
          'Inserting at head of singly-linked list is O(1) without shifting.',
          'Inserting into middle of array requires shifting n - i elements: O(n).',
          'Inserting into middle of linked list requires O(n) search + O(1) pointer adjustment.'
        ],
        uncertainties: ['Frequency of reallocations in ArrayList/std::vector vs custom pool allocators.'],
        answer: `### Insertion & Deletion Mechanics

| Operation | Array / Vector | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Access by Index** | **$O(1)$** | $O(n)$ | $O(n)$ |
| **Insert/Delete at Head** | $O(n)$ (shifts all) | **$O(1)$** | **$O(1)$** |
| **Insert/Delete at Tail** | $O(1)$ amortized | $O(n)$ ($O(1)$ with tail ptr) | **$O(1)$** with tail ptr |
| **Insert in Middle** | $O(n)$ (shifting) | $O(n)$ traversal + $O(1)$ swap | $O(n)$ traversal + $O(1)$ swap |

**Key Takeaway:** While linked lists theoretically insert in $O(1)$ once you hold the node reference, finding that reference from an index requires an $O(n)$ walk.`
      },
      {
        provider: 'anthropic',
        providerName: 'Anthropic Claude (Simulated)',
        model: 'claude-3-5-sonnet (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 1040,
        reasoningSummary: 'Focuses on memory fragmentation, heap allocator overhead, and practical ergonomics.',
        keyClaims: [
          'Node overhead in 64-bit JVM or C++: each node costs 16-24 bytes of metadata + pointer.',
          'Memory fragmentation occurs with thousands of individual heap allocations.',
          'Real-world benchmarks show Arrays (e.g. std::vector) outperform linked lists even for many insertions due to cache lines.'
        ],
        uncertainties: ['Specialized intrusive linked lists or lock-free queues where pointers are required.'],
        answer: `### Systems Perspective & Memory Footprint

1. **Memory Overhead:**
   - For an array of 32-bit integers, memory consumed is exactly $4 \\times n$ bytes.
   - For a linked list of 32-bit integers on 64-bit architecture: 4 bytes payload + 4 bytes padding + 8 bytes pointer = 16 bytes per node (300% overhead!).
2. **Hardware Reality:**
   Modern computers are dominated by memory latency. Because CPU cache lines are 64 bytes, reading an array loads 16 consecutive integers into cache at once. A linked list causes a memory stall for almost every node jump.
3. **When to use Linked List:**
   - Implementing queues/stacks where no random access is required and strict $O(1)$ worst-case latency (without dynamic array resizing spikes) is non-negotiable.
   - Lock-free concurrent data structures (e.g., Michael-Scott queue).`
      },
      {
        provider: 'mistral',
        providerName: 'Mistral AI (Simulated)',
        model: 'mistral-large (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 890,
        reasoningSummary: 'Mathematical summary of trade-offs and decision matrix.',
        keyClaims: [
          'Default choice in 95% of modern software should be contiguous arrays.',
          'Linked lists are superior primarily when constant-time splice and persistent immutable histories are needed.'
        ],
        uncertainties: ['Exact hardware architecture and runtime garbage collector pause impact.'],
        answer: `### Decision Matrix & Synthesis

- **Use Array (or ArrayList / Vector):**
  - When frequent random read access by index is needed.
  - When memory footprint and cache efficiency are paramount.
  - When iteration throughput is the dominant bottleneck.

- **Use Linked List:**
  - When frequent splicing/merging of sub-lists occurs.
  - When you need true $O(1)$ worst-case prepend without amortized capacity resizing.
  - In functional programming languages using immutable persistent lists (head/tail sharing).`
      }
    ];
  }

  if (isCoding) {
    return [
      {
        provider: 'gemini',
        providerName: 'Google Gemini (Simulated)',
        model: 'gemini-3.8-flash (demo)',
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
        provider: 'openai',
        providerName: 'OpenAI GPT (Simulated)',
        model: 'gpt-4o-mini (demo)',
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
        provider: 'anthropic',
        providerName: 'Anthropic Claude (Simulated)',
        model: 'claude-3-5-sonnet (demo)',
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
      {
        provider: 'mistral',
        providerName: 'Mistral AI (Simulated)',
        model: 'mistral-large (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 880,
        reasoningSummary: 'Rigorous mathematical proof of inversion count reduction.',
        keyClaims: [
          'Adaptive sorting algorithms scale proportionally with Kolmogorov complexity and inversion metrics.',
          'Block sort variations achieve O(1) auxiliary space while retaining O(n log n) bound.'
        ],
        uncertainties: ['Data distribution uniformity.'],
        answer: `[Demo Response]
Mathematical analysis of near-sorted array sorting:
Let $I$ denote the number of inversions. An algorithm is adaptive with respect to $I$ if its runtime satisfies $O(n + I)$.
- Insertion sort executes exactly $n + I$ comparisons.
- When $I = O(n)$, runtime is strictly linear $O(n)$.
- When $I$ approaches $n(n-1)/2$, runtime degrades to $O(n^2)$.
Hence, **Insertion Sort** is optimal for $I \\ll n$, while **Timsort** is optimal for general near-sorted sequences.`
      }
    ];
  }

  if (isDebate) {
    return [
      {
        provider: 'gemini',
        providerName: 'Google Gemini (Simulated)',
        model: 'gemini-3.8-flash (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 790,
        reasoningSummary: 'Defends decoupled client architecture, edge portability, and resilience.',
        keyClaims: [
          'Decoupled architectures prevent vendor lock-in and allow independent deployment velocity.',
          'Client-heavy SPAs offer maximum interactivity and client cache efficiency.',
        ],
        uncertainties: ['Initial page load performance and SEO trade-offs.'],
        answer: `[Demo Response]
**Position A (Client-Side SPA Architecture):**
Building with decoupled client SPAs (e.g. Vite + React) maintains strict boundaries between presentation and server APIs. It enables:
- Fast build pipelines and instantaneous client navigation.
- Complete portability across any hosting provider, edge CDN, or static bucket.
- Clear separation of backend concerns without tight coupling to a specific serverless framework runtime.`,
      },
      {
        provider: 'openai',
        providerName: 'OpenAI GPT (Simulated)',
        model: 'gpt-4o-mini (demo)',
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
      {
        provider: 'anthropic',
        providerName: 'Anthropic Claude (Simulated)',
        model: 'claude-3-5-sonnet (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 980,
        reasoningSummary: 'Balanced critique evaluating developer cognitive overhead, server costs, and vendor lock-in.',
        keyClaims: [
          'Server components shift compute costs from client devices to serverless infrastructure.',
          'Debugging SSR hydration mismatches is a notorious productivity drain.',
          'Hybrid approaches with dedicated microservices often scale better for large engineering teams.'
        ],
        uncertainties: ['Evolution of web standards and edge compute pricing.'],
        answer: `[Demo Response]
**Nuanced Synthesizing Perspective:**
The choice between SPA and full-stack SSR depends on the product lifecycle:
1. **Content-heavy, public, SEO-critical:** Unified SSR (Next.js) wins decisively.
2. **High-density dashboards, private SaaS, offline-capable:** Decoupled SPA (React + Vite) delivers higher developer productivity, deterministic caching, and near-zero hosting compute bills.`,
      },
      {
        provider: 'mistral',
        providerName: 'Mistral AI (Simulated)',
        model: 'mistral-large (demo)',
        isDemo: true,
        status: 'success',
        responseTime: 870,
        reasoningSummary: 'Pragmatic operational breakdown of deployment and observability.',
        keyClaims: [
          'SPAs allow static asset caching at Cloudflare/Fastly edges for 99.999% availability.',
          'Full-stack node servers introduce cold starts and memory leak risks in long-running pods.'
        ],
        uncertainties: ['Traffic burst profiles and geographical distribution.'],
        answer: `[Demo Response]
**Operational Infrastructure Assessment:**
From a reliability standpoint, static client SPAs deployed to multi-region CDNs have a near-zero failure surface. If the backend API degrades, the UI gracefully renders cached state or offline indicators. In contrast, server-side rendered apps fail catastrophically if node rendering processes experience memory leaks or CPU throttling.`,
      }
    ];
  }

  // General questions fallback
  return [
    {
      provider: 'gemini',
      providerName: 'Google Gemini (Simulated)',
      model: 'gemini-3.8-flash (demo)',
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
      provider: 'openai',
      providerName: 'OpenAI GPT (Simulated)',
      model: 'gpt-4o-mini (demo)',
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
    {
      provider: 'anthropic',
      providerName: 'Anthropic Claude (Simulated)',
      model: 'claude-3-5-sonnet (demo)',
      isDemo: true,
      status: 'success',
      responseTime: 1020,
      reasoningSummary: 'Adversarial fact-checking and edge case analysis.',
      keyClaims: [
        'Unstated assumptions often disguise fatal points of failure.',
        'Boundary conditions must be tested under worst-case inputs.'
      ],
      uncertainties: ['Environmental variability and real-world network latency.'],
      answer: `[Demo Response]
Critical Considerations for "${question}":
Before finalizing a conclusion, consider these easily overlooked edge cases:
1. What happens when inputs are degraded, corrupted, or delayed?
2. Are error-recovery paths thoroughly tested or assumed?
3. How gracefully does the system fail when limits are exceeded?`,
    },
    {
      provider: 'mistral',
      providerName: 'Mistral AI (Simulated)',
      model: 'mistral-large (demo)',
      isDemo: true,
      status: 'success',
      responseTime: 890,
      reasoningSummary: 'High-density summary with actionable recommendations.',
      keyClaims: [
        'Pragmatic execution beats theoretical perfection.',
        'Establish automated validation benchmarks before scaling.'
      ],
      uncertainties: ['Long-term maintenance overhead.'],
      answer: `[Demo Response]
Synthesis and Execution Checklist:
1. Validate core invariants under strict unit testing.
2. Document architectural trade-offs explicitly for future maintenance.
3. Monitor latency and throughput metrics in production telemetry.`,
    }
  ];
}
