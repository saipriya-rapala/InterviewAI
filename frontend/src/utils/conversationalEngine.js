/**
 * InterviewAI - Advanced Conversational AI Engine
 * ChatGPT / Gemini AI style dynamic mock interview orchestration.
 *
 * Capabilities:
 * 1. Choose Languages dynamically: Python, Java, TypeScript, JavaScript, Go, C++, C#, Rust, SQL, PHP, Ruby, Kotlin, Swift.
 * 2. TR (Technical Round) vs HR (Behavioral Round) vs Combined Mode:
 *    - TR: Deep-dives into language internals, concurrency, memory/GC, profiling, architecture, and live debugging.
 *    - HR: Behavioral, culture fit, blameless post-mortems, mentorship, and leadership contextualized to the chosen language(s).
 * 3. True ChatGPT / Gemini AI dynamic question synthesis:
 *    - Unpredictable real-world scenarios with combinatorial scale metrics (QPS, p99 latency, heap memory, SLA).
 *    - Realistic production anchors (checkout pipelines, real-time message streams, IoT ingest, multi-tenant SaaS).
 * 4. Conversational Dialogue & Dynamic Adaptive Probing:
 *    - Extracts candidate's actual assertions and quotes them in follow-ups.
 *    - Adapts dynamically to brief vs thorough answers.
 * 5. On-Demand Elite Model Answers for the comprehensive scorecard.
 */

export const SUPPORTED_LANGUAGES = [
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "C++",
  "C",
  "C#",
  "Go",
  "Rust",
  "SQL",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Scala",
  "Dart",
  "Shell",
  "R",
];

// Production anchors and scale metrics for dynamic ChatGPT/Gemini combinatorial generation
export const PRODUCTION_SCENARIOS = [
  { context: "a high-frequency payment checkout engine", scale: "45,000 requests/sec", latency: "p99 < 15ms", failure: "intermittent 504 timeouts and connection pool exhaustion" },
  { context: "a real-time streaming analytics pipeline", scale: "150,000 events/sec", latency: "sub-50ms ingestion", failure: "memory usage surging from 1.2GB to 14GB under sustained traffic" },
  { context: "a distributed multi-tenant B2B SaaS platform", scale: "10 million daily active queries", latency: "p95 < 80ms", failure: "cascading database locks and thread starvation during peak hours" },
  { context: "an e-commerce flash-sale ordering microservice", scale: "80,000 concurrent shopping carts", latency: "p99 < 25ms", failure: "race conditions causing duplicate inventory reservation" },
  { context: "a mission-critical authentication and session gateway", scale: "200,000 active WebSocket connections", latency: "zero-downtime SLA (99.99%)", failure: "event loop blocking and file descriptor exhaustion" },
];

// Deep Technical Knowledge & Scenarios by Language (TR)
export const LANGUAGE_TR_KNOWLEDGE = {
  Java: {
    name: "Java / Spring Boot",
    mostlyExpectedInterviewQuestions: [
      "Why is `String` immutable in Java, and how does the String Constant Pool optimize memory? What are the key differences between `String`, `StringBuilder`, and `StringBuffer` in multi-threaded contexts?",
      "Explain the contract between `equals()` and `hashCode()` in Java. What happens if you override `equals()` without overriding `hashCode()` when using a `HashMap` or `HashSet`?",
      "How does `HashMap` work internally in Java 8+? Walk me through hashing, bucket index calculation, collision resolution, and why/when linked list nodes transform into a Red-Black Tree.",
      "What is the difference between `Fail-Fast` and `Fail-Safe` iterators in Java? What causes a `ConcurrentModificationException`, and how do you safely remove elements during collection iteration?",
      "Explain the difference between `synchronized` method/block, `volatile` keyword, and `AtomicInteger`. Does `volatile` guarantee atomicity? Why or why not?",
      "In Java 8 Stream API: What is the difference between intermediate and terminal operations? Walk me through when you would use `map()` vs `flatMap()` with a practical example.",
    ],
    coreMechanics: [
      "Virtual Threads (Project Loom) vs reactive WebFlux: carrier thread pinning on synchronized blocks",
      "Garbage collection tuning (G1GC vs ZGC vs Shenandoah) for low-latency heap management",
      "JVM memory model: heap vs metaspace, escape analysis, and volatile visibility guarantees",
      "Spring Boot IoC container: singleton bean lifecycles, circular dependencies, and constructor injection",
      "Hibernate/JPA: N+1 select queries, pessimistic vs optimistic locking, and second-level cache invalidation",
      "Concurrency primitives: AtomicReference, ReentrantReadWriteLock, and CompletableFuture pipelines",
    ],
    debuggingScenarios: [
      "In a Java 21 Spring Boot service, CPU spikes to 100% and response latency jumps from 25ms to 4.5 seconds. Walk me through your diagnostic process: how do you collect thread dumps (jcmd / jstack) to detect thread contention or carrier thread pinning, and how do you analyze heap dumps with Eclipse MAT to identify memory leaks?",
      "Your Spring Boot backend uses HikariCP and throws `SQLTransientConnectionException: Connection is not available, request timed out after 30000ms`. How do you determine whether the root cause is slow unindexed database queries, long-running `@Transactional` methods holding connections open, or database deadlocks?",
      "A high-throughput Java microservice experiences sudden 6-second Stop-The-World GC pauses under heavy load. How do you inspect GC logs (`-Xlog:gc*`), evaluate object allocation rates, and configure G1GC or ZGC flags to eliminate the pauses without wasting RAM?",
    ],
    architectureQuestions: [
      "When designing a distributed event-processing service in Java, how do you handle transactional outbox patterns with Spring Data and Kafka to guarantee at-least-once message delivery without distributed two-phase commit (2PC)?",
      "How do you design multi-tenant data isolation in Spring Boot? Compare schema-per-tenant, database-per-tenant, and shared-schema with Hibernate row-level filters in terms of connection pool efficiency and regulatory compliance.",
    ],
  },
  Python: {
    name: "Python",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between mutable and immutable data types in Python? How does Python's 'pass-by-object-reference' (call-by-assignment) mechanism handle function arguments when modifying lists versus integers?",
      "What is Python's Global Interpreter Lock (GIL)? Why was it designed into CPython, how does it affect multi-threaded CPU-bound programs, and what are the standard ways to achieve true parallelism?",
      "Explain Python's memory management: How do reference counting and cyclic garbage collection collaborate, and what is the difference between `is` and `==`?",
      "How do Python Decorators work under the hood? Walk me through how you would implement a custom decorator that measures execution time and caches function results (memoization).",
      "What is the difference between a shallow copy and a deep copy in Python? Demonstrate a scenario where `copy.copy()` leads to unintended side-effects on nested mutable collections.",
      "How do Python Generators and the `yield` statement work compared to standard functions returning lists? What is the iterator protocol (`__iter__` and `__next__`)?",
    ],
    coreMechanics: [
      "CPython Global Interpreter Lock (GIL) and its effect on CPU-bound vs I/O-bound concurrency",
      "Asyncio event loop: task cancellation, coroutine scheduling, and avoiding blocking I/O calls",
      "Memory management: reference counting, cyclic garbage collection, and `tracemalloc` profiling",
      "Generators and memory-efficient streaming for multi-gigabyte datasets (`yield` vs lists)",
      "Pydantic and FastAPI serialization performance and validation overhead",
      "Multiprocessing vs Celery distributed workers for background compute workloads",
    ],
    debuggingScenarios: [
      "In a high-concurrency FastAPI service, worker memory climbs steadily until Kubernetes OOMKills the pod every 4 hours. How do you isolate whether the leak stems from circular references, unclosed database connection sessions, or module-level global variables using `tracemalloc` or `objgraph`?",
      "Your Python microservice is experiencing high CPU utilization, but increasing worker threads does not improve throughput. How does CPython's GIL explain this bottleneck, and how would you transition CPU-intensive routines to multiprocessing, Cython, or Rust FFI extensions?",
      "In an asynchronous Python service using `asyncio` and `httpx`, intermittent request timeouts occur during peak hours. How do you detect if a third-party library is executing synchronous blocking I/O on the main event loop, and how do you wrap it safely using `asyncio.to_thread`?",
    ],
    architectureQuestions: [
      "When architecting a production Python backend, under what workload characteristics would you choose FastAPI with async SQLAlchemy over Django with traditional synchronous ORM?",
      "How do you implement graceful shutdown in Python distributed workers (e.g. Celery or custom async consumers) to ensure in-flight messages are acknowledged or requeued cleanly before container termination?",
    ],
  },
  TypeScript: {
    name: "TypeScript / JavaScript",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between an `interface` and a `type` alias in TypeScript? When would you strictly prefer one over the other (e.g. declaration merging vs union types)?",
      "Explain the differences between `any`, `unknown`, `never`, and `void` in TypeScript. Why is `unknown` considered a type-safe alternative to `any`?",
      "How do Type Guards and Type Narrowing work in TypeScript? Walk me through using `typeof`, `instanceof`, `in`, and custom user-defined type predicates (`val is Type`).",
      "Explain Generics in TypeScript: How do you enforce generic constraints using `extends`, and how does `keyof` work in mapped object lookups?",
      "How do utility types like `Partial<T>`, `Required<T>`, `Pick<T, K>`, and `Omit<T, K>` work, and how does TypeScript ensure compile-time immutability with `Readonly<T>`?",
    ],
    coreMechanics: [
      "V8 engine internals: hidden classes, inline caching, and JIT deoptimizations",
      "Event loop phases: microtasks (Promises, process.nextTick) vs macrotasks (setTimeout, I/O)",
      "Advanced type safety: discriminating unions, conditional types, template literal types, and `never` exhaustiveness",
      "React render lifecycle: reconciliation, fiber nodes, `useDeferredValue`, and compiler memoization",
      "Memory leaks in Node.js: unclosed event emitters, closure scopes, and global object caches",
      "End-to-end type safety: tRPC, Zod schema validation, and OpenAPI code generation",
    ],
    debuggingScenarios: [
      "In a Node.js production service, event loop lag spikes above 900ms, causing reverse proxies to return 504 Gateway Timeouts. Walk me through your diagnostic approach: how do you capture clinic.js or V8 CPU profiles to identify whether the culprit is synchronous JSON parsing, unindexed regular expressions, or cryptographic hashing?",
      "In a complex React single-page application, users experience noticeable input lag when typing into a search field attached to a large data grid. How do you profile component re-renders using React DevTools, and how do you combine virtualization and `useDeferredValue` to keep the UI fluid?",
      "A Node.js microservice leaks memory over 48 hours until heap exhaustion. How do you inspect V8 heap snapshots in Chrome DevTools to locate detached DOM/objects, dangling event listeners, or growing Map instances?",
    ],
    architectureQuestions: [
      "How do you architect a enterprise TypeScript monorepo across frontend and backend boundaries to guarantee 100% compile-time type safety while preventing accidental backend code leakage into the client bundle?",
      "When scaling a Node.js cluster across multiple container replicas, how do you handle stateful features like WebSockets and session storage while maintaining zero downtime during rolling deployments?",
    ],
  },
  JavaScript: {
    name: "JavaScript / Node.js",
    mostlyExpectedInterviewQuestions: [
      "What are the fundamental differences between `var`, `let`, and `const`? Explain variable hoisting, the Temporal Dead Zone (TDZ), and function vs block scoping.",
      "What is a Closure in JavaScript? Walk me through a concrete scenario where you used closures for data privacy (private state) or function currying.",
      "Explain the `this` keyword binding rules in JavaScript: default, implicit, explicit (`call`, `apply`, `bind`), and how arrow functions differ in their lexical `this` binding.",
      "Walk me through the JavaScript Event Loop: How does V8 handle synchronous code on the call stack, microtasks (Promises, queueMicrotask), and macrotasks (`setTimeout`, I/O)? Which takes priority?",
      "What is Prototypal Inheritance in JavaScript? How does the prototype chain work, and how does it differ from traditional classical inheritance found in Java or C++?",
      "What is the difference between Debouncing and Throttling? In what real-world frontend scenarios (e.g. search autocomplete vs window scroll/resize) would you choose one over the other?",
    ],
    coreMechanics: [
      "Prototypal inheritance, closures, and lexical scoping",
      "Asynchronous programming: Promise chaining, async/await, and unhandled rejections",
      "Node.js streams: backpressure, chunk piping, and memory efficiency",
      "V8 garbage collection: Scavenge vs Mark-Sweep-Compact",
    ],
    debuggingScenarios: [
      "In a high-throughput Node.js API, memory climbs under high load and garbage collection pauses freeze traffic. How do you diagnose whether memory is pinned by closures or unhandled stream backpressure?",
      "How do you debug an intermittent uncaught promise rejection that crashes your Node.js server under production concurrency?",
    ],
    architectureQuestions: [
      "How do you design an asynchronous worker queue in Node.js with Redis to process bursty webhook payloads without starving the main event loop?",
    ],
  },
  Go: {
    name: "Go (Golang)",
    mostlyExpectedInterviewQuestions: [
      "How do Goroutines differ from OS threads in terms of memory stack allocation, creation overhead, and scheduling?",
      "Explain the difference between Buffered and Unbuffered Channels in Go. What happens when you read from or write to a closed channel, or a nil channel?",
      "How do Slices work internally in Go? Explain the relationship between the slice pointer, length, and capacity, and describe what happens when `append()` exceeds capacity.",
      "Explain Interfaces in Go: Why is interface implementation called implicit (duck typing), and what is the internal memory representation of an `iface` and `eface`?",
      "What are the rules for using `defer`, `panic`, and `recover` in Go? In what order do deferred functions execute, and how do you recover from a panic?",
    ],
    coreMechanics: [
      "Go runtime M:N scheduler: goroutines, OS threads, logical processors (G, M, P) and work stealing",
      "Channels: buffered vs unbuffered semantics, deadlock conditions, and `select` with timeouts",
      "Memory management: escape analysis, stack vs heap allocation, and GC pacing",
      "Concurrency safety: `sync.Mutex`, `sync.RWMutex`, atomic operations, and `sync.WaitGroup`",
      "`context.Context`: cancellation propagation, timeouts, and request-scoped values",
      "Profiling: `pprof` for CPU, heap, goroutine, and block contention profiling",
    ],
    debuggingScenarios: [
      "In a Go microservice, the active goroutine count climbs steadily from 300 to 85,000 over 72 hours until the pod runs out of memory. How do you use `net/http/pprof` to inspect the goroutine profile, and what patterns typically cause goroutines to leak indefinitely?",
      "You run `go test -race` in CI and discover a data race between concurrent map reads and writes. How do you resolve this race without introducing heavy lock contention across high-throughput endpoints?",
      "Under heavy production load, a Go network service starts dropping connections. How do you determine whether the bottleneck is channel buffer contention, GC pauses, or file descriptor limits?",
    ],
    architectureQuestions: [
      "How do you structure Go packages to adhere to Clean Architecture principles while strictly avoiding cyclic dependencies? Why is idiomatic Go inclined toward interfaces at the consumer site?",
      "How would you design a worker pool pattern in Go that handles 50,000 tasks/second, enforces backpressure, and shuts down gracefully upon receiving a SIGTERM signal?",
    ],
  },
  "C++": {
    name: "C++",
    mostlyExpectedInterviewQuestions: [
      "What are Virtual Functions and Pure Virtual Functions in C++? Walk me through how the Virtual Method Table (`vtable`) and virtual pointer (`vptr`) execute dynamic polymorphism at runtime.",
      "Explain Smart Pointers in Modern C++ (`std::unique_ptr`, `std::shared_ptr`, `std::weak_ptr`). How does atomic reference counting work in `shared_ptr`, and how does `weak_ptr` resolve cyclic retain leaks?",
      "What are Move Semantics and Rvalue References (`&&`) in C++11? How does `std::move` enable resource transfer without deep copying, and what is the Rule of 5?",
      "What is the difference between stack and heap memory allocation in C++? Compare `new`/`delete` with `malloc`/`free`, specifically regarding constructor/destructor execution.",
      "Explain Const Correctness in C++: What is the difference between `const int* p`, `int* const p`, and `const int* const p`? What does declaring a member function `const` guarantee?",
    ],
    coreMechanics: [
      "RAII (Resource Acquisition Is Initialization) and exception safety guarantees",
      "Move semantics, rvalue references (`&&`), and perfect forwarding (`std::forward`)",
      "Smart pointers: `std::unique_ptr` vs `std::shared_ptr` and atomic reference counting overhead",
      "Memory layout: cache locality, false sharing in multithreading, and custom arena allocators",
      "Template metaprogramming, C++20 Concepts, and compile-time constraints",
      "Concurrency: `std::atomic`, memory orderings (`acquire-release`, `relaxed`, `seq_cst`), and lock-free data structures",
    ],
    debuggingScenarios: [
      "In a multithreaded C++ service, you encounter an intermittent segmentation fault that only reproduces under production load. Walk me through your triage: how do you use GDB core dump analysis, AddressSanitizer (ASan), and Valgrind to locate the use-after-free or race condition?",
      "A high-frequency C++ application experiences tail latency spikes. How do you analyze CPU cache misses using `perf` and restructure data layouts from Array-of-Structures (AoS) to Structure-of-Arrays (SoA) to maximize cache locality?",
      "How do you identify and mitigate memory fragmentation in long-running C++ applications without restarting the process?",
    ],
    architectureQuestions: [
      "How would you design a lock-free Single Producer Single Consumer (SPSC) ring buffer in C++ using `std::atomic` and appropriate memory ordering?",
      "When architecting high-throughput financial or networking engines in C++, how do you achieve zero-copy deserialization across network packet boundaries?",
    ],
  },
  SQL: {
    name: "SQL & Databases (PostgreSQL / MySQL / Redis)",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between a Clustered Index and a Non-Clustered Index? How does the B-Tree leaf node store data in each case?",
      "Explain the differences between `INNER JOIN`, `LEFT OUTER JOIN`, `RIGHT OUTER JOIN`, and `FULL OUTER JOIN`. Write a query to find employees who do not belong to any department.",
      "What is the difference between the `WHERE` clause and the `HAVING` clause in SQL? Why can't aggregate functions like `COUNT()` or `SUM()` be used in `WHERE`?",
      "Explain ACID properties in relational databases. What does each property guarantee during concurrent transactions?",
      "How do SQL Window Functions work? What is the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` when handling duplicate values?",
      "Write a SQL query to find the N-th highest salary from an Employee table using both `DENSE_RANK()` and a subquery/LIMIT offset.",
    ],
    coreMechanics: [
      "Indexing internals: B-Tree vs Hash vs GIN vs LSM-tree, and composite index column ordering",
      "Transaction isolation levels: Read Committed, Repeatable Read, Serializable, and phantom reads",
      "Multi-Version Concurrency Control (MVCC) and deadlocks in concurrent write transactions",
      "`EXPLAIN ANALYZE`: sequential scans, index scans, bitmap scans, and cost estimation",
      "Distributed caching: Cache-Aside, Write-Through, cache stampede (thundering herd), and Redis eviction policies",
    ],
    debuggingScenarios: [
      "A mission-critical SQL query running against a 25-million row table suddenly degrades from 12ms to 18 seconds during peak traffic. Walk me through how you interpret `EXPLAIN (ANALYZE, BUFFERS)`: what do sequential scans, high disk read buffers, and external sort spills reveal?",
      "Your PostgreSQL database experiences frequent `deadlock detected` errors during high-concurrency order placements. How do you inspect `pg_stat_activity` and lock trees, and how do you rewrite transactions to enforce consistent lock acquisition ordering?",
      "Your Redis cache cluster CPU hits 100% and latency spikes. How do you diagnose whether the issue is caused by O(N) commands like `KEYS *`, hot keys, or memory eviction thrashing under high write volume?",
    ],
    architectureQuestions: [
      "Compare PostgreSQL and MongoDB for an e-commerce transactional system: what are the specific trade-offs regarding ACID guarantees, secondary indexing, and schema evolution?",
      "How do you architect a multi-layer caching system (local in-memory cache + distributed Redis) while ensuring cache stampede mitigation and eventual consistency upon database updates?",
    ],
  },
  Rust: {
    name: "Rust",
    mostlyExpectedInterviewQuestions: [
      "Explain the 3 core rules of Ownership and Borrowing in Rust. What is the principle of 'Aliasing XOR Mutability'?",
      "What is the difference between `String` and `&str` in Rust? Where are they stored in memory, and how do string slices work?",
      "How does error handling work in Rust using `Result<T, E>` and `Option<T>`? Explain pattern matching with `match` and the `?` error propagation operator.",
      "What are Traits in Rust? Compare static dispatch via generics (monomorphization) with dynamic dispatch via trait objects (`dyn Trait`).",
      "Explain `Send` and `Sync` marker traits in Rust concurrency. How do `Arc<T>` and `Mutex<T>` work together to share mutable state safely between threads?",
    ],
    coreMechanics: [
      "Ownership, borrowing, and lifetime annotations (`'a`)",
      "Fearless concurrency: `Send` and `Sync` traits, `Arc<Mutex<T>>`, and message passing with `mpsc`",
      "Zero-cost abstractions: traits, generics, monomorphization, and iterator pipelines",
      "Error handling: `Result`, `Option`, and the `?` operator without exceptions",
      "Unsafe Rust: FFI boundaries, raw pointers, and upholding safety invariants",
    ],
    debuggingScenarios: [
      "How do you resolve a complex lifetime mismatch in Rust where a struct needs to reference data from an async task without cloning large heap buffers?",
      "In an async Rust service built with Tokio, tasks are experiencing starvation. How do you diagnose whether a blocking computation is hijacking worker threads instead of yielding cooperatively?",
    ],
    architectureQuestions: [
      "How do you design a high-throughput network proxy in Rust utilizing Tokio, avoiding heap allocations in the critical hot path?",
    ],
  },
  "C#": {
    name: "C# / .NET",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between Value Types and Reference Types in C#? Explain Boxing and Unboxing, and describe their performance impact on the garbage collector.",
      "Explain the differences between `ref`, `out`, and `in` parameter modifiers in C#. When would you use each?",
      "How do Delegates, Events, and Lambdas work in C#? What are the standard built-in delegates (`Action`, `Func`, `Predicate`)?",
      "How does `async`/`await` work internally in C#? What is the role of the `Task` state machine, and why can calling `.Result` or `.Wait()` cause deadlocks in UI or legacy ASP.NET applications?",
      "What is the difference between `IEnumerable<T>` and `IQueryable<T>` in LINQ and Entity Framework? How does deferred execution differ between them?",
    ],
    coreMechanics: [
      "CLR garbage collection generations (Gen 0, 1, 2, LOH) and memory pinning",
      "`async`/`await` state machines and `SynchronizationContext` vs `ConfigureAwait(false)`",
      "Entity Framework Core: tracking vs no-tracking queries, split queries, and query compilation",
      "Dependency Injection lifetimes in ASP.NET Core: Transient, Scoped, Singleton",
    ],
    debuggingScenarios: [
      "In an ASP.NET Core service, memory usage climbs and Gen 2 GC pauses degrade throughput. How do you use `dotnet-dump` and `dotnet-trace` to identify large object heap (LOH) allocations?",
      "How do you resolve thread pool starvation in a high-concurrency C# API caused by sync-over-async anti-patterns (e.g. `.Result` or `.Wait()`)?",
    ],
    architectureQuestions: [
      "How do you architect a clean, scalable microservices API in .NET with MediatR (CQRS pattern) and MassTransit message streaming?",
    ],
  },
  C: {
    name: "C (Systems & Embedded)",
    mostlyExpectedInterviewQuestions: [
      "Explain Pointer Arithmetic and Double Pointers (`char**`) in C. How does indexing `arr[i]` translate into pointer offsets at the compiler level?",
      "Compare `malloc`, `calloc`, `realloc`, and `free`. What is a Dangling Pointer, what is a Memory Leak, and how do you prevent them in production C code?",
      "What is the difference between a `struct` and a `union` in C in terms of memory allocation, member alignment, and size calculation?",
      "Explain the difference between `static` local variables, `static` global variables, and `extern` variables in terms of scope and memory lifetime.",
      "What causes Buffer Overflow in C, and why are functions like `gets()` or `strcpy()` considered dangerous compared to `fgets()` or `snprintf()`?",
    ],
    coreMechanics: [
      "Manual heap memory management: malloc, calloc, realloc, free, and arena allocators",
      "Pointer arithmetic, memory alignment, structure padding, and cache-line false sharing",
      "Buffer overflow vulnerabilities, stack canaries, and AddressSanitizer (ASan) instrumentation",
      "POSIX system calls: fork, exec, mmap, pipes, signals, and non-blocking sockets",
      "Undefined behavior (UB): sequence points, strict aliasing violations, and signed integer overflow",
    ],
    debuggingScenarios: [
      "In a high-throughput C networking daemon, you encounter an intermittent memory corruption crash under production load. How do you use GDB core dump triage, Valgrind, and AddressSanitizer (ASan) to determine whether the issue is a use-after-free, double-free, or buffer overflow?",
      "How do you diagnose and resolve memory fragmentation in long-running C services that allocate variable-sized payloads without calling malloc in the critical path?",
    ],
    architectureQuestions: [
      "How do you design a zero-copy circular ring buffer in C using mmap to double-map virtual memory for lock-free IPC?",
    ],
  },
  Kotlin: {
    name: "Kotlin (Android & Backend)",
    mostlyExpectedInterviewQuestions: [
      "How does Null Safety work in Kotlin? Explain the safe call operator (`?.`), the Elvis operator (`?:`), non-null assertion (`!!`), and smart casting.",
      "What are Kotlin Coroutines, and how do they differ from JVM platform threads? Explain `suspend` functions and Dispatchers (`Dispatchers.IO`, `Dispatchers.Default`, `Dispatchers.Main`).",
      "What are Data Classes in Kotlin? What standard methods (`equals`, `hashCode`, `toString`, `copy`, `componentN`) does the compiler generate automatically?",
      "Explain Extension Functions in Kotlin. How do they work under the hood in compiled Java bytecode, and can they access private members of the receiver class?",
      "Compare Kotlin's Scope Functions: `let`, `run`, `with`, `apply`, and `also`. When do you use each based on context object (`this` vs `it`) and return value?",
    ],
    coreMechanics: [
      "Kotlin Coroutines: Dispatchers (IO, Default, Main), CoroutineScope, and structured concurrency",
      "Channels and StateFlow / SharedFlow vs RxJava for reactive event streaming",
      "Null safety mechanics: elvis operator (?:), safe calls (?.), and platform types interoperability with Java",
      "Inline functions, reified type parameters, and byte-code compilation efficiency",
      "Ktor and Spring Boot with Kotlin coroutines for non-blocking asynchronous APIs",
    ],
    debuggingScenarios: [
      "In an Android or Ktor application using Coroutines, memory climbs and tasks continue executing after UI views or request scopes are destroyed. How do you trace coroutine leaks using structured concurrency and ensure proper Job cancellation?",
      "How do you identify and resolve thread contention when mixing Kotlin Coroutines Dispatchers.Default with blocking legacy Java I/O calls?",
    ],
    architectureQuestions: [
      "How do you architect a modern MVI / Clean Architecture mobile or backend service in Kotlin utilizing StateFlow for unidirectional data flow?",
    ],
  },
  Swift: {
    name: "Swift (iOS & Systems)",
    mostlyExpectedInterviewQuestions: [
      "What are the key differences between Structs (Value types) and Classes (Reference types) in Swift? When would you choose one over the other?",
      "How does Swift's Automatic Reference Counting (ARC) manage memory? What causes Retain Cycles, and how do `weak` and `unowned` references resolve them?",
      "Explain Optionals in Swift: What is an Optional under the hood (enum with `.some` and `.none`), and what are the best practices for unwrapping them (`if let`, `guard let`)?",
      "What is Protocol-Oriented Programming (POP) in Swift? How do Protocol Extensions provide default implementations, and how does it compare to class inheritance?",
      "Explain Swift Concurrency: How do `async`/`await`, `Task`, and `Actor` types prevent data races at compile time?",
    ],
    coreMechanics: [
      "Automatic Reference Counting (ARC): strong, weak, and unowned reference lifecycles",
      "Retain cycles in closures, capture lists ([weak self]), and memory graph debugging",
      "Modern Swift Concurrency: async/await, Actors, @MainActor, and Tasks",
      "Value types (structs) vs reference types (classes) and Copy-On-Write (COW) optimization",
      "Protocol-Oriented Programming (POP) and generics with compile-time specialization",
    ],
    debuggingScenarios: [
      "In an iOS application, users report memory consumption climbing until the OS kills the process. Walk me through using Xcode Memory Graph Debugger and Instruments (Leaks and Allocations) to locate retain cycles caused by escaping closures.",
      "In Swift Concurrency, how do you prevent actor reentrancy bugs where shared state unexpectedly mutates across suspension points (await)?",
    ],
    architectureQuestions: [
      "How do you design an offline-first iOS data synchronization engine in Swift using Swift Concurrency Actors, ensuring thread-safe SQLite/CoreData transactions without blocking the MainActor?",
    ],
  },
  PHP: {
    name: "PHP (Modern PHP 8+ & Laravel / Symfony)",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between `==` and `===` in PHP? Explain type juggling and how PHP 8 strict typing (`declare(strict_types=1);`) prevents runtime coercion bugs.",
      "How do Sessions and Cookies differ in PHP? How does PHP manage session state across distributed servers (e.g. using Redis session handlers)?",
      "What is SQL Injection in PHP, and why does using PDO or MySQLi with Prepared Statements completely prevent it?",
      "Explain the differences between `include`, `include_once`, `require`, and `require_once` in PHP.",
      "What are Traits in PHP? How do they enable horizontal code reuse across independent class hierarchies, and how do you resolve method naming conflicts?",
    ],
    coreMechanics: [
      "PHP 8.x JIT (Just-In-Time) compiler and OPcache bytecode caching mechanics",
      "Shared-nothing execution model vs persistent runtimes (RoadRunner, Swoole, FrankenPHP)",
      "Fiber concurrency and asynchronous non-blocking event loops in PHP",
      "Eloquent / Doctrine ORM: N+1 query detection, chunking, and lazy vs eager loading",
      "Garbage collection of cyclic references and memory profiling with Xdebug / Blackfire",
    ],
    debuggingScenarios: [
      "In a high-traffic Laravel or Symfony application, memory limits are exceeded during batch processing of 500,000 records. How do you diagnose query memory bloat and refactor using database cursors or lazy collections (`cursor()`, `chunkById()`)?",
      "How do you tune OPcache and configure PHP-FPM pool sizing (pm.max_children, pm.start_servers) to eliminate 502 Bad Gateway timeouts under heavy concurrent web traffic?",
    ],
    architectureQuestions: [
      "How do you transition a traditional request-per-process PHP application to a long-running persistent runtime like RoadRunner or Swoole, and what memory leak pitfalls must you guard against?",
    ],
  },
  Ruby: {
    name: "Ruby (Ruby on Rails & Systems)",
    mostlyExpectedInterviewQuestions: [
      "Explain the differences between Blocks, Procs, and Lambdas in Ruby regarding argument checking and return behavior.",
      "Why is 'everything an object' in Ruby? Explain Open Classes and Monkey Patching, including their benefits and production risks.",
      "What is the difference between a Symbol (`:name`) and a String (`'name'`) in Ruby in terms of memory allocation, immutability, and object ID reuse?",
      "In Ruby on Rails ActiveRecord: What is the N+1 query problem, and how do `includes`, `preload`, and `eager_load` resolve it?",
    ],
    coreMechanics: [
      "Ruby MRI YJIT compiler and execution optimizations",
      "Global VM Lock (GVL) and concurrency trade-offs: threads vs processes vs Ractors",
      "Ruby garbage collection: generational GC, object allocation tracking, and `GC.compact`",
      "Ruby on Rails ActiveRecord: eager loading (`includes`, `joins`), counter caches, and database locking",
      "Background worker scaling with Sidekiq, Redis queues, and idempotency guarantees",
    ],
    debuggingScenarios: [
      "In a Ruby on Rails application running on Puma, latency spikes to 8 seconds during peak hours. How do you determine whether the bottleneck is GVL lock contention on CPU-heavy endpoints or database connection pool exhaustion in `database.yml`?",
      "A background Sidekiq worker runs out of memory processing multi-gigabyte CSV exports. How do you profile Ruby heap allocations using `derailed_benchmarks` or `memory_profiler` and stream data without loading full payloads into RAM?",
    ],
    architectureQuestions: [
      "How do you architect an idempotent background job processing pipeline in Ruby with Sidekiq and Redis, ensuring zero duplicate side-effects during network timeouts or worker retries?",
    ],
  },
  Scala: {
    name: "Scala (Akka / Pekko, Spark, Functional)",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between `val`, `var`, `lazy val`, and `def` in Scala in terms of evaluation timing and mutability?",
      "Explain Case Classes and Pattern Matching in Scala. Why are case classes preferred for domain modeling in functional programming?",
      "How does Scala support both Object-Oriented and Functional Programming? Explain immutability, pure functions, and higher-order functions.",
      "What are Traits in Scala, and how do they differ from Java interfaces or abstract classes? Explain trait linearization in multiple inheritance.",
    ],
    coreMechanics: [
      "Functional programming: pure functions, immutability, pattern matching, and higher-kinded types",
      "Actor model concurrency (Akka / Apache Pekko): mailboxes, supervision trees, and backpressure",
      "Apache Spark internals: RDDs, DataFrames, partition skew, shuffle spills, and broadcast joins",
      "Scala 3 features: context parameters (givens), extension methods, and type-safe enums",
      "JVM execution model, tail-call optimization (`@tailrec`), and memory footprint",
    ],
    debuggingScenarios: [
      "In a distributed Apache Spark job written in Scala, executors fail repeatedly with `java.lang.OutOfMemoryError: Java heap space` or spend 60% of execution time on shuffle spill to disk. How do you detect partition skew, repartition data, and optimize memory fraction configurations?",
      "In an Akka actor system, an actor mailbox fills up with millions of unhandled messages, causing system-wide latency spikes. How do you implement reactive streams backpressure or circuit breakers to prevent actor mailboxes from overflowing?",
    ],
    architectureQuestions: [
      "How do you design a distributed, fault-tolerant event-sourcing pipeline in Scala using Akka Persistence / Pekko and Kafka?",
    ],
  },
  Dart: {
    name: "Dart (Flutter & Multi-Platform)",
    mostlyExpectedInterviewQuestions: [
      "What is the difference between `final` and `const` in Dart? When is each evaluated, and how do `const` constructors optimize Flutter widget rebuilds?",
      "How does Sound Null Safety work in modern Dart? Explain required parameters, late initialization (`late`), and the null-aware operators (`?.`, `??`, `??=`).",
      "Explain the Dart Event Loop: How do microtasks and event queues operate, and how do `Future`, `Stream`, and `async`/`await` execute non-blocking operations?",
      "In Flutter: What is the difference between `StatelessWidget` and `StatefulWidget`? Walk me through the `StatefulWidget` lifecycle (`initState`, `didChangeDependencies`, `build`, `dispose`).",
    ],
    coreMechanics: [
      "Dart single-threaded event loop, microtask queue, and Isolates for CPU-bound computations",
      "Ahead-Of-Time (AOT) compilation vs Just-In-Time (JIT) compilation in Flutter",
      "Flutter rendering pipeline: Widget, Element, and RenderObject trees",
      "State management architectures: Bloc, Riverpod, Provider, and reactive streams",
      "Frame rendering budgets: 16ms/frame (60fps) or 8ms/frame (120fps), and avoiding UI thread jank",
    ],
    debuggingScenarios: [
      "In a Flutter app, users experience noticeable stutter and frame drops when scrolling through an image feed. How do you use Flutter DevTools Performance view to diagnose whether the bottleneck is expensive build() methods, raster thread shaders, or lack of widget RepaintBoundary isolation?",
      "How do you prevent UI freezing when parsing a 20MB JSON response in Dart by spawning a background `compute()` Isolate?",
    ],
    architectureQuestions: [
      "How do you architect an enterprise Flutter application using Clean Architecture with Bloc or Riverpod, ensuring strict separation between UI, domain business logic, and repository data sources?",
    ],
  },
  Shell: {
    name: "Shell / Bash (DevOps & Systems)",
    mostlyExpectedInterviewQuestions: [
      "What does `set -euo pipefail` do in Bash, and why is it considered the gold standard for reliable production shell scripts?",
      "Explain the difference between single quotes (`'...'`), double quotes (`\"...\"`), and backticks/`$(...)` in Bash variable expansion and command substitution.",
      "How do File Descriptors and Redirection work in Linux? Explain what `2>&1`, `> /dev/null`, and piping (`|`) do under the hood.",
      "What is the difference between `$?`, `$$`, `$#`, and `$@` in Bash scripts?",
    ],
    coreMechanics: [
      "Robust script flags: `set -euo pipefail` and custom error trapping (`trap 'cleanup' EXIT ERR`)",
      "File descriptors (0 stdin, 1 stdout, 2 stderr), redirections (`2>&1`), and process substitution (`<()`)",
      "Subshells, background execution (`&`), process monitoring, and `wait` synchronization",
      "Idempotent scripting, atomic file writes (`mv` replacing tmp files), and lock files (`flock`)",
      "POSIX compatibility vs Bash extensions (`[[` vs `[`, arrays, parameter expansion)",
    ],
    debuggingScenarios: [
      "A mission-critical CI/CD deployment Bash script silently fails midway through execution, leaving cloud resources half-provisioned without returning a non-zero exit code. How do you restructure the script using `set -euo pipefail`, signal traps, and logging to guarantee fail-fast behavior and cleanup?",
      "In a high-concurrency Linux environment, two cron jobs running the same Shell script collide, causing data corruption. How do you implement file locking with `flock` or atomic directory creation to prevent concurrent runs?",
    ],
    architectureQuestions: [
      "How do you design an idempotent, zero-dependency deployment script that automates container rolling updates, performs health checks with exponential backoff, and rolls back automatically upon health failure?",
    ],
  },
  R: {
    name: "R (Data Science & Analytics)",
    mostlyExpectedInterviewQuestions: [
      "What are the core data structures in R (Vectors, Lists, Matrices, Data Frames, Factors)? How does a List differ from an Atomic Vector?",
      "Why is Vectorization preferred over loops (`for`/`while`) in R? How does vectorization leverage low-level C/Fortran routines for performance?",
      "Explain the `apply` family of functions in R: When would you use `apply()`, `lapply()`, `sapply()`, and `tapply()`?",
      "How does R handle missing and undefined data? Explain the differences between `NA`, `NaN`, `NULL`, and `Inf`.",
    ],
    coreMechanics: [
      "Vectorization vs loops: performance implications of internal C loops in R",
      "Copy-on-modify memory semantics and memory management (`tracemem()`)",
      "High-performance data manipulation: `data.table` in-place modification (`:=`) vs `dplyr`",
      "Profiling performance bottlenecks with `profvis` and benchmarking with `microbenchmark`",
      "C++ extension integration with `Rcpp` for CPU-intensive statistical algorithms",
    ],
    debuggingScenarios: [
      "An R data processing pipeline handling 10 million rows crashes with `cannot allocate vector of size X Gb`. How do you identify whether copy-on-modify is duplicating memory in data frame operations, and how do you rewrite it using `data.table` with in-place modifications (`:=`)?",
      "How do you use `profvis` to diagnose whether a slow R statistical simulation is bottlenecked by repeated memory allocations, unvectorized loops, or S3 method dispatch overhead?",
    ],
    architectureQuestions: [
      "How do you design a reproducible, production-grade statistical API using R, Plumber, and Docker, ensuring memory isolation across concurrent analyst queries?",
    ],
  },
};

// Deep HR & Behavioral Knowledge Contextualized to Chosen Languages & Software Engineering
export const LANGUAGE_HR_KNOWLEDGE = {
  general: [
    {
      topic: "Production Outage Ownership",
      question: (lang) =>
        `Using the **STAR** method (Situation, Task, Action, Result): Describe a high-severity production incident or outage that occurred in your ${lang ? `**${lang}** ` : ""}service. How did you immediately triage the issue under pressure, communicate the impact to non-technical leadership and customers, and run the blameless post-mortem?`,
      sampleAnswer: (lang) =>
        `Situation: In our ${lang || "core"} payment service, a sudden traffic spike exhausted database connections, causing 504 errors on 8% of transactions.\nTask: As the on-call engineer, I had to restore transaction flow, communicate with leadership, and prevent financial loss.\nAction: I declared a P0 incident, posted updates in our stakeholder incident channel every 10 minutes, rolled back the latest migration, increased connection limits temporarily, and enabled request shedder.\nResult: Restored full operations in 14 minutes, authored a blameless post-mortem identifying missing connection timeouts, and added automated load-testing in CI.`,
    },
    {
      topic: "Technical Disagreement & Consensus",
      question: (lang) =>
        `Tell me about a situation where you had a significant technical disagreement with a teammate or senior architect regarding ${lang ? `**${lang}** architectural decisions ` : "technology choices "}or library selection. How did you handle the discussion, what benchmark data or prototypes did you use to build consensus, and what was the outcome?`,
      sampleAnswer: (lang) =>
        `Situation: Our team was divided on whether to adopt a new ${lang || "modern"} framework or stick with our existing legacy stack.\nTask: We needed to resolve the debate without creating friction or stalling sprint delivery.\nAction: Rather than arguing opinions, I organized a 2-day spike. We defined objective criteria: developer velocity, latency benchmarks, and operational complexity. We built identical prototypes and presented the empirical data to the team.\nResult: The data clearly highlighted the new approach reduced latency by 35%, leading to unanimous team consensus and successful rollout.`,
    },
    {
      topic: "Code Reviews & Engineering Standards",
      question: (lang) =>
        `In code reviews, how do you handle a situation where a junior or peer developer submits ${lang ? `**${lang}** ` : ""}code that works functionally, but violates performance best practices, readability, or architectural patterns? Walk me through how you phrase your feedback to mentor them without discouraging their initiative.`,
      sampleAnswer: (lang) =>
        `Situation: A teammate submitted a ${lang || ""} PR that passed unit tests but used an $O(N^2)$ nested loop in a critical path that would degrade in production.\nTask: Guide the developer to refactor the implementation while building their technical intuition.\nAction: I left an empathetic, constructive comment: 'This logic works great for small batches! However, when data volume reaches 50k items, this loop might cause latency spikes. What do you think about using a hash map lookup here to bring it to $O(N)$? Happy to jump on a 5-min huddle to pair.'\nResult: The developer embraced the suggestion, we refactored the code together, and they subsequently documented the pattern in our team engineering playbook.`,
    },
    {
      topic: "Technical Debt vs. Feature Velocity",
      question: (lang) =>
        `Product managers and business stakeholders often push for aggressive deadlines that tempt teams to cut corners. Describe a time you had to push back on a deadline to protect ${lang ? `**${lang}** code quality, security, or stability` : "system stability and test coverage"}. How did you translate technical risk into business terms they understood?`,
      sampleAnswer: (lang) =>
        `Situation: Product leadership requested launching a ${lang || "backend"} checkout feature 2 weeks ahead of schedule by skipping automated integration tests.\nTask: Convince stakeholders that launching without verification risked customer data corruption and revenue loss.\nAction: Instead of saying 'the code isn't clean', I quantified the risk in business terms: 'Skipping integration tests exposes us to an estimated 5-10% transaction failure rate during launch, which could cost $50,000 in lost sales and reputational damage. If we phase the launch to a 10% canary group next week, we can hit milestones safely.'\nResult: Leadership agreed with the canary compromise, we deployed with 0 data regressions, and the feature was delivered securely.`,
    },
    {
      topic: "Mentoring & Knowledge Sharing",
      question: (lang) =>
        `Describe a time you helped elevate your team's engineering capability or onboarded new teammates in ${lang ? `**${lang}** best practices` : "core technologies"}. What documentation, pairing sessions, or architectural guidelines did you introduce, and how did you measure success?`,
      sampleAnswer: (lang) =>
        `Situation: As our team expanded, new engineers were struggling with our distributed architecture and ${lang || "backend"} conventions, leading to lengthy PR review cycles.\nTask: Reduce onboarding ramp-up time and standardize coding conventions.\nAction: I authored a comprehensive 'Zero-to-Hero' onboarding guide, set up local containerized dev environments with 1-click start, and initiated bi-weekly architecture walkthroughs.\nResult: Average onboarding time to first production PR dropped from 3 weeks to 6 days, and PR review comments on standard idioms decreased by 40%.`,
    },
  ],
};

/**
 * Extracts candidate's actual assertions and key nouns to quote in follow-ups
 * (Provides true ChatGPT / Gemini conversational intelligence)
 */
export function extractCandidateAssertion(candidateText) {
  if (!candidateText || candidateText.trim().length === 0) return null;

  const text = candidateText.trim();
  // Look for key phrases like "I used X", "we implemented Y", "by using Z", "I would X"
  const match = text.match(
    /\b(i\s+(?:used|implemented|designed|chose|decided|configured|analyzed|tested|optimized|built|suggested|handled)\s+[^,.;\n]{8,45})/i
  );
  if (match) {
    return match[1].trim();
  }

  // Look for technical noun chunks
  const techMatch = text.match(
    /\b((?:redis|postgres|kafka|docker|kubernetes|virtual\s+threads|gil|asyncio|concurrency|caching|indexing|saga|connection\s+pool|deadlock|circuit\s+breaker|b-tree|microservices|rollback|post-mortem)[^,.;\n]{0,35})/i
  );
  if (techMatch) {
    return techMatch[1].trim();
  }

  // Fallback to first 8-10 words
  const words = text.split(/\s+/).slice(0, 8).join(" ");
  return words ? `${words}...` : null;
}

/**
 * Synthesizes an unpredictable, ChatGPT / Gemini AI style question
 */
export function generateDynamicQuestion(
  competency,
  profile,
  sessionSeed = Date.now(),
  options = {}
) {
  const selectedLanguages = options.selectedLanguages || [];
  const roundType = options.roundType || "all"; // "all" | "tr" | "hr"

  const inventory = extractDeepResumeInventory(profile);
  const role = inventory.targetRole;
  const turnMultiplier = (competency?.turn || 1) * 37 + (competency?.id?.length || 7) * 13;
  const seedIndex = Math.abs(sessionSeed + turnMultiplier);
  const variantIndex = seedIndex % 4;

  // 1. HIGH-LEVEL RESUME ARCHITECTURE & SYSTEMS
  if (
    competency?.id === "resume-arch-intro" ||
    competency?.category === "Architecture & System Design"
  ) {
    const topSkills = inventory.skills.slice(0, 4).join(", ") || inventory.languages.join(", ");
    const archVariants = [
      `As a **${role}**, how do you architect a high-throughput, fault-tolerant service using **${topSkills}** that handles 50,000 requests/sec with p99 latency < 20ms? Walk me through your service boundaries, connection pooling, and how you mitigate single points of failure (SPOF).`,
      `In designing a distributed backend with **${topSkills}**: How do you approach data consistency across distributed boundaries? When would you choose an asynchronous event-driven architecture with Kafka/RabbitMQ versus synchronous gRPC/REST APIs, and how do you implement the transactional outbox pattern?`,
      `Suppose your primary service running **${topSkills}** experiences sudden cascading failures due to downstream database degradation. Walk me through your resilience strategy: How do you configure circuit breakers, rate limiters, request shedding, and automated health checks to prevent total cluster collapse?`,
      `When scaling systems for **${role}** workloads: How do you balance vertical vs horizontal scaling trade-offs, and what caching strategies (Cache-Aside, Write-Through, Redis distributed cache) do you implement to protect database throughput?`,
    ];
    return archVariants[seedIndex % archVariants.length];
  }

  // 2. SPECIFIC PROJECT DEEP-DIVE DIRECTLY FROM RESUME
  if (competency?.projectName || (competency?.label || "").toLowerCase().includes("project:")) {
    const projName = competency.projectName || inventory.projects[0]?.name || "your primary project";
    const projTech = competency.projectTech || "the core stack";

    const projectVariants = [
      `Looking at your resume project **${projName}** (${projTech}): Suppose traffic surges 20x during a peak event, causing database connection pool exhaustion and API 504 timeouts. Walk me through how you would diagnose the bottleneck in your architecture and what caching or queuing mechanisms you would introduce.`,
      `Regarding your project **${projName}**: What was the most critical single point of failure (SPOF) or outage risk in this system? What observability metrics (telemetry, p99 latency, distributed tracing) did you instrument to detect anomalies before users reported them?`,
      `On **${projName}**, you utilized **${projTech}**. Looking back at the technical decisions you made, what is one architectural compromise you made to hit deadlines, and how would you redesign it today for 100x scalability?`,
      `In your project **${projName}**, how did you guarantee data consistency and handle partial network failures when communicating between distributed services or updating database state?`,
    ];

    return projectVariants[variantIndex % projectVariants.length];
  }

  // 3. HR BEHAVIORAL GROUNDED IN RESUME / STACK
  const isHr =
    competency?.isHr ||
    roundType === "hr" ||
    (competency?.category || "").toLowerCase().includes("behavioral") ||
    (competency?.category || "").toLowerCase().includes("leadership") ||
    (competency?.category || "").toLowerCase().includes("hr");

  if (isHr) {
    const lang = competency?.language || competency?.skillName || selectedLanguages[0] || "";
    const hrQuestions = LANGUAGE_HR_KNOWLEDGE.general || [];
    const hrItem = hrQuestions[seedIndex % hrQuestions.length];
    if (hrItem) {
      return hrItem.question(lang);
    }
    const topProjName = inventory.projects[0]?.name ? `your work on **${inventory.projects[0].name}**` : `your role as a ${role}`;
    const hrVariants = [
      `Using the **STAR** method (Situation, Task, Action, Result): In ${topProjName}${lang ? ` working with **${lang}**` : ""}, describe a time a critical bug or production regression slipped into production. How did you immediately contain the issue, communicate with non-technical stakeholders, and lead the blameless post-mortem?`,
      `Tell me about a situation in your engineering career as a ${role} where you had a significant technical disagreement with a teammate or senior architect regarding ${lang ? `**${lang}** architecture` : "technology choices"}. How did you handle the debate, what benchmarks or prototypes did you use to evaluate options, and what was the outcome?`,
      `In code reviews, how do you handle a situation where a teammate submits ${lang ? `**${lang}** ` : ""}code that functions but violates performance best practices or architecture patterns? How do you mentor them without causing friction?`,
      `Product managers often push for tight deadlines that tempt teams to cut corners. Describe a time you pushed back on a deadline to protect code quality and system reliability. How did you translate technical risk into business terms?`,
    ];
    return hrVariants[seedIndex % hrVariants.length];
  }

  // 4. SPECIFIC LANGUAGE SKILL FROM RESUME OR COMPETENCY (TR)
  const targetSkill = competency?.skillName || competency?.language;
  if (targetSkill) {
    const raw = targetSkill.trim().toLowerCase();
    let langKey = Object.keys(LANGUAGE_TR_KNOWLEDGE).find(
      (k) => k.toLowerCase() === raw
    );

    if (!langKey) {
      if (raw.includes("postgres") || raw.includes("mysql") || raw.includes("sql") || raw.includes("mongo") || raw.includes("redis")) {
        langKey = "SQL";
      } else if (raw.includes("golang") || raw.includes("go")) {
        langKey = "Go";
      } else if (raw.includes("react") || raw.includes("node") || raw.includes("javascript") || raw.includes("js")) {
        langKey = "JavaScript";
      } else if (raw.includes("typescript") || raw.includes("ts")) {
        langKey = "TypeScript";
      } else if (raw.includes("spring") || raw.includes("java")) {
        langKey = "Java";
      } else if (raw.includes("c#") || raw.includes(".net") || raw.includes("dotnet")) {
        langKey = "C#";
      } else if (raw.includes("c++") || raw.includes("cpp")) {
        langKey = "C++";
      } else if (raw.includes("rust")) {
        langKey = "Rust";
      } else if (raw.includes("python") || raw.includes("django") || raw.includes("fastapi")) {
        langKey = "Python";
      } else if (raw.includes("kotlin") || raw.includes("android")) {
        langKey = "Kotlin";
      } else if (raw.includes("swift") || raw.includes("ios")) {
        langKey = "Swift";
      } else if (raw.includes("php") || raw.includes("laravel")) {
        langKey = "PHP";
      } else if (raw.includes("ruby") || raw.includes("rails")) {
        langKey = "Ruby";
      } else if (raw.includes("scala") || raw.includes("spark")) {
        langKey = "Scala";
      } else if (raw.includes("dart") || raw.includes("flutter")) {
        langKey = "Dart";
      } else if (raw.includes("bash") || raw.includes("shell") || raw.includes("linux")) {
        langKey = "Shell";
      } else if (raw.includes(" r ") || raw === "r") {
        langKey = "R";
      }
    }

    if (langKey) {
      const langData = LANGUAGE_TR_KNOWLEDGE[langKey];

      // Priority 1: High-Frequency / Mostly Expected Interview Questions
      if (
        competency.isHighFrequency ||
        (competency?.category || "").toLowerCase().includes("mostly expected") ||
        (competency?.label || "").toLowerCase().includes("essentials")
      ) {
        if (langData.mostlyExpectedInterviewQuestions?.length > 0) {
          const list = langData.mostlyExpectedInterviewQuestions;
          return list[seedIndex % list.length];
        }
      }

      // Priority 2: Production Debugging & Profiling
      if (
        competency.isDebugging ||
        (competency?.label || "").toLowerCase().includes("debugging") ||
        (competency?.label || "").toLowerCase().includes("profiling")
      ) {
        if (langData.debuggingScenarios?.length > 0) {
          const list = langData.debuggingScenarios;
          return list[seedIndex % list.length];
        }
      }

      // Priority 3: Architecture & Concurrency
      if (
        competency.isArchitecture ||
        (competency?.label || "").toLowerCase().includes("architecture")
      ) {
        if (langData.architectureQuestions?.length > 0) {
          const list = langData.architectureQuestions;
          return list[seedIndex % list.length];
        }
      }

      // Default: cycle through mostly expected and technical scenarios
      const pools = [
        langData.mostlyExpectedInterviewQuestions,
        langData.debuggingScenarios,
        langData.architectureQuestions,
      ].filter((p) => p && p.length > 0);

      if (pools.length > 0) {
        const pool = pools[seedIndex % pools.length];
        return pool[seedIndex % pool.length];
      }
    }
  }

  // 4. GENERAL / TECHNICAL ROUND FALLBACK
  const activeLanguages =
    selectedLanguages.length > 0
      ? selectedLanguages
      : inventory.languages.length > 0
      ? inventory.languages
      : ["Java", "Python"];

  const primaryLang = activeLanguages[sessionSeed % activeLanguages.length] || "Java";
  const scenario = PRODUCTION_SCENARIOS[Math.abs(sessionSeed * 17) % PRODUCTION_SCENARIOS.length];
  const langKey = Object.keys(LANGUAGE_TR_KNOWLEDGE).find(
    (k) => k.toLowerCase() === primaryLang.toLowerCase()
  );
  const langData = LANGUAGE_TR_KNOWLEDGE[langKey] || LANGUAGE_TR_KNOWLEDGE["Java"];

  // Priority: Mostly expected questions on odd turns or when requested
  if (((competency?.turn || 1) % 2 !== 0 || competency?.isHighFrequency) && langData.mostlyExpectedInterviewQuestions?.length > 0) {
    const list = langData.mostlyExpectedInterviewQuestions;
    return list[Math.abs(sessionSeed * 29 + (competency?.turn || 1)) % list.length];
  }

  const isDebugging =
    (competency?.turn || 1) % 2 === 0 ||
    (competency?.label || "").toLowerCase().includes("debug") ||
    (competency?.label || "").toLowerCase().includes("troubleshoot");

  if (isDebugging && langData.debuggingScenarios?.length > 0) {
    const list = langData.debuggingScenarios;
    return list[Math.abs(sessionSeed * 23 + (competency?.turn || 1)) % list.length];
  }

  if (langData.architectureQuestions?.length > 0 && (competency?.turn || 1) % 3 === 0) {
    const list = langData.architectureQuestions;
    return list[Math.abs(sessionSeed * 19 + (competency?.turn || 1)) % list.length];
  }

  const coreConcept =
    langData.coreMechanics[Math.abs(sessionSeed * 13) % langData.coreMechanics.length];

  return `In ${scenario.context} built with **${primaryLang}**, handling **${scenario.scale}** with **${scenario.latency}**: Suppose the system experiences **${scenario.failure}**.\n\nWalk me through your engineering diagnosis: How does **${coreConcept}** impact this bottleneck, what low-level telemetry would you inspect, and what concrete architectural or code-level changes would you implement to guarantee resilience?`;
}

/**
 * Builds dynamic competency list that flows continuously without arbitrary limits
 * When a resume is present, automatically grounds 100% in resume projects, languages, and experience
 */
export function buildContinuousCompetencyQueue(profile, selectedLanguages = [], roundType = "all") {
  const hasResume = Boolean(
    profile?.resume ||
    profile?.resumeFileName ||
    (profile?.projects && profile.projects.length > 0 && profile.technicalSkills?.length > 0) ||
    (typeof window !== "undefined" && window.sessionStorage?.getItem("interviewai_has_resume"))
  );

  const inventory = extractDeepResumeInventory(profile);
  const list = [];
  let turn = 1;

  if (hasResume) {
    // AUTOMATIC RESUME-GROUNDED MODE (No manual selection required!)
    // 1. High-level Architecture of their target role & primary resume stack
    list.push({
      id: "resume-arch-intro",
      label: `${inventory.targetRole} Architecture`,
      subtitle: "System design, core stack & component choices",
      category: "Architecture & System Design",
      inProgress: true,
      covered: false,
      turn: turn++,
    });

    // 2. All projects listed on resume get dedicated deep-dive competencies
    inventory.projects.slice(0, 3).forEach((proj, idx) => {
      const techList = typeof proj.technologies === "string" ? proj.technologies : "Core Stack";
      list.push({
        id: `proj-${idx}`,
        label: `Project: ${proj.name}`,
        subtitle: `${techList} · Architecture & failure mitigation`,
        category: "Resume Project Deep-Dive",
        projectName: proj.name,
        projectTech: techList,
        projectDesc: proj.description,
        inProgress: false,
        covered: false,
        turn: turn++,
      });
    });

    // 3. EVERY programming language listed on resume gets:
    //    a) Mostly Expected Interview Questions (Core Interview Essentials)
    //    b) Concurrency & Production Debugging (TR Deep-Dive)
    inventory.languages.slice(0, 4).forEach((lang, idx) => {
      // a) Core Interview Essentials (High frequency expected interview questions)
      list.push({
        id: `resume-core-${idx}`,
        label: `${lang}: Core Interview Essentials`,
        subtitle: `${lang} core internals, memory model & high-frequency interview questions`,
        category: "Mostly Expected Interview Questions",
        skillName: lang,
        language: lang,
        isHighFrequency: true,
        inProgress: false,
        covered: false,
        turn: turn++,
      });

      // b) Concurrency & Debugging Deep-Dive
      list.push({
        id: `resume-debug-${idx}`,
        label: `${lang}: Production Debugging & Profiling`,
        subtitle: `${lang} thread contention, memory leaks & latency optimization`,
        category: "Technical Round (TR)",
        skillName: lang,
        language: lang,
        isDebugging: true,
        inProgress: false,
        covered: false,
        turn: turn++,
      });
    });

    // 4. Databases from resume (Indexing & ACID Guarantees)
    if (inventory.databases.length > 0) {
      const topDb = inventory.databases[0];
      list.push({
        id: "resume-db",
        label: `${topDb}: Indexing & ACID Guarantees`,
        subtitle: "Query optimization, isolation levels, B-Trees & cache trade-offs",
        category: "Mostly Expected Interview Questions",
        skillName: topDb,
        language: topDb,
        isHighFrequency: true,
        inProgress: false,
        covered: false,
        turn: turn++,
      });
    }

    // 5. STAR Behavioral & Leadership grounded in their resume experience
    list.push({
      id: "resume-star-leadership",
      label: `${inventory.targetRole} HR: Incident & Leadership`,
      subtitle: "Production outages, blameless post-mortem & team communication",
      category: "HR Behavioral & Leadership",
      isHr: true,
      inProgress: false,
      covered: false,
      turn: turn++,
    });

    return list;
  }

  // MANUAL / GENERAL PRACTICE MODE (When no resume is uploaded)
  const activeLangs =
    selectedLanguages.length > 0
      ? selectedLanguages
      : ["Java", "Python"];

  if (roundType === "hr") {
    // 100% HR & BEHAVIORAL ROUND
    activeLangs.forEach((lang) => {
      list.push(
        {
          id: `hr-incident-${lang}`,
          label: `${lang}: Production Outage Ownership`,
          subtitle: "Incident containment, blameless post-mortem & communications",
          category: "HR Behavioral & Leadership",
          isHr: true,
          language: lang,
          skillName: lang,
          inProgress: turn === 1,
          covered: false,
          turn: turn++,
        },
        {
          id: `hr-disagree-${lang}`,
          label: `${lang}: Technical Consensus & Disagreements`,
          subtitle: "Architectural alignment, benchmarks & stakeholder buy-in",
          category: "HR Behavioral & Leadership",
          isHr: true,
          language: lang,
          skillName: lang,
          inProgress: false,
          covered: false,
          turn: turn++,
        }
      );
    });
    return list;
  }

  if (roundType === "tr") {
    // 100% TR TECHNICAL ROUND (Core Essentials + Architecture + Debugging)
    activeLangs.forEach((lang) => {
      list.push(
        {
          id: `tr-core-${lang}`,
          label: `${lang}: Core Interview Essentials`,
          subtitle: `${lang} core internals & high-frequency expected interview questions`,
          category: "Mostly Expected Interview Questions",
          isHighFrequency: true,
          isHr: false,
          language: lang,
          skillName: lang,
          inProgress: turn === 1,
          covered: false,
          turn: turn++,
        },
        {
          id: `tr-arch-${lang}`,
          label: `${lang}: High-Throughput Architecture`,
          subtitle: "System design, memory model & performance constraints",
          category: "Technical Round (TR)",
          isArchitecture: true,
          isHr: false,
          language: lang,
          skillName: lang,
          inProgress: false,
          covered: false,
          turn: turn++,
        },
        {
          id: `tr-debug-${lang}`,
          label: `${lang}: Production Debugging & Profiling`,
          subtitle: "OOM leaks, CPU spikes, thread starvation & diagnostics",
          category: "Technical Round (TR)",
          isDebugging: true,
          isHr: false,
          language: lang,
          skillName: lang,
          inProgress: false,
          covered: false,
          turn: turn++,
        }
      );
    });
    return list;
  }

  // COMBINED MODE (TR Essentials + TR Debugging + HR Leadership)
  activeLangs.forEach((lang) => {
    list.push(
      {
        id: `tr-core-${lang}`,
        label: `${lang}: Core Interview Essentials`,
        subtitle: `${lang} core internals & high-frequency expected interview questions`,
        category: "Mostly Expected Interview Questions",
        isHighFrequency: true,
        isHr: false,
        language: lang,
        skillName: lang,
        inProgress: turn === 1,
        covered: false,
        turn: turn++,
      },
      {
        id: `tr-debug-${lang}`,
        label: `${lang} TR: Concurrency & Debugging`,
        subtitle: "Thread safety, heap dumps & production troubleshooting",
        category: "Technical Round (TR)",
        isDebugging: true,
        isHr: false,
        language: lang,
        skillName: lang,
        inProgress: false,
        covered: false,
        turn: turn++,
      },
      {
        id: `hr-incident-${lang}`,
        label: `${lang} HR: Incident & Leadership`,
        subtitle: "STAR method: outage recovery & stakeholder communication",
        category: "HR Behavioral (HR)",
        isHr: true,
        language: lang,
        skillName: lang,
        inProgress: false,
        covered: false,
        turn: turn++,
      }
    );
  });

  return list;
}

/**
 * Generates an opening ChatGPT / Gemini style greeting tailored directly to profile, selected languages, and round.
 */
export function generateConversationalOpening(profile, selectedLanguages = [], roundType = "all") {
  const hasResume = Boolean(
    profile?.resume ||
    profile?.resumeFileName ||
    (profile?.projects && profile.projects.length > 0 && profile.technicalSkills?.length > 0) ||
    (typeof window !== "undefined" && window.sessionStorage?.getItem("interviewai_has_resume"))
  );

  const inventory = extractDeepResumeInventory(profile);
  const name = inventory.candidateName || "there";
  const role = inventory.targetRole;

  if (hasResume && inventory.projects.length > 0) {
    const topProj = inventory.projects[0];
    const topSkills = inventory.skills.slice(0, 4).join(", ") || "your tech stack";
    const projTech = typeof topProj.technologies === "string" ? topProj.technologies : "your stack";

    return `Hello ${name}! Welcome to your technical mock interview for the **${role}** position.\n\nI've analyzed your resume and noted your experience with **${topSkills}**, including your work on **${topProj.name}** (${projTech}).\n\nTo begin: Walk me through the high-level architecture of **${topProj.name}**: what were the core system components, why did you select ${projTech} over alternatives, and what was the most critical failure mode or bottleneck you had to solve?`;
  }

  const activeLangs =
    selectedLanguages.length > 0
      ? selectedLanguages
      : inventory.languages.length > 0
      ? inventory.languages
      : ["Java", "Python"];

  const langString = activeLangs.join(", ");
  const roundDesc =
    roundType === "hr"
      ? "Behavioral & Cultural Leadership (HR)"
      : roundType === "tr"
      ? "Technical Deep-Dive (TR)"
      : "Technical Review (TR) and Behavioral Leadership (HR)";

  const firstLang = activeLangs[0] || "Java";

  if (roundType === "hr") {
    return `Hello ${name}! Welcome to your **${roundDesc}** interview for the **${role}** position.\n\nToday, we will evaluate your situational judgment, production ownership, communication, and team leadership across your primary stack: **${langString}**.\n\nTo begin: Describe a time you faced a high-severity production outage or critical bug in a ${firstLang} service. How did you coordinate the incident response under pressure, communicate with stakeholders, and run the blameless post-mortem?`;
  }

  if (roundType === "tr") {
    return `Hello ${name}! Welcome to your **${roundDesc}** for the **${role}** position.\n\nWe will examine system design, concurrency, memory profiling, and real-world debugging centered on your chosen languages: **${langString}**.\n\nTo kick off: In a production ${firstLang} service processing 50,000 requests/sec with p99 latency < 20ms, what are the primary concurrency bottlenecks you anticipate, and how do you configure connection pools and thread safety to prevent thread starvation or deadlocks?`;
  }

  return `Hello ${name}! Welcome to your **${roundDesc}** mock interview for the **${role}** position.\n\nWe will cover both **Technical Depth (TR)** and **Behavioral Leadership (HR)** across your chosen languages: **${langString}**.\n\nLet's start with a technical scenario in **${firstLang}**: Suppose your service experiences a 10x traffic spike causing p99 latency to jump from 15ms to 800ms with connection pool starvation. Walk me through your step-by-step diagnostic workflow: what metrics do you inspect first, and how would you resolve the bottleneck?`;
}

/**
 * Real-time Adaptive Follow-up Analyzer (ChatGPT/Gemini style interviewer probing)
 * Quotes the candidate's actual text and evaluates depth.
 */
export function evaluateAnswerAndGenerateAdaptiveFollowUp(
  candidateAnswer,
  currentTopic,
  profile,
  turnCount,
  selectedLanguages = [],
  roundType = "all"
) {
  const text = (candidateAnswer || "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const lower = text.toLowerCase();

  const userAssertion = extractCandidateAssertion(text);

  // Technical metric detection
  const hasMetrics = /\b(\d+ms|\d+s|\d+qps|\d+mb|\d+gb|p99|p95|cpu|oom|latency|throughput|b-tree|index|cache|acid|saga|kafka)\b/i.test(
    lower
  );
  const mentionsTradeoffs = /\b(trade-off|tradeoff|compromise|whereas|in contrast|overhead|consistency|scalability|bottleneck|drawback)\b/i.test(
    lower
  );
  const hasStarStructure = /\b(situation|task|action|result|because|therefore|outcome|learned)\b/i.test(
    lower
  );

  // Brief or vague answer -> Adaptive Probe (just like ChatGPT/Gemini)
  if (words < 25 || (!hasMetrics && !hasStarStructure && words < 40)) {
    const quotePrefix = userAssertion ? `You mentioned "${userAssertion}", but ` : "";
    const isHrRound = roundType === "hr" || (currentTopic || "").toLowerCase().includes("hr");
    const primaryLang = selectedLanguages[0] || "your service";

    const probes = isHrRound
      ? [
          `${quotePrefix}could you elaborate using the **STAR** framework? Specifically, what was the tangible **Result** or stakeholder outcome, and how did your ${primaryLang} engineering leadership influence the resolution?`,
          `${quotePrefix}how did you communicate the risk to non-technical stakeholders and manage their expectations under deadline pressure?`,
        ]
      : [
          `${quotePrefix}let's examine the concrete implementation details in ${primaryLang}:\n\nSpecifically, what were the quantitative trade-offs (latency, memory overhead, or concurrency limits), how did you handle edge cases or failure recovery, and what verification did you run to confirm system stability?`,
          `${quotePrefix}could you walk me through the operational specifics? Under a sudden 10x surge or unexpected database failover, how would your proposed approach hold up, and what metrics would you monitor in your telemetry dashboard?`,
        ];

    return {
      isProbe: true,
      score: Math.min(Math.max(Math.round(words / 10) + 3, 4), 6),
      response: probes[turnCount % probes.length],
      feedbackNotice: "Interviewer probed for more technical specifics, metrics, or STAR results.",
    };
  }

  // Strong, comprehensive answer -> Concise acknowledgment quoting user
  const score = Math.min(
    Math.max(
      Math.round(words / 8) + (hasMetrics ? 2 : 1) + (mentionsTradeoffs ? 1 : 0),
      7
    ),
    10
  );

  const quotePhrase = userAssertion
    ? `You highlighted "${userAssertion}"—that demonstrates solid production reasoning.`
    : "Very structured technical response with clear awareness of operational trade-offs.";

  const acknowledgments = [
    `${quotePhrase} Excellent depth on the failure modes and recovery metrics.`,
    `${quotePhrase} Great architectural decomposition and clear explanation of the constraints.`,
    `${quotePhrase} Strong technical clarity with practical awareness of trade-offs.`,
  ];

  return {
    isProbe: false,
    score,
    acknowledgment: acknowledgments[turnCount % acknowledgments.length],
    feedbackNotice: "Strong response demonstrating hands-on architectural and behavioral depth.",
  };
}

/**
 * Synthesizes an Elite Model Answer for any interview question to display in the scorecard
 */
export function generateEliteModelAnswer(questionText = "", topic = "Technical Competency") {
  const isHr =
    topic.toLowerCase().includes("hr") ||
    topic.toLowerCase().includes("behavioral") ||
    topic.toLowerCase().includes("leadership");

  const focusNotice = questionText ? `Focus: "${questionText.slice(0, 90)}..."\n\n` : "";

  if (isHr) {
    return `${focusNotice}Recommended Elite HR / Behavioral Answer (STAR Framework):
1. Situation (15-20%):
   - Set the scene: system context, user impact, and immediate business stakes.
2. Task (10-15%):
   - Define your individual ownership, key milestones, and the primary dilemma.
3. Action (50-60%):
   - Detail the proactive steps taken: transparent communication with stakeholders, technical triage, risk mitigation, and collaborative alignment.
4. Result (15-20%):
   - Quantify the outcome (e.g. 99.9% uptime preserved, 0 customer data loss), blameless post-mortem insights, and permanent process improvements added to CI/CD.`;
  }

  return `${focusNotice}Recommended Elite Technical Answer (TR Framework):
1. Problem Decomposition & Constraints:
   - Identify constraints (throughput: 50k QPS, p99 < 20ms, memory bounds) and state why default naive approaches break down.
2. Architecture & Concurrency Implementation:
   - Explain data structure choices, thread safety guarantees, connection pool sizing, and non-blocking I/O.
3. Resilience & Failure Modes:
   - Mitigate race conditions, cache stampedes, deadlocks, and network partitions with circuit breakers and exponential backoff.
4. Observability & Telemetry:
   - Monitor p99 latency, heap memory allocation rates, thread pool queue depth, and automated canary rollback triggers.`;
}

/**
 * Dynamic Topic Generator when candidate practices continuously past initial list
 */
export function generateNextContinuousTopic(currentCount, profile, selectedLanguages = [], roundType = "all") {
  const activeLangs =
    selectedLanguages.length > 0
      ? selectedLanguages
      : ["Java", "Python", "SQL"];

  const lang = activeLangs[currentCount % activeLangs.length];
  const isHr = roundType === "hr" || (roundType === "all" && currentCount % 2 === 1);

  const dynamicCategories = isHr
    ? [
        { label: `${lang} HR: Navigating Legacy Tech Debt`, subtitle: "Balancing product roadmap velocity with code refactoring", category: "HR Behavioral & Leadership", isHr: true },
        { label: `${lang} HR: Cross-Team Engineering Communication`, subtitle: "Translating technical bottlenecks to non-technical leaders", category: "HR Behavioral & Leadership", isHr: true },
        { label: `${lang} HR: Mentoring Underperforming Engineers`, subtitle: "Actionable code review feedback and skill development", category: "HR Behavioral & Leadership", isHr: true },
      ]
    : [
        { label: `${lang}: Core Interview Essentials`, subtitle: "High-frequency expected interview questions & runtime internals", category: "Mostly Expected Interview Questions", isHighFrequency: true, isHr: false },
        { label: `${lang} TR: Memory Profiling & GC Diagnostics`, subtitle: "Heap dump inspection, allocation rates & memory leaks", category: "Technical Round (TR)", isDebugging: true, isHr: false },
        { label: `${lang} TR: High-Throughput Concurrency`, subtitle: "Thread pools, non-blocking I/O & lock contention mitigation", category: "Technical Round (TR)", isArchitecture: true, isHr: false },
      ];

  const item = dynamicCategories[currentCount % dynamicCategories.length];
  return {
    id: `dyn-topic-${Date.now()}-${currentCount}`,
    label: item.label,
    subtitle: item.subtitle,
    category: item.category,
    isHr: item.isHr || false,
    isHighFrequency: item.isHighFrequency || false,
    isDebugging: item.isDebugging || false,
    isArchitecture: item.isArchitecture || false,
    language: lang,
    skillName: lang,
    inProgress: true,
    covered: false,
    turn: currentCount + 1,
  };
}

/**
 * Cleanly extracts all technical keywords from resume text and candidate profile
 */
export function extractDeepResumeInventory(profile) {
  const skills = profile?.technicalSkills || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const summary = profile?.professionalSummary || "";
  const role = profile?.targetRole || "Software Engineer";
  const experience = profile?.experienceLevel || "Mid-level";

  const languages = [];
  const frameworksAndTools = [];
  const databases = [];
  const cloudAndInfra = [];

  const langNames = ["python", "javascript", "typescript", "java", "c++", "c#", "go", "golang", "rust", "sql", "php", "ruby", "swift", "kotlin", "scala"];
  const dbNames = ["postgres", "postgresql", "mysql", "mongodb", "redis", "cassandra", "dynamodb", "elasticsearch", "kafka", "rabbitmq"];
  const cloudNames = ["docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform", "ci/cd", "linux"];

  skills.forEach((s) => {
    const lower = s.toLowerCase();
    if (langNames.some((l) => lower.includes(l))) {
      languages.push(s);
    } else if (dbNames.some((d) => lower.includes(d))) {
      databases.push(s);
    } else if (cloudNames.some((c) => lower.includes(c))) {
      cloudAndInfra.push(s);
    } else {
      frameworksAndTools.push(s);
    }
  });

  return {
    candidateName: profile?.candidateName || "Candidate",
    targetRole: role,
    experienceLevel: experience,
    summary,
    skills,
    languages: languages.length > 0 ? languages : ["Java", "Python", "SQL"],
    frameworksAndTools: frameworksAndTools.length > 0 ? frameworksAndTools : ["React", "Spring Boot", "Docker"],
    databases: databases.length > 0 ? databases : ["PostgreSQL", "Redis"],
    cloudAndInfra: cloudAndInfra.length > 0 ? cloudAndInfra : ["Docker", "AWS"],
    projects: projects.length > 0 ? projects : [
      {
        name: "Distributed Scalable Cloud Service",
        description: "High-throughput API backend with caching and message queuing.",
        technologies: "Node.js, Docker, PostgreSQL, Redis",
        role: "Software Engineer",
      },
    ],
    education,
  };
}
