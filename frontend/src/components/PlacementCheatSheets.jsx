import { useState } from "react";
import {
  BookOpen,
  Cpu,
  Globe,
  Database,
  Layers,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Server,
  Cloud,
  GitBranch,
  HardDrive,
  Terminal
} from "lucide-react";

export default function PlacementCheatSheets() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [expandedSection, setExpandedSection] = useState({
    os: true,
    cn: true,
    dbms: true,
    oops: true,
    dsa: true,
    system: true,
    cloud: true,
    git_se: true,
    coa: true,
    toc: true
  });

  function toggleSection(key) {
    setExpandedSection((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleCopy(text, key) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  // Filter helper: check if subject or query matches
  function isSubjectVisible(key, keywords = "") {
    if (activeCategory !== "all" && activeCategory !== key) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return key.toLowerCase().includes(q) || keywords.toLowerCase().includes(q);
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Placement Drive High-Yield Revision Sheets</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              10 Core Subjects • OS • CN • DBMS • OOPs • System Design • Cloud • Git • COA • TOC • Big-O
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Last-Minute Placement Cheat Sheets & Formula Cards
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Quick 1-page high-density summary notes of core subjects, scheduling formulas, OSI layer protocols, normalization rules, system design, cloud/DevOps, and SOLID traps to revise 15 minutes before an interview.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. CAP, Docker, Deadlock)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: "all", label: "All Subjects", icon: BookOpen },
          { id: "os", label: "Operating Systems (OS)", icon: Cpu },
          { id: "cn", label: "Computer Networks (CN)", icon: Globe },
          { id: "dbms", label: "DBMS & SQL", icon: Database },
          { id: "oops", label: "OOPs & Design Patterns", icon: Layers },
          { id: "dsa", label: "DSA Big-O Complexity", icon: Zap },
          { id: "system", label: "System Design (HLD)", icon: Server },
          { id: "cloud", label: "Cloud & DevOps (Docker/K8s)", icon: Cloud },
          { id: "git_se", label: "Git & Software Engg", icon: GitBranch },
          { id: "coa", label: "Computer Architecture (COA)", icon: HardDrive },
          { id: "toc", label: "Compiler Design & TOC", icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 1. OPERATING SYSTEMS CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("os", "operating systems cpu scheduling tat wt convoy coffman deadlock belady anomaly paging tlb thrashing") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("os")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Operating Systems (OS) Rapid Revision
                </h4>
                <span className="text-[11px] text-slate-500">
                  Formulas, Coffman Deadlock Conditions, Paging, and Scheduling Formulas
                </span>
              </div>
            </div>
            {expandedSection.os ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.os && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: Scheduling Formulas */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[10px]">
                  CPU Scheduling Formulas
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <li>• Turnaround Time (TAT) = Completion Time - Arrival Time</li>
                  <li>• Waiting Time (WT) = Turnaround Time - Burst Time</li>
                  <li>• Response Time (RT) = First CPU Time - Arrival Time</li>
                  <li>• Throughput = Completed Processes / Total Time</li>
                </ul>
                <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 text-[11px] text-rose-900 dark:text-rose-300">
                  💡 <strong>Convoy Effect</strong>: Short processes wait behind a massive CPU burst process in FCFS.
                </div>
              </div>

              {/* Card 2: Deadlock Coffman Conditions */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[10px]">
                  4 Necessary Coffman Conditions
                </span>
                <ol className="space-y-1 text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  <li><strong>Mutual Exclusion</strong>: At least 1 non-shareable resource.</li>
                  <li><strong>Hold & Wait</strong>: Process holding resources while requesting more.</li>
                  <li><strong>No Preemption</strong>: Resources cannot be forcefully taken away.</li>
                  <li><strong>Circular Wait</strong>: P0 waits for P1, P1 waits for P0.</li>
                </ol>
                <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-300">
                  ⚠️ Breaking ANY single condition guarantees deadlock prevention!
                </div>
              </div>

              {/* Card 3: Memory & Paging */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[10px]">
                  Virtual Memory & Paging
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <li>• Page Size = Frame Size (power of 2)</li>
                  <li>• Effective Access Time (EAT) = h*(TLB + M) + (1-h)*(TLB + 2M)</li>
                  <li>• <strong>Belady's Anomaly</strong>: FIFO fault count increases when frames increase!</li>
                  <li>• <strong>Thrashing</strong>: System spends more time paging than executing instructions.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. COMPUTER NETWORKS CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("cn", "computer networks osi tcp udp ip cidr subnetting handshake syn ack dns dhcp http https arp port") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("cn")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Computer Networks (CN) Rapid Revision
                </h4>
                <span className="text-[11px] text-slate-500">
                  OSI 7 Layers, Subnetting Reference, Critical Ports, and TCP 3-Way Handshake
                </span>
              </div>
            </div>
            {expandedSection.cn ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.cn && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: OSI 7-Layer Hierarchy */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block uppercase tracking-wider text-[10px]">
                  OSI 7 Layers (Top to Bottom)
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <li><strong>7. Application</strong>: HTTP, HTTPS, FTP, DNS (User Interface)</li>
                  <li><strong>6. Presentation</strong>: TLS/SSL, JPEG, ASCII (Encryption & Format)</li>
                  <li><strong>5. Session</strong>: RPC, NetBIOS, Sockets (Dialog Control)</li>
                  <li><strong>4. Transport</strong>: TCP, UDP (End-to-End Segments, Port numbers)</li>
                  <li><strong>3. Network</strong>: IP, ICMP, OSPF, BGP (Packets, Routing, IP)</li>
                  <li><strong>2. Data Link</strong>: Ethernet, Switches, MAC (Frames, Error control)</li>
                  <li><strong>1. Physical</strong>: Cables, Hubs, Bits (Electrical signals)</li>
                </ul>
              </div>

              {/* Card 2: Subnetting Reference */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block uppercase tracking-wider text-[10px]">
                  CIDR IPv4 Subnetting Table
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1 font-bold text-slate-400">
                    <span>CIDR</span>
                    <span>Subnet Mask</span>
                    <span>Usable Hosts</span>
                  </div>
                  <div className="flex justify-between"><span>/24</span><span>255.255.255.0</span><span className="font-bold text-indigo-600">254</span></div>
                  <div className="flex justify-between"><span>/25</span><span>255.255.255.128</span><span className="font-bold text-indigo-600">126</span></div>
                  <div className="flex justify-between"><span>/26</span><span>255.255.255.192</span><span className="font-bold text-indigo-600">62</span></div>
                  <div className="flex justify-between"><span>/27</span><span>255.255.255.224</span><span className="font-bold text-indigo-600">30</span></div>
                  <div className="flex justify-between"><span>/28</span><span>255.255.255.240</span><span className="font-bold text-indigo-600">14</span></div>
                  <div className="flex justify-between"><span>/30</span><span>255.255.255.252</span><span className="font-bold text-indigo-600">2 (P2P)</span></div>
                </div>
              </div>

              {/* Card 3: Ports & TCP 3-Way Handshake */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block uppercase tracking-wider text-[10px]">
                  Key Ports & TCP Handshake
                </span>
                <div className="p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/40 text-[11px] text-sky-900 dark:text-sky-300 space-y-0.5">
                  <div><strong>TCP 3-Way Handshake</strong>:</div>
                  <div>1. Client $\rightarrow$ Server: <code>SYN (Seq = x)</code></div>
                  <div>2. Server $\rightarrow$ Client: <code>SYN-ACK (Seq = y, Ack = x + 1)</code></div>
                  <div>3. Client $\rightarrow$ Server: <code>ACK (Seq = x + 1, Ack = y + 1)</code></div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 dark:text-slate-300 pt-1 font-mono">
                  <div>• SSH: Port 22</div>
                  <div>• DNS: Port 53</div>
                  <div>• HTTP: Port 80</div>
                  <div>• HTTPS: Port 443</div>
                  <div>• MySQL: Port 3306</div>
                  <div>• Redis: Port 6379</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. DBMS & SQL CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("dbms", "database sql normalization 1nf 2nf 3nf bcnf acid delete truncate drop index execution order b+ tree transaction isolation") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("dbms")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  DBMS & SQL Core Concepts
                </h4>
                <span className="text-[11px] text-slate-500">
                  SQL Execution Pipeline, Normalization Rules (1NF-BCNF), and DELETE vs TRUNCATE vs DROP
                </span>
              </div>
            </div>
            {expandedSection.dbms ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.dbms && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: SQL Query Execution Pipeline */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-teal-600 dark:text-teal-400 block uppercase tracking-wider text-[10px]">
                  SQL Clause Execution Order (Critical!)
                </span>
                <ol className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  <li><strong>FROM & JOIN</strong>: Identify tables and cartesian cross.</li>
                  <li><strong>WHERE</strong>: Filter individual candidate rows.</li>
                  <li><strong>GROUP BY</strong>: Aggregate rows into buckets.</li>
                  <li><strong>HAVING</strong>: Filter aggregated groups (WHERE cannot do this).</li>
                  <li><strong>SELECT</strong>: Project desired columns / compute expressions.</li>
                  <li><strong>DISTINCT</strong>: Deduplicate row projections.</li>
                  <li><strong>ORDER BY</strong>: Sort output rows.</li>
                  <li><strong>LIMIT / OFFSET</strong>: Slice output window.</li>
                </ol>
              </div>

              {/* Card 2: Normalization Forms */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-teal-600 dark:text-teal-400 block uppercase tracking-wider text-[10px]">
                  Database Normalization Cheat Table
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  <li>• <strong>1NF</strong>: Atomic values only. No arrays or repeating groups.</li>
                  <li>• <strong>2NF</strong>: 1NF + <strong>No Partial Dependencies</strong> (All non-key attributes fully dependent on whole primary key).</li>
                  <li>• <strong>3NF</strong>: 2NF + <strong>No Transitive Dependencies</strong> (If A $\rightarrow$ B and B $\rightarrow$ C, C must not depend on non-key B).</li>
                  <li>• <strong>BCNF (Boyce-Codd)</strong>: For every functional dependency X $\rightarrow$ Y, <strong>X must be a super key</strong>.</li>
                </ul>
              </div>

              {/* Card 3: DELETE vs TRUNCATE vs DROP */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-teal-600 dark:text-teal-400 block uppercase tracking-wider text-[10px]">
                  DELETE vs TRUNCATE vs DROP
                </span>
                <div className="space-y-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div className="p-2 rounded-lg bg-teal-50/70 dark:bg-teal-950/40">
                    <strong>DELETE (DML)</strong>: Row-by-row. Can use <code>WHERE</code>. Triggers fire. Can ROLLBACK. Slower.
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">
                    <strong>TRUNCATE (DDL)</strong>: Deallocates entire pages. Resets auto-increment. Cannot use WHERE. Cannot ROLLBACK easily. Fast.
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300">
                    <strong>DROP (DDL)</strong>: Destroys table definition AND data entirely from catalog.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. OOPS & DESIGN PATTERNS CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("oops", "object oriented programming solid principles singleton volatile polymorphism encapsulation inheritance abstract interface composition aggregation") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("oops")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  OOPs & Software Design Patterns
                </h4>
                <span className="text-[11px] text-slate-500">
                  SOLID Principles, Composition vs Aggregation, and Thread-Safe Volatile Singleton Snippet
                </span>
              </div>
            </div>
            {expandedSection.oops ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.oops && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: SOLID Principles */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                  SOLID Principles Master Summary
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>S (Single Responsibility)</strong>: A class should have one, and only one, reason to change.</li>
                  <li>• <strong>O (Open/Closed)</strong>: Open for extension, closed for modification (use interfaces/abstract classes).</li>
                  <li>• <strong>L (Liskov Substitution)</strong>: Subtypes must be substitutable for their base types without altering correctness.</li>
                  <li>• <strong>I (Interface Segregation)</strong>: Clients should not be forced to depend on methods they do not use (many small interfaces).</li>
                  <li>• <strong>D (Dependency Inversion)</strong>: High-level modules should depend on abstractions, not concrete implementations.</li>
                </ul>
              </div>

              {/* Card 2: Composition vs Aggregation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                  Association vs Aggregation vs Composition
                </span>
                <div className="space-y-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40">
                    <strong>Composition (Strong "Has-A")</strong>: Part cannot exist without the whole. Death relationship! (e.g., House and Rooms, Car and Engine).
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                    <strong>Aggregation (Weak "Has-A")</strong>: Child can exist independently of parent. (e.g., Department and Teachers; deleting Dept does not delete Teachers).
                  </div>
                </div>
              </div>

              {/* Card 3: Volatile Thread-Safe Singleton */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                    Thread-Safe Double-Checked Singleton
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `class Singleton {\n  private static volatile Singleton instance;\n  private Singleton() {}\n  public static Singleton getInstance() {\n    if (instance == null) {\n      synchronized (Singleton.class) {\n        if (instance == null) {\n          instance = new Singleton();\n        }\n      }\n    }\n    return instance;\n  }\n}`,
                        "singleton"
                      )
                    }
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Copy code snippet"
                  >
                    {copiedKey === "singleton" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="font-mono text-[10px] p-2.5 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto">
{`class Singleton {
  private static volatile Singleton instance;
  private Singleton() {}
  public static Singleton getInstance() {
    if (instance == null) {
      synchronized (Singleton.class) {
        if (instance == null) {
          instance = new Singleton();
        }
      }
    }
    return instance;
  }
}`}
                </pre>
                <p className="text-[10px] text-slate-500">
                  Note: <code>volatile</code> prevents CPU instruction reordering during instantiation.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. DSA COMPLEXITY CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("dsa", "data structures algorithms big-o time complexity space merge quick heap bst sort search hash table") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("dsa")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Data Structures & Sorting Complexity Table
                </h4>
                <span className="text-[11px] text-slate-500">
                  Big-O Time & Space Complexity Master Matrix
                </span>
              </div>
            </div>
            {expandedSection.dsa ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.dsa && (
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Algorithm / Structure</th>
                    <th className="py-2.5 px-3">Average Time</th>
                    <th className="py-2.5 px-3">Worst Time</th>
                    <th className="py-2.5 px-3">Worst Space</th>
                    <th className="py-2.5 px-3">Stable?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">Merge Sort</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(N log N)</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(N log N)</td>
                    <td className="py-2 px-3 text-amber-600">O(N)</td>
                    <td className="py-2 px-3 font-bold text-emerald-600">YES</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">Quick Sort</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(N log N)</td>
                    <td className="py-2 px-3 text-rose-600 font-bold">O(N^2)</td>
                    <td className="py-2 px-3 text-emerald-600">O(log N)</td>
                    <td className="py-2 px-3 font-bold text-rose-500">NO</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">Heap Sort</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(N log N)</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(N log N)</td>
                    <td className="py-2 px-3 text-emerald-600">O(1)</td>
                    <td className="py-2 px-3 font-bold text-rose-500">NO</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">Hash Table Lookup</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(1)</td>
                    <td className="py-2 px-3 text-rose-600">O(N)</td>
                    <td className="py-2 px-3 text-amber-600">O(N)</td>
                    <td className="py-2 px-3 text-slate-400">-</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 dark:text-white">Binary Search Tree (BST)</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">O(log N)</td>
                    <td className="py-2 px-3 text-rose-600">O(N) [skewed]</td>
                    <td className="py-2 px-3 text-amber-600">O(N)</td>
                    <td className="py-2 px-3 text-slate-400">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. SYSTEM DESIGN & DISTRIBUTED SYSTEMS CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("system", "system design distributed cap theorem pacelc consistent hashing caching lru lfu write-through write-back sharding load balancing cdn circuit breaker rate limiter replication") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("system")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  System Design & Distributed Architecture (HLD)
                </h4>
                <span className="text-[11px] text-slate-500">
                  CAP vs PACELC Theorem, Caching Strategies, Consistent Hashing & Sharding
                </span>
              </div>
            </div>
            {expandedSection.system ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.system && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: CAP & PACELC Theorem */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[10px]">
                  CAP & PACELC Tradeoffs
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <li>• <strong>C (Consistency)</strong>: Every read receives latest write or error.</li>
                  <li>• <strong>A (Availability)</strong>: Every non-failing node returns response.</li>
                  <li>• <strong>P (Partition Tolerance)</strong>: System operates despite network drop.</li>
                </ul>
                <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-[11px] text-indigo-900 dark:text-indigo-300">
                  💡 <strong>PACELC Rule</strong>: If <strong>Partition (P)</strong>: Tradeoff between <strong>A</strong> & <strong>C</strong>; <strong>Else (E)</strong>: Tradeoff between <strong>Latency (L)</strong> & <strong>Consistency (C)</strong>. (e.g. Cassandra: PA/EL; MongoDB: PC/EC).
                </div>
              </div>

              {/* Card 2: Caching & Eviction Policies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[10px]">
                  Caching Patterns & Invalidation
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Cache-Aside (Lazy)</strong>: App reads cache; on miss, reads DB then writes to cache.</li>
                  <li>• <strong>Write-Through</strong>: Sync writes to cache AND DB simultaneously. High consistency.</li>
                  <li>• <strong>Write-Behind (Write-Back)</strong>: Writes to cache first, queues async write to DB. Ultra fast, small data loss risk.</li>
                  <li>• <strong>Eviction</strong>: <strong>LRU</strong> (Doubly-Linked List + HashMap O(1)), <strong>LFU</strong> (Min frequency counter).</li>
                </ul>
              </div>

              {/* Card 3: Consistent Hashing & Database Scaling */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[10px]">
                  Consistent Hashing & DB Sharding
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <li>• <strong>Consistent Hashing</strong>: Maps keys & nodes to a 2^32 ring. Only K/N keys remapped on server scale.</li>
                  <li>• <strong>Virtual Nodes (vnodes)</strong>: Prevents hot spots and distributes load uniformly.</li>
                  <li>• <strong>Horizontal Sharding</strong>: Splitting tables across DB instances by Shard Key (Hash-based or Range-based).</li>
                  <li>• <strong>Latency Numbers</strong>: L1 Cache ~0.5ns, RAM ~100ns, NVMe SSD ~100μs, Network Roundtrip cross-region ~150ms.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. CLOUD COMPUTING & DEVOPS CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("cloud", "cloud devops docker kubernetes k8s container pod deployment service clusterip nodeport loadbalancer entrypoint cmd microservices") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("cloud")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Cloud Computing & DevOps (Docker / K8s)
                </h4>
                <span className="text-[11px] text-slate-500">
                  Containerization, Kubernetes Control Plane, Microservices Patterns & 12-Factor App
                </span>
              </div>
            </div>
            {expandedSection.cloud ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.cloud && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: Docker Core Rules */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[10px]">
                  Docker Internals & Directives
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Image vs Container</strong>: Image is immutable layered snapshot; Container is running instance with writable union mount layer.</li>
                  <li>• <strong>ENTRYPOINT vs CMD</strong>: ENTRYPOINT sets fixed executable; CMD supplies default overridable args.</li>
                  <li>• <strong>COPY vs ADD</strong>: COPY is standard local file transfer; ADD extracts tar balls and fetches remote URLs (avoid ADD unless unarchiving).</li>
                  <li>• <strong>Multi-Stage Builds</strong>: Build binaries in heavy SDK image; copy compiled binary into tiny scratch/alpine runtime.</li>
                </ul>
              </div>

              {/* Card 2: Kubernetes Architecture */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[10px]">
                  Kubernetes (K8s) Control Plane & Nodes
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <li>• <strong>kube-apiserver</strong>: Central orchestrator & cluster gateway.</li>
                  <li>• <strong>etcd</strong>: Highly-available distributed key-value store for cluster state.</li>
                  <li>• <strong>kube-scheduler</strong>: Assigns unscheduled Pods to optimal worker nodes.</li>
                  <li>• <strong>kubelet</strong>: Agent running on each node enforcing PodSpecs.</li>
                  <li>• <strong>kube-proxy</strong>: Manages IP routing and iptables/IPVS load balancing.</li>
                </ul>
                <div className="p-2 rounded-lg bg-cyan-50/70 dark:bg-cyan-950/40 text-[11px] text-cyan-900 dark:text-cyan-300">
                  💡 <strong>K8s Service Types</strong>: ClusterIP (Internal only) • NodePort (Port 30000-32767 on all nodes) • LoadBalancer (Cloud external LB).
                </div>
              </div>

              {/* Card 3: Microservices & Cloud Patterns */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider text-[10px]">
                  Resilience Patterns & Cloud Models
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Circuit Breaker</strong>: Closed (Passing) $\rightarrow$ Open (Fail immediately on error threshold) $\rightarrow$ Half-Open (Canary testing).</li>
                  <li>• <strong>Saga Pattern</strong>: Sequence of local transactions with compensating undo actions (replaces 2-Phase Commit in microservices).</li>
                  <li>• <strong>Cloud Models</strong>: <strong>IaaS</strong> (EC2, VMs - OS & app managed by you), <strong>PaaS</strong> (Heroku, App Engine - only app code managed), <strong>SaaS</strong> (Gmail, Salesforce - fully managed).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 8. GIT & SOFTWARE ENGINEERING CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("git_se", "git software engineering agile scrum rebase merge reset cherry-pick testing pyramid tdd burndown story points ci cd") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("git_se")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Git Master Commands & Agile Software Engineering
                </h4>
                <span className="text-[11px] text-slate-500">
                  Rebase vs Merge, Reset Modes, Testing Pyramid, TDD, and Scrum Ceremonies
                </span>
              </div>
            </div>
            {expandedSection.git_se ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.git_se && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: Git Commands & Internals */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                  Git Internals & Command Mastery
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <li>• <strong>git rebase vs merge</strong>: Merge preserves true commit topology with a merge commit. Rebase rewires commits linearly onto base (never rebase shared public branches!).</li>
                  <li>• <strong>git reset --soft</strong>: Moves HEAD only; files remain in Staging.</li>
                  <li>• <strong>git reset --mixed (default)</strong>: Moves HEAD + unstages files; working directory unmodified.</li>
                  <li>• <strong>git reset --hard</strong>: Discards all changes in HEAD, Staging & Working Tree!</li>
                  <li>• <strong>git cherry-pick &lt;hash&gt;</strong>: Replays a specific commit onto current branch.</li>
                </ul>
              </div>

              {/* Card 2: Agile, Scrum & SDLC */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                  Scrum Framework & Artifacts
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>4 Scrum Ceremonies</strong>:
                    <br />1. <strong>Sprint Planning</strong> (Scope sprint goals from backlog).
                    <br />2. <strong>Daily Standup</strong> (15 min: Done, Doing, Impediments).
                    <br />3. <strong>Sprint Review</strong> (Feature demo to stakeholders).
                    <br />4. <strong>Retrospective</strong> (Internal team process optimization).
                  </li>
                  <li>• <strong>Burndown Chart</strong>: Tracks remaining effort (story points) over sprint days.</li>
                  <li>• <strong>Product Owner vs Scrum Master</strong>: PO defines "What" (prioritizes backlog); SM facilitates "How" (clears blockers, protects team).</li>
                </ul>
              </div>

              {/* Card 3: Testing Pyramid & CI/CD */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                  Testing Pyramid & Deployment Strategies
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Testing Pyramid</strong>: <strong>Unit (~70%)</strong>: Fast, mocked dependencies $\rightarrow$ <strong>Integration (~20%)</strong>: Tests DB/API contracts $\rightarrow$ <strong>E2E (~10%)</strong>: Full user journey in browser.</li>
                  <li>• <strong>TDD Lifecycle</strong>: <strong>Red</strong> (Write failing test) $\rightarrow$ <strong>Green</strong> (Write minimal code to pass) $\rightarrow$ <strong>Refactor</strong> (Improve architecture).</li>
                  <li>• <strong>Blue/Green Deployment</strong>: Two identical production environments; instant traffic routing switch via load balancer with zero downtime.</li>
                  <li>• <strong>Canary Release</strong>: Route 5% user traffic to new version; monitor error telemetry before global rollout.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 9. COMPUTER ARCHITECTURE & ORGANIZATION (COA) CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("coa", "computer organization architecture coa cache mapping memory hierarchy pipelining hazards structural raw war waw cpi little endian big endian") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("coa")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Computer Organization & Architecture (COA)
                </h4>
                <span className="text-[11px] text-slate-500">
                  Cache Mapping Techniques, Pipeline Hazards, Memory Hierarchy & Endianness
                </span>
              </div>
            </div>
            {expandedSection.coa ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.coa && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: Cache Mapping & 3 C's */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                  Cache Mapping & Miss Types
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Direct Mapped</strong>: Block maps to exactly 1 line: (Block Address mod Num Lines). Fast, high conflict misses.</li>
                  <li>• <strong>Fully Associative</strong>: Block can go in ANY line. No conflict misses; requires associative search hardware.</li>
                  <li>• <strong>Set-Associative (K-way)</strong>: Cache divided into sets of K lines: (Block Address mod Num Sets).</li>
                  <li>• <strong>The 3 C's of Cache Misses</strong>:
                    <br />1. <strong>Compulsory / Cold</strong>: First access to a block.
                    <br />2. <strong>Capacity</strong>: Working set exceeds cache capacity.
                    <br />3. <strong>Conflict / Collision</strong>: Multiple blocks compete for same set.
                  </li>
                </ul>
              </div>

              {/* Card 2: Pipelining & Hazards */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                  5-Stage RISC Pipeline & Hazards
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <li>• Stages: IF (Fetch) $\rightarrow$ ID (Decode) $\rightarrow$ EX (Execute) $\rightarrow$ MEM $\rightarrow$ WB (Write Back). Ideal CPI = 1.</li>
                  <li>• <strong>Structural Hazard</strong>: Hardware resource conflict (e.g. single memory port accessed for IF and MEM). Solved with Harvard architecture.</li>
                  <li>• <strong>Data Hazards</strong>:
                    <br />- <strong>RAW (Read-After-Write)</strong>: True dependency. Solved with Operand Forwarding / Bypassing or NOP stall.
                    <br />- <strong>WAR & WAW</strong>: Solved with register renaming.
                  </li>
                  <li>• <strong>Control Hazard</strong>: Branch decisions. Solved with Dynamic Branch Prediction & Branch Target Buffer (BTB).</li>
                </ul>
              </div>

              {/* Card 3: Memory Hierarchy & Endianness */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                  Memory Organization & Endianness
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>Little Endian (x86, ARM)</strong>: Least Significant Byte (LSB) stored at lowest memory address. (e.g. 0x12345678 $\rightarrow$ 78 at Addr 0, 12 at Addr 3).</li>
                  <li>• <strong>Big Endian (Network standard TCP/IP)</strong>: Most Significant Byte (MSB) stored at lowest memory address.</li>
                  <li>• <strong>Principle of Locality</strong>:
                    <br />- <strong>Temporal Locality</strong>: Recently referenced items likely referenced again soon (Loops, variables).
                    <br />- <strong>Spatial Locality</strong>: Items with nearby addresses likely referenced soon (Array traversals).
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 10. COMPILER DESIGN & THEORY OF COMPUTATION (TOC) CHEAT SHEET */}
      {/* =================================================================== */}
      {isSubjectVisible("toc", "theory of computation compiler design toc cd chomsky hierarchy dfa nfa pda turing machine lexical syntax parser semantic ll lr shift reduce conflict first follow") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div
            onClick={() => toggleSection("toc")}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 pb-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/70 border border-fuchsia-200 dark:border-fuchsia-800 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Theory of Computation (TOC) & Compiler Design (CD)
                </h4>
                <span className="text-[11px] text-slate-500">
                  Chomsky Hierarchy, DFA vs NFA, 6 Compiler Phases, LL(1) vs LR Parsing Conflicts
                </span>
              </div>
            </div>
            {expandedSection.toc ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {expandedSection.toc && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {/* Card 1: Chomsky Hierarchy */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-fuchsia-600 dark:text-fuchsia-400 block uppercase tracking-wider text-[10px]">
                  Chomsky Automata Hierarchy
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <li>• <strong>Type 3 (Regular)</strong>: Finite Automata (DFA/NFA) $\leftrightarrow$ RegEx. (Cannot count: a^n b^n is NOT regular).</li>
                  <li>• <strong>Type 2 (Context-Free)</strong>: Pushdown Automata (PDA) with stack. (a^n b^n is CFL).</li>
                  <li>• <strong>Type 1 (Context-Sensitive)</strong>: Linear Bounded Automata (LBA). (a^n b^n c^n is CSL).</li>
                  <li>• <strong>Type 0 (Unrestricted)</strong>: Turing Machine (Recursively Enumerable). Equivalent to modern general computers.</li>
                </ul>
                <div className="p-2 rounded-lg bg-fuchsia-50/70 dark:bg-fuchsia-950/40 text-[11px] text-fuchsia-900 dark:text-fuchsia-300">
                  💡 <strong>Equivalence</strong>: Every NFA can be converted to an equivalent DFA (using subset construction, worst-case 2^N states).
                </div>
              </div>

              {/* Card 2: 6 Compiler Phases */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-fuchsia-600 dark:text-fuchsia-400 block uppercase tracking-wider text-[10px]">
                  6 Phases of a Compiler
                </span>
                <ol className="space-y-1 text-slate-700 dark:text-slate-300 list-decimal list-inside text-[11px]">
                  <li><strong>Lexical Analyzer</strong>: Streams characters $\rightarrow$ Tokens. Tool: Lex/Flex.</li>
                  <li><strong>Syntax Analyzer</strong>: Constructs Parse Tree from tokens. Tool: Yacc/Bison.</li>
                  <li><strong>Semantic Analyzer</strong>: Type checking, scope and declaration validation.</li>
                  <li><strong>Intermediate Code Gen</strong>: Three-Address Code (TAC), Quadruples.</li>
                  <li><strong>Code Optimizer</strong>: Dead code elimination, constant folding, loop invariants.</li>
                  <li><strong>Target Code Gen</strong>: Maps IR to machine instructions and register allocation.</li>
                </ol>
              </div>

              {/* Card 3: Top-Down vs Bottom-Up Parsers */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="font-extrabold text-fuchsia-600 dark:text-fuchsia-400 block uppercase tracking-wider text-[10px]">
                  Parsing Techniques & Conflicts
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li>• <strong>LL(1) (Top-Down)</strong>: Left-to-right scan, Leftmost derivation, 1 lookahead. Fails if grammar has Left Recursion or lacks Left Factoring.</li>
                  <li>• <strong>LR Parsers (Bottom-Up)</strong>: Power hierarchy: <strong>LR(0) &lt; SLR(1) &lt; LALR(1) &lt; LR(1)</strong>. Uses Shift-Reduce actions.</li>
                  <li>• <strong>Shift-Reduce Conflict</strong>: Parser cannot decide whether to shift next token or reduce current stack symbols into non-terminal (Classic "Dangling Else" problem).</li>
                  <li>• <strong>Reduce-Reduce Conflict</strong>: Parser cannot decide which production to reduce to. Usually indicates ambiguous grammar.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
