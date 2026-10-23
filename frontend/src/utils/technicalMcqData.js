export const MCQ_LANGUAGES = [
  "All",
  "Operating Systems (OS)",
  "Computer Networks (CN)",
  "DBMS & Database Architecture",
  "OOPs & Software Design",
  "DSA & Algorithms",
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "SQL"
];

export const MCQ_COMPANIES = [
  "All Companies",
  "TCS",
  "Infosys",
  "Wipro",
  "Cognizant",
  "Accenture",
  "Capgemini",
  "Amazon",
  "Microsoft",
  "Zoho",
  "Tech Mahindra"
];

export const TECHNICAL_MCQS = [
  // ==========================================
  // PYTHON MCQS
  // ==========================================
  {
    id: "py-1",
    language: "Python",
    difficulty: "Intermediate",
    topic: "Default Mutable Arguments",
    companies: ["Amazon", "Microsoft", "TCS", "Infosys"],
    question: "What is the output of the following Python snippet?",
    code: `def append_to(element, target=[]):
    target.append(element)
    return target

my_list = append_to(1)
print(append_to(2))`,
    options: [
      "[1, 2]",
      "[2]",
      "[[1], 2]",
      "TypeError: cannot append to default argument"
    ],
    correctIndex: 0,
    explanation:
      "In Python, default arguments are evaluated only ONCE when the function definition is executed, NOT each time the function is called. Because 'target' references the same mutable list object across calls, appending 2 mutates the same list that already contains 1, yielding [1, 2]."
  },
  {
    id: "py-2",
    language: "Python",
    difficulty: "Advanced",
    topic: "Closure & Late Binding",
    companies: ["Google", "Amazon", "Zoho"],
    question: "What will be printed when running this list comprehension of lambdas?",
    code: `multipliers = [lambda x: i * x for i in range(4)]
print([m(2) for m in multipliers])`,
    options: [
      "[6, 6, 6, 6]",
      "[0, 2, 4, 6]",
      "[0, 1, 2, 3]",
      "[2, 4, 6, 8]"
    ],
    correctIndex: 0,
    explanation:
      "Python's closures are late-binding: variables used in lambda bodies are looked up at the time the inner function is CALLED. By the time the lambdas are executed, the loop has completed and 'i' has the final value 3. Therefore, all lambdas compute 3 * 2 = 6, producing [6, 6, 6, 6]."
  },
  {
    id: "py-3",
    language: "Python",
    difficulty: "Intermediate",
    topic: "GIL & Concurrency",
    companies: ["Google", "Amazon", "Cognizant"],
    question: "Why does multi-threading using Python's standard `threading` module not provide speedup for CPU-bound tasks in CPython?",
    code: null,
    options: [
      "The Global Interpreter Lock (GIL) permits only one native thread to execute Python bytecode at a time",
      "Python threads are green threads that cannot bind to OS cores",
      "CPython does not support multi-core CPUs",
      "CPU cache coherence prevents multi-threading in interpreted languages"
    ],
    correctIndex: 0,
    explanation:
      "The Global Interpreter Lock (GIL) is a mutex in CPython that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. For CPU-bound tasks, multiprocessing or C-extensions are required to bypass the GIL."
  },
  {
    id: "py-4",
    language: "Python",
    difficulty: "Intermediate",
    topic: "Tuple Mutability Trap",
    companies: ["TCS", "Infosys", "Wipro"],
    question: "What happens when you run the following code?",
    code: `t = (1, 2, [30, 40])
try:
    t[2] += [50, 60]
except Exception as e:
    print(type(e).__name__)
print(t)`,
    options: [
      "TypeError followed by (1, 2, [30, 40, 50, 60])",
      "TypeError followed by (1, 2, [30, 40])",
      "No error, prints (1, 2, [30, 40, 50, 60])",
      "AttributeError followed by unchanged tuple"
    ],
    correctIndex: 0,
    explanation:
      "The in-place operator += first mutates the list via list.extend (so [30, 40, 50, 60] is updated in place), but then attempts to reassign the result to t[2]. Because tuples are immutable, the assignment raises a TypeError, yet the underlying list was already mutated!"
  },
  {
    id: "py-5",
    language: "Python",
    difficulty: "Beginner",
    topic: "Identity vs Equality",
    companies: ["TCS", "Cognizant", "Accenture"],
    question: "What is the output of the following comparison in CPython?",
    code: `a = 256
b = 256
c = 300
d = 300
print(a is b, c is d)`,
    options: [
      "True False (in standard REPL/interactive mode)",
      "True True",
      "False False",
      "False True"
    ],
    correctIndex: 0,
    explanation:
      "CPython pre-allocates and caches an internal array of integer objects for small integers in the range [-5, 256]. Thus, 256 shares the exact same memory address (a is b is True). However, 300 exceeds the cache boundary and allocates separate heap objects in interactive mode."
  },
  {
    id: "py-6",
    language: "Python",
    difficulty: "Intermediate",
    topic: "List Replication Reference Trap",
    companies: ["TCS Digital", "Cognizant GenC Next", "Amazon", "Infosys"],
    question: "What is the output of this Python 2D matrix initialization?",
    code: `matrix = [[0] * 3] * 3
matrix[0][0] = 7
print(matrix)`,
    options: [
      "[[7, 0, 0], [7, 0, 0], [7, 0, 0]]",
      "[[7, 0, 0], [0, 0, 0], [0, 0, 0]]",
      "[[7, 7, 7], [0, 0, 0], [0, 0, 0]]",
      "IndexError: list assignment out of range"
    ],
    correctIndex: 0,
    explanation:
      "The multiplication operator * replicates references, not deep copies. The outer list contains 3 references to the EXACT same inner list [0, 0, 0]. Mutating matrix[0][0] alters the single shared list object, reflecting in all three rows."
  },
  {
    id: "py-7",
    language: "Python",
    difficulty: "Beginner",
    topic: "Unhashable Dictionary Keys",
    companies: ["Infosys", "Accenture", "Wipro", "TCS"],
    question: "Which of the following Python data types CANNOT be used as a key in a dictionary?",
    code: null,
    options: [
      "list (e.g. `[1, 2]`)",
      "tuple (e.g. `(1, 2)`)",
      "frozenset",
      "str (e.g. `'key'`)"
    ],
    correctIndex: 0,
    explanation:
      "Dictionary keys in Python must be hashable and immutable so their hash value remains constant. Lists are mutable and unhashable, raising `TypeError: unhashable type: 'list'`. Tuples with immutable contents, frozensets, and strings are hashable and valid."
  },
  {
    id: "py-8",
    language: "Python",
    difficulty: "Beginner",
    topic: "Negative Step String Slicing",
    companies: ["TCS", "Capgemini", "Cognizant", "Tech Mahindra"],
    question: "What is the result of `s[::-1]` on the string `s = 'Interview'`?",
    code: `s = 'Interview'
print(s[::-1])`,
    options: [
      "'weivretnI'",
      "'Interview'",
      "'I'",
      "SyntaxError: invalid slice step"
    ],
    correctIndex: 0,
    explanation:
      "A slice step of -1 traverses the sequence in reverse order from end to start, reversing the string to produce 'weivretnI'."
  },
  {
    id: "py-9",
    language: "Python",
    difficulty: "Intermediate",
    topic: "LEGB Variable Scope Resolution",
    companies: ["Amazon", "Infosys", "Tech Mahindra", "Zoho"],
    question: "In what order does Python resolve variable names according to the LEGB rule?",
    code: null,
    options: [
      "Local -> Enclosing -> Global -> Built-in",
      "Local -> Global -> Enclosing -> Built-in",
      "Global -> Local -> Enclosing -> Built-in",
      "Built-in -> Global -> Enclosing -> Local"
    ],
    correctIndex: 0,
    explanation:
      "Python searches for variable names in the following order: Local (inside current function), Enclosing (enclosing functions / closures), Global (module level), and Built-in (Python built-in namespace like len, range)."
  },
  {
    id: "py-10",
    language: "Python",
    difficulty: "Beginner",
    topic: "Identity vs Equality on Mutable Objects",
    companies: ["Zoho", "Cognizant", "TCS", "Wipro"],
    question: "What will be printed by the following comparison?",
    code: `list1 = [1, 2, 3]
list2 = [1, 2, 3]
print(list1 == list2, list1 is list2)`,
    options: [
      "True False",
      "True True",
      "False False",
      "False True"
    ],
    correctIndex: 0,
    explanation:
      "`==` evaluates value equality (contents are identical, so True). `is` evaluates object identity (whether they reside at the exact same memory address). Because list1 and list2 are separately allocated lists on the heap, list1 is list2 is False."
  },

  // ==========================================
  // JAVASCRIPT MCQS
  // ==========================================
  {
    id: "js-1",
    language: "JavaScript",
    difficulty: "Advanced",
    topic: "Event Loop & Microtasks",
    companies: ["Amazon", "Uber", "Flipkart", "Accenture"],
    question: "What is the exact console output order of the following snippet?",
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    options: [
      "1, 4, 3, 2",
      "1, 3, 4, 2",
      "1, 4, 2, 3",
      "1, 2, 3, 4"
    ],
    correctIndex: 0,
    explanation:
      "Synchronous statements execute first ('1', '4'). Promises queue in the Microtask Queue, while setTimeout queues in the Macrotask (Callback) Queue. The JS Event Loop always drains the entire Microtask queue before picking the next macrotask, so '3' logs before '2'."
  },
  {
    id: "js-2",
    language: "JavaScript",
    difficulty: "Intermediate",
    topic: "Hoisting & Temporal Dead Zone",
    companies: ["Infosys", "TCS", "Cognizant", "Capgemini"],
    question: "What will be printed to the console?",
    code: `var x = 10;
function test() {
    console.log(x);
    var x = 20;
}
test();`,
    options: [
      "undefined",
      "10",
      "20",
      "ReferenceError: x is not defined"
    ],
    correctIndex: 0,
    explanation:
      "Inside the function test(), the local variable declaration 'var x' is hoisted to the top of the function scope with value 'undefined'. When console.log(x) executes, it references the hoisted local 'x' prior to assignment, logging undefined instead of the global 10."
  },
  {
    id: "js-3",
    language: "JavaScript",
    difficulty: "Intermediate",
    topic: "Arrow Function this Binding",
    companies: ["Microsoft", "Zoho", "Accenture"],
    question: "What will `obj.getRegular()` and `obj.getArrow()` log?",
    code: `const obj = {
    name: 'InterviewAI',
    getRegular: function() { return this.name; },
    getArrow: () => this.name
};
console.log(obj.getRegular(), obj.getArrow());`,
    options: [
      "'InterviewAI' undefined (or window.name in browser)",
      "'InterviewAI' 'InterviewAI'",
      "undefined undefined",
      "TypeError: this.name is not a function"
    ],
    correctIndex: 0,
    explanation:
      "Regular functions dynamically bind 'this' to the caller object (obj). Arrow functions do NOT have their own 'this' binding—they inherit 'this' lexically from the enclosing scope (which is the module/global window object, not obj)."
  },
  {
    id: "js-4",
    language: "JavaScript",
    difficulty: "Beginner",
    topic: "Type Coercion",
    companies: ["TCS", "Wipro", "Cognizant"],
    question: "What does the expression `[] + {}` and `[] == false` evaluate to in JavaScript console?",
    code: `console.log([] + {});
console.log([] == false);`,
    options: [
      '"[object Object]" and true',
      '"[object Object]" and false',
      '"0" and true',
      'TypeError and false'
    ],
    correctIndex: 0,
    explanation:
      "[] converts to empty string '', and {} converts to string '[object Object]', so '' + '[object Object]' is '[object Object]'. For [] == false, both coerce to numbers: Number([]) is 0 and Number(false) is 0, evaluating to true."
  },
  {
    id: "js-5",
    language: "JavaScript",
    difficulty: "Intermediate",
    topic: "Array Closures with var vs let",
    companies: ["Amazon", "Infosys", "Flipkart"],
    question: "What does the following loop print?",
    code: `for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 10);
}`,
    options: [
      "3, 3, 3",
      "0, 1, 2",
      "undefined, undefined, undefined",
      "2, 2, 2"
    ],
    correctIndex: 0,
    explanation:
      "Variables declared with 'var' are function-scoped, not block-scoped. All 3 timer callbacks share the single variable 'i'. By the time the callbacks fire 10ms later, the loop has finished and i equals 3."
  },

  // ==========================================
  // JAVA MCQS
  // ==========================================
  {
    id: "java-1",
    language: "Java",
    difficulty: "Intermediate",
    topic: "String Pool & Immutability",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture"],
    question: "What does the following Java snippet print?",
    code: `String s1 = "Interview";
String s2 = new String("Interview");
String s3 = s2.intern();

System.out.println((s1 == s2) + " " + (s1 == s3));`,
    options: [
      "false true",
      "true true",
      "false false",
      "true false"
    ],
    correctIndex: 0,
    explanation:
      "s1 resides in the String Constant Pool. s2 uses 'new String()' which forces allocation of a distinct object on the heap, so s1 == s2 is false. Calling s2.intern() returns the canonical pool reference matching s1, so s1 == s3 is true."
  },
  {
    id: "java-2",
    language: "Java",
    difficulty: "Intermediate",
    topic: "Try-Catch-Finally Execution Order",
    companies: ["Infosys", "Cognizant", "Capgemini"],
    question: "What value does `compute()` return?",
    code: `public static int compute() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
    options: [
      "2",
      "1",
      "Compilation Error: unreachable code",
      "Runtime Exception"
    ],
    correctIndex: 0,
    explanation:
      "In Java, the finally block is guaranteed to execute before the method returns. If the finally block explicitly executes a return statement, it overrides any prior return statement initiated inside the try or catch block."
  },
  {
    id: "java-3",
    language: "Java",
    difficulty: "Advanced",
    topic: "Generics & Type Erasure",
    companies: ["Amazon", "Microsoft", "TCS"],
    question: "Why does the following Java method fail to compile?",
    code: `public class Test {
    public void print(List<String> list) {}
    public void print(List<Integer> list) {}
}`,
    options: [
      "Both methods have the same erasure `print(List)` after compilation",
      "Method overloading does not support collections",
      "Java Generics do not allow Integer lists",
      "Compile error: ambiguous return type"
    ],
    correctIndex: 0,
    explanation:
      "Java implements generics via Type Erasure for backwards compatibility. At compile time, type arguments are erased to raw types, meaning both signatures reduce to `print(List)`. Two methods with identical parameters in the same class cause a method collision error."
  },
  {
    id: "java-4",
    language: "Java",
    difficulty: "Intermediate",
    topic: "ConcurrentHashMap vs Hashtable",
    companies: ["Amazon", "Google", "Oracle"],
    question: "How does `ConcurrentHashMap` achieve high concurrency without locking the entire map?",
    code: null,
    options: [
      "It locks at the bucket/node level (using CAS and synchronized on individual node bins) rather than the entire table",
      "It makes the map completely immutable",
      "It spins up a background thread for every read operation",
      "It duplicates the map in memory for each thread"
    ],
    correctIndex: 0,
    explanation:
      "In modern Java (Java 8+), ConcurrentHashMap uses lock-free Compare-And-Swap (CAS) operations for node insertions and locks only the individual head bucket node (`synchronized`) during hash collisions, allowing concurrent writes to different buckets."
  },
  {
    id: "java-5",
    language: "Java",
    difficulty: "Beginner",
    topic: "Integer Wrapper Caching",
    companies: ["TCS", "Infosys", "Wipro"],
    question: "What is printed by the following Integer wrapper comparison?",
    code: `Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;

System.out.println((a == b) + " " + (c == d));`,
    options: [
      "true false",
      "true true",
      "false false",
      "Compilation error"
    ],
    correctIndex: 0,
    explanation:
      "Java caches Integer objects for values in the range [-128, 127] via IntegerCache. Autoboxing within this range returns the same cached reference (a == b is true). Beyond 127, new Integer objects are allocated on the heap (c == d is false)."
  },
  {
    id: "java-6",
    language: "Java",
    difficulty: "Intermediate",
    topic: "equals() and hashCode() Contract",
    companies: ["Amazon", "Infosys", "Cognizant"],
    question: "What happens if a class overrides `equals()` but FAILS to override `hashCode()` when stored in a `HashSet`?",
    code: null,
    options: [
      "Logically equal objects may be assigned to different hash buckets, causing duplicate entries in the HashSet",
      "A runtime `IllegalStateException` is thrown upon insertion",
      "The HashSet will automatically compute MD5 hashes instead",
      "The code will fail to compile"
    ],
    correctIndex: 0,
    explanation:
      "The Java Object contract states: equal objects must have equal hash codes. If hashCode() is not overridden, two objects that return true for equals() may compute different memory-based hash codes, landing in different buckets and violating HashSet uniqueness."
  },
  {
    id: "java-7",
    language: "Java",
    difficulty: "Intermediate",
    topic: "Widening vs Autoboxing Overloading Priority",
    companies: ["TCS", "Cognizant", "Infosys", "Amazon"],
    question: "What does the following Java code print?",
    code: `public class Test {
    static void test(long x) { System.out.print("long "); }
    static void test(Integer x) { System.out.print("Integer "); }

    public static void main(String[] args) {
        int val = 10;
        test(val);
    }
}`,
    options: [
      "long",
      "Integer",
      "Compilation error: ambiguous method call",
      "Runtime exception"
    ],
    correctIndex: 0,
    explanation:
      "Java's method resolution order prioritizes primitive widening over autoboxing for backwards compatibility (Java 1.4 rules before Java 5 boxing). An 'int' widens to 'long' before it will be boxed to 'Integer'."
  },
  {
    id: "java-8",
    language: "Java",
    difficulty: "Beginner",
    topic: "String Immutability & Reassignment",
    companies: ["Infosys", "Wipro", "Accenture", "TCS"],
    question: "What will be printed when running this Java snippet?",
    code: `public class Main {
    public static void main(String[] args) {
        String s = "Campus";
        s.concat(" Placement");
        System.out.println(s);
    }
}`,
    options: [
      "Campus",
      "Campus Placement",
      "Placement",
      "NullPointerException"
    ],
    correctIndex: 0,
    explanation:
      "String objects in Java are immutable. Calling s.concat(' Placement') creates and returns a brand-new String object 'Campus Placement', but because this return value was not reassigned back to 's' (i.e. s = s.concat(...)), 's' remains unchanged as 'Campus'."
  },
  {
    id: "java-9",
    language: "Java",
    difficulty: "Intermediate",
    topic: "Static Block vs Constructor Execution Order",
    companies: ["Capgemini", "Cognizant", "TCS", "Accenture"],
    question: "In what order do static blocks, instance initialization blocks, and constructors execute when an object is instantiated for the first time?",
    code: null,
    options: [
      "Static blocks -> Instance initialization blocks -> Constructor",
      "Constructor -> Instance initialization blocks -> Static blocks",
      "Instance initialization blocks -> Constructor -> Static blocks",
      "Static blocks -> Constructor -> Instance initialization blocks"
    ],
    correctIndex: 0,
    explanation:
      "When a class is first referenced, the JVM classloader executes static blocks once. Then, for each new instance, instance initialization blocks execute, and finally the constructor executes."
  },
  {
    id: "java-10",
    language: "Java",
    difficulty: "Beginner",
    topic: "Checked vs Unchecked Exceptions",
    companies: ["Accenture", "Amazon", "Infosys", "Wipro"],
    question: "Which of the following exceptions in Java is an Unchecked exception?",
    code: null,
    options: [
      "NullPointerException",
      "IOException",
      "SQLException",
      "ClassNotFoundException"
    ],
    correctIndex: 0,
    explanation:
      "Unchecked exceptions inherit from java.lang.RuntimeException (or Error). NullPointerException, ArithmeticException, and ArrayIndexOutOfBoundsException are unchecked and do not require mandatory try-catch or throws clauses. IOException and SQLException are checked exceptions."
  },
  {
    id: "java-11",
    language: "Java",
    difficulty: "Intermediate",
    topic: "Abstract Class Constructors",
    companies: ["Zoho", "TCS", "Wipro", "Cognizant"],
    question: "Can an abstract class in Java have a constructor?",
    code: null,
    options: [
      "Yes, and it is invoked via `super()` when a concrete subclass is instantiated",
      "No, abstract classes cannot have constructors because they cannot be instantiated",
      "Yes, but only if the constructor is declared `public abstract`",
      "No, abstract classes can only contain static methods"
    ],
    correctIndex: 0,
    explanation:
      "Abstract classes can define constructors. Although you cannot instantiate an abstract class directly using `new`, its constructor is called whenever an instance of its concrete subclass is created to initialize inherited fields."
  },

  // ==========================================
  // C++ MCQS
  // ==========================================
  {
    id: "cpp-1",
    language: "C++",
    difficulty: "Advanced",
    topic: "Virtual Destructors & Memory Leaks",
    companies: ["Microsoft", "Amazon", "Zoho"],
    question: "What happens if a base class destructor is NOT declared virtual in C++ when deleting a derived object through a base pointer?",
    code: `class Base {
public:
    ~Base() { cout << "~Base "; }
};
class Derived : public Base {
public:
    ~Derived() { cout << "~Derived "; }
};

Base* b = new Derived();
delete b;`,
    options: [
      "Undefined behavior (typically only ~Base() is called, causing a resource leak in Derived)",
      "Both ~Derived() and ~Base() are called in correct order",
      "Compilation error: cannot delete base pointer",
      "Segmentation fault immediately upon compilation"
    ],
    correctIndex: 0,
    explanation:
      "Deleting a derived class object through a pointer to a base class without a virtual destructor results in undefined behavior (C++ standard §5.3.5/3). In practice, static binding invokes only the base destructor, leaking derived class resources."
  },
  {
    id: "cpp-2",
    language: "C++",
    difficulty: "Intermediate",
    topic: "std::move & Rvalue References",
    companies: ["Google", "Microsoft", "Amazon"],
    question: "What does `std::move(x)` actually do in C++11?",
    code: null,
    options: [
      "It casts an expression to an rvalue reference (T&&) without moving any memory bytes by itself",
      "It automatically deallocates x from the stack and transfers it to the heap",
      "It performs an asynchronous memcpy operation",
      "It creates a deep copy of x and deletes the original"
    ],
    correctIndex: 0,
    explanation:
      "std::move does NOT move any memory or data on its own. It is an unconditional static_cast that casts an lvalue to an rvalue reference (`static_cast<T&&>(x)`), enabling the compiler to select move constructors or move assignment operators."
  },
  {
    id: "cpp-3",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Smart Pointers: unique_ptr vs shared_ptr",
    companies: ["Amazon", "Microsoft", "TCS"],
    question: "Which smart pointer does NOT incur reference counting overhead and guarantees sole ownership of a resource?",
    code: null,
    options: [
      "std::unique_ptr",
      "std::shared_ptr",
      "std::weak_ptr",
      "std::auto_ptr"
    ],
    correctIndex: 0,
    explanation:
      "std::unique_ptr represents exclusive ownership with zero overhead over a raw pointer (RAII). It cannot be copied, only moved, and incurs zero reference count allocation cost."
  },
  {
    id: "cpp-4",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Constructor & Destructor Order",
    companies: ["Infosys", "TCS", "Cognizant"],
    question: "In what order are constructors and destructors invoked when an instance of Derived (inheriting from Base) is created and destroyed?",
    code: null,
    options: [
      "Base constructor -> Derived constructor -> Derived destructor -> Base destructor",
      "Derived constructor -> Base constructor -> Base destructor -> Derived destructor",
      "Base constructor -> Derived constructor -> Base destructor -> Derived destructor",
      "Derived constructor -> Derived destructor -> Base constructor -> Base destructor"
    ],
    correctIndex: 0,
    explanation:
      "In C++, base subobjects are initialized before derived members (Base constructor first, then Derived). Destruction proceeds in exact reverse order of construction: Derived destructor cleans up first, followed by Base destructor."
  },
  {
    id: "cpp-5",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Const Reference Lifetime Extension",
    companies: ["Microsoft", "Zoho", "Capgemini"],
    question: "What happens in C++ when a temporary rvalue is bound to a `const &` (const lvalue reference)?",
    code: `const std::string& ref = std::string("Interview") + "AI";`,
    options: [
      "The lifetime of the temporary object is extended to match the lifetime of the const reference",
      "Immediate dangling reference causing undefined behavior upon read",
      "Compilation error: cannot bind temporary to reference",
      "The string is copied into global static memory"
    ],
    correctIndex: 0,
    explanation:
      "Under C++ standard rules, binding a temporary object to a const lvalue reference (or an rvalue reference) extends the lifetime of the temporary to match the lifetime of the reference itself, preventing a dangling reference."
  },
  {
    id: "cpp-6",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Diamond Problem & Virtual Base Class",
    companies: ["Infosys", "Accenture", "TCS", "Capgemini"],
    question: "In C++, how is the classic 'Diamond Problem' of multiple inheritance solved to prevent duplicate base class instances?",
    code: null,
    options: [
      "By inheriting from the common base class using the `virtual` keyword (`class B : virtual public A`)",
      "By marking all base class member variables `private`",
      "By declaring multiple friend classes",
      "C++ does not support multiple inheritance"
    ],
    correctIndex: 0,
    explanation:
      "In the diamond hierarchy (D inherits from B and C, which both inherit from A), using virtual inheritance (`virtual public A`) guarantees that only a single, shared subobject of base class A exists in the most-derived class D, eliminating ambiguity."
  },
  {
    id: "cpp-7",
    language: "C++",
    difficulty: "Beginner",
    topic: "Friend Functions & Encapsulation",
    companies: ["Cognizant", "Amazon", "Capgemini", "TCS"],
    question: "What special access permissions does a `friend` function possess in C++?",
    code: null,
    options: [
      "It can access both private and protected members of the class in which it is declared as a friend",
      "It can only access public members",
      "It can access private members only if the function is also static",
      "It becomes a member function of the class automatically"
    ],
    correctIndex: 0,
    explanation:
      "A friend function is not a member of the class, but is granted special non-member access privileges to all private and protected members of the declaring class."
  },
  {
    id: "cpp-8",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Static Member Functions & this Pointer",
    companies: ["Zoho", "Infosys", "Wipro", "Amazon"],
    question: "Why cannot a `static` member function access non-static member variables or call non-static methods in C++?",
    code: null,
    options: [
      "Static member functions are invoked at the class level and do not receive an implicit `this` pointer",
      "Static methods run in kernel mode while non-static run in user mode",
      "Static methods cannot return any value",
      "Static member variables are stored in registers"
    ],
    correctIndex: 0,
    explanation:
      "Non-static members require a specific object instance identified by the hidden `this` pointer. Since static member functions belong to the class as a whole and have no `this` pointer, they cannot access non-static instance fields directly."
  },
  {
    id: "cpp-9",
    language: "C++",
    difficulty: "Intermediate",
    topic: "Default Copy Constructor & Shallow Copy",
    companies: ["Amazon", "Microsoft", "TCS", "Infosys"],
    question: "What dangerous problem arises when a class containing raw heap pointers relies on the compiler-generated default copy constructor?",
    code: null,
    options: [
      "The default copy constructor performs a shallow copy, causing both objects to point to the same heap address and triggering a double-free crash upon destruction",
      "The heap pointer is automatically freed during copying",
      "A compilation error is generated whenever dynamic memory is present",
      "The copied pointer is set to NULL automatically"
    ],
    correctIndex: 0,
    explanation:
      "The default copy constructor performs member-wise (shallow) copying. If a class member is a raw pointer to heap memory, both instances share the exact same address. When each destructor runs, `delete` is called twice on the same memory (double-free)."
  },
  {
    id: "cpp-10",
    language: "C++",
    difficulty: "Beginner",
    topic: "Pure Virtual Functions & Abstract Classes",
    companies: ["Capgemini", "Tech Mahindra", "Cognizant", "Wipro"],
    question: "What syntax defines a pure virtual function, and what effect does it have on the containing class?",
    code: null,
    options: [
      "`virtual void draw() = 0;` — it makes the class abstract, prohibiting direct object instantiation",
      "`pure void draw();` — it makes all subclasses immutable",
      "`virtual void draw() = null;` — it deletes the function from the vtable",
      "`abstract void draw();` — it forces the function to execute asynchronously"
    ],
    correctIndex: 0,
    explanation:
      "Appending `= 0` to a virtual function declaration specifies a pure virtual function. Any class containing at least one pure virtual function becomes an abstract class and cannot be directly instantiated."
  },

  // ==========================================
  // C MCQS
  // ==========================================
  {
    id: "c-1",
    language: "C",
    difficulty: "Intermediate",
    topic: "Pointer Arithmetic & Array Decay",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant"],
    question: "What is the output of this C program on a 64-bit architecture?",
    code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40};
    int *ptr = arr;
    printf("%d, %d", *(ptr + 1), *ptr + 1);
    return 0;
}`,
    options: [
      "20, 11",
      "20, 20",
      "11, 11",
      "10, 11"
    ],
    correctIndex: 0,
    explanation:
      "*(ptr + 1) advances the pointer by 1 element (sizeof(int)) and dereferences it, giving arr[1] = 20. *ptr + 1 dereferences first (*ptr = 10) and then adds 1, giving 11. Result is 20, 11."
  },
  {
    id: "c-2",
    language: "C",
    difficulty: "Intermediate",
    topic: "Static Storage Duration",
    companies: ["TCS", "Infosys", "Wipro", "Accenture"],
    question: "What will this C function print after being called three times?",
    code: `#include <stdio.h>

void counter() {
    static int count = 5;
    printf("%d ", count++);
}

int main() {
    counter(); counter(); counter();
    return 0;
}`,
    options: [
      "5 6 7",
      "5 5 5",
      "6 7 8",
      "Compilation error: static variables cannot be modified"
    ],
    correctIndex: 0,
    explanation:
      "Variables declared with 'static' inside a function have static storage duration—they are initialized only once before program execution and retain their value across multiple function calls. Post-increment prints 5, then 6, then 7."
  },
  {
    id: "c-3",
    language: "C",
    difficulty: "Intermediate",
    topic: "Memory Allocation Trap",
    companies: ["Zoho", "TCS", "Cognizant"],
    question: "What is a major defect with the following C code?",
    code: `char* getMessage() {
    char str[] = "Hello World";
    return str;
}`,
    options: [
      "It returns a pointer to a stack-allocated local array that is destroyed after the function returns (dangling pointer)",
      "String literals cannot be assigned to char arrays in C",
      "The string is missing a null-terminator",
      "Memory leak because free(str) was not called"
    ],
    correctIndex: 0,
    explanation:
      "char str[] allocates the array on the function call stack frame. When getMessage returns, its stack frame is popped and invalidated. Returning a pointer to that deallocated local stack memory creates a dangerous dangling pointer."
  },
  {
    id: "c-4",
    language: "C",
    difficulty: "Beginner",
    topic: "Array Parameter Decay to Pointer",
    companies: ["TCS", "Wipro", "Capgemini"],
    question: "What will `sizeof(arr)` print inside `printSize` on a 64-bit system?",
    code: `#include <stdio.h>

void printSize(int arr[10]) {
    printf("%zu", sizeof(arr));
}

int main() {
    int data[10];
    printSize(data);
    return 0;
}`,
    options: [
      "8 (size of pointer `int*` on 64-bit systems)",
      "40 (10 elements * 4 bytes)",
      "10",
      "Compilation error: sizeof is invalid on function parameters"
    ],
    correctIndex: 0,
    explanation:
      "In C, arrays passed as function parameters automatically decay to pointers (`int arr[10]` is syntactic sugar for `int *arr`). Therefore, `sizeof(arr)` inside the function measures pointer size (8 bytes on 64-bit), not the original array size."
  },
  {
    id: "c-5",
    language: "C",
    difficulty: "Intermediate",
    topic: "Macro Side Effects",
    companies: ["Zoho", "Infosys", "Tech Mahindra"],
    question: "What does this C code print?",
    code: `#include <stdio.h>
#define SQUARE(x) ((x) * (x))

int main() {
    int a = 3;
    printf("%d", SQUARE(++a));
    return 0;
}`,
    options: [
      "Undefined Behavior / Multiple modification (e.g. 25 or 20 depending on compiler)",
      "16",
      "9",
      "Compilation error"
    ],
    correctIndex: 0,
    explanation:
      "The preprocessor replaces SQUARE(++a) with ((++a) * (++a)). Because 'a' is modified more than once within the same expression without an intervening sequence point, this invokes Undefined Behavior according to the C standard."
  },
  {
    id: "c-6",
    language: "C",
    difficulty: "Intermediate",
    topic: "sizeof Side Effects & Non-evaluation",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant"],
    question: "What is the output of the following C program?",
    code: `#include <stdio.h>

int main() {
    int a = 10;
    int b = sizeof(++a);
    printf("%d, %d", a, b);
    return 0;
}`,
    options: [
      "10, 4 (on 32-bit int systems)",
      "11, 4",
      "11, 2",
      "Compilation error: increment inside sizeof"
    ],
    correctIndex: 0,
    explanation:
      "In C, sizeof is an unevaluated compile-time operator. Its operand (++a) is inspected only for its type (int), and no machine instructions are generated to execute ++a at runtime. Therefore, 'a' remains 10, and sizeof(int) evaluates to 4."
  },
  {
    id: "c-7",
    language: "C",
    difficulty: "Intermediate",
    topic: "Bitwise Shift Precedence Trap",
    companies: ["TCS", "Cognizant", "Capgemini", "Accenture"],
    question: "What will be printed by the following code snippet?",
    code: `#include <stdio.h>

int main() {
    int x = 4;
    int y = x << 1 + 2;
    printf("%d", y);
    return 0;
}`,
    options: [
      "32",
      "10",
      "16",
      "8"
    ],
    correctIndex: 0,
    explanation:
      "In the C operator precedence table, the arithmetic addition operator (+) has a higher precedence than the bitwise left-shift operator (<<). The expression evaluates as x << (1 + 2) => 4 << 3 => 4 * 2^3 = 32."
  },
  {
    id: "c-8",
    language: "C",
    difficulty: "Intermediate",
    topic: "Comma Operator & Precedence",
    companies: ["Infosys", "Zoho", "TCS", "Tech Mahindra"],
    question: "What is printed by this C program?",
    code: `#include <stdio.h>

int main() {
    int a;
    a = (10, 20, 30);
    printf("%d", a);
    return 0;
}`,
    options: [
      "30",
      "10",
      "20",
      "Compile-time error on line with 'a'"
    ],
    correctIndex: 0,
    explanation:
      "The comma operator has the lowest precedence in C and evaluates its operands from left to right, discarding previous values and returning the value of the rightmost expression. Therefore, (10, 20, 30) evaluates to 30, which is assigned to a."
  },
  {
    id: "c-9",
    language: "C",
    difficulty: "Beginner",
    topic: "strlen vs sizeof on Embedded Null",
    companies: ["Accenture", "Wipro", "Cognizant", "TCS"],
    question: "What does the following snippet print?",
    code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Campus\\0Drive";
    printf("%zu, %zu", strlen(str), sizeof(str));
    return 0;
}`,
    options: [
      "6, 12",
      "11, 12",
      "6, 11",
      "12, 12"
    ],
    correctIndex: 0,
    explanation:
      "strlen() computes the number of characters up to (but not including) the first null terminator '\\0', returning 6 ('Campus'). sizeof() returns the total allocated memory of the character array, which is 12 bytes ('Campus' + '\\0' + 'Drive' + final implicit '\\0')."
  },
  {
    id: "c-10",
    language: "C",
    difficulty: "Intermediate",
    topic: "2D Array Pointer Dereferencing",
    companies: ["Zoho", "TCS", "Infosys", "Tech Mahindra"],
    question: "What is the output of the following 2D array pointer dereference?",
    code: `#include <stdio.h>

int main() {
    int arr[2][3] = {{10, 20, 30}, {40, 50, 60}};
    printf("%d", *(*(arr + 1) + 2));
    return 0;
}`,
    options: [
      "60",
      "50",
      "30",
      "40"
    ],
    correctIndex: 0,
    explanation:
      "arr is a pointer to the first 3-element row. (arr + 1) points to the second row {40, 50, 60}. *(arr + 1) decays into a pointer to the first element (40) of the second row. Adding 2 advances the pointer to 60. Dereferencing *(*(arr + 1) + 2) produces 60 (arr[1][2])."
  },

  // ==========================================
  // SQL MCQS
  // ==========================================
  {
    id: "sql-1",
    language: "SQL",
    difficulty: "Intermediate",
    topic: "NULL Comparison & Three-Valued Logic",
    companies: ["TCS", "Infosys", "Wipro", "Cognizant"],
    question: "What will the query `SELECT * FROM employees WHERE bonus = NULL;` return?",
    code: null,
    options: [
      "Empty set (0 rows), because NULL comparison requires `IS NULL`",
      "All rows where bonus is actually NULL",
      "Syntax error",
      "All rows where bonus is 0"
    ],
    correctIndex: 0,
    explanation:
      "In SQL three-valued logic, comparing anything with NULL using '=' evaluates to UNKNOWN, not TRUE. Rows are only returned when the WHERE predicate evaluates to TRUE. To find null values, you must write `WHERE bonus IS NULL`."
  },
  {
    id: "sql-2",
    language: "SQL",
    difficulty: "Advanced",
    topic: "Transaction Isolation Levels",
    companies: ["Amazon", "Oracle", "Microsoft"],
    question: "Which ACID isolation level completely prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
    code: null,
    options: [
      "SERIALIZABLE",
      "REPEATABLE READ",
      "READ COMMITTED",
      "READ UNCOMMITTED"
    ],
    correctIndex: 0,
    explanation:
      "SERIALIZABLE is the highest ANSI SQL transaction isolation level. It executes transactions sequentially or using range locks / two-phase locking, completely preventing Dirty Reads, Non-Repeatable Reads, and Phantom Reads."
  },
  {
    id: "sql-3",
    language: "SQL",
    difficulty: "Intermediate",
    topic: "HAVING vs WHERE",
    companies: ["TCS", "Infosys", "Accenture", "Cognizant"],
    question: "What is the primary difference between the `WHERE` clause and the `HAVING` clause in SQL?",
    code: null,
    options: [
      "WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY",
      "WHERE works only on numbers; HAVING works on strings",
      "WHERE is optional, but HAVING is mandatory with SELECT",
      "HAVING can only be used with subqueries"
    ],
    correctIndex: 0,
    explanation:
      "The WHERE clause filters rows prior to the GROUP BY aggregation. The HAVING clause filters grouped summary rows and can evaluate aggregate functions like `HAVING COUNT(*) > 5` or `HAVING AVG(salary) > 50000`."
  },
  {
    id: "sql-4",
    language: "SQL",
    difficulty: "Beginner",
    topic: "UNION vs UNION ALL",
    companies: ["TCS", "Infosys", "Wipro"],
    question: "Why is `UNION ALL` significantly faster than `UNION` in large query results?",
    code: null,
    options: [
      "`UNION ALL` simply concatenates result sets without running a deduplication sorting pass, whereas `UNION` performs a costly DISTINCT operation",
      "`UNION ALL` compiles down to C++ bytecode in the database engine",
      "`UNION ALL` operates only in memory, bypassing disk",
      "`UNION ALL` ignores all WHERE filters in both queries"
    ],
    correctIndex: 0,
    explanation:
      "UNION performs an implicit DISTINCT operation across all rows, requiring a sorting or hash-aggregation pass to identify and eliminate duplicates. UNION ALL simply appends results together without deduplication, saving major CPU and memory."
  },
  {
    id: "sql-5",
    language: "SQL",
    difficulty: "Advanced",
    topic: "SARGability & Index Seeking",
    companies: ["Amazon", "Flipkart", "Oracle"],
    question: "Why does the query `SELECT * FROM users WHERE YEAR(created_at) = 2024;` perform poorly on an indexed `created_at` column?",
    code: null,
    options: [
      "Wrapping the column in a function (`YEAR()`) makes the predicate non-SARGable, forcing a Full Table/Index Scan instead of an Index Seek",
      "B-Tree indexes do not support integer comparisons",
      "The query engine does not permit date functions in WHERE clauses",
      "YEAR() is only supported in SQLite, causing a fallback driver lock"
    ],
    correctIndex: 0,
    explanation:
      "SARGable stands for 'Search Argument Able'. When a column is wrapped inside a function like `YEAR(created_at)`, the database cannot look up ranges directly in the B-Tree index and must evaluate the function on every single row, causing a full table or index scan. Rewrite as `created_at >= '2024-01-01' AND created_at < '2025-01-01'`."
  },
  {
    id: "sql-6",
    language: "SQL",
    difficulty: "Beginner",
    topic: "TRUNCATE vs DELETE vs DROP",
    companies: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture"],
    question: "What is the key functional difference between `TRUNCATE TABLE` and `DELETE FROM` in SQL?",
    code: null,
    options: [
      "`DELETE` is a DML command that deletes row-by-row and fires triggers; `TRUNCATE` is a DDL command that deallocates data pages, does not fire row triggers, and is much faster",
      "`TRUNCATE` deletes table structure permanently, while `DELETE` keeps structure",
      "`DELETE` cannot use a WHERE clause",
      "`TRUNCATE` cannot be used on tables with more than 1000 rows"
    ],
    correctIndex: 0,
    explanation:
      "`DELETE` is DML (Data Manipulation Language): it logs each deleted row individually, fires row-level triggers, and supports WHERE filters. `TRUNCATE` is DDL (Data Definition Language): it drops and recreates data pages in one shot, bypassing row triggers and resetting identity columns."
  },
  {
    id: "sql-7",
    language: "SQL",
    difficulty: "Intermediate",
    topic: "Database Normalization (2NF & 3NF)",
    companies: ["Accenture", "Capgemini", "TCS", "Infosys"],
    question: "A relational table is in Second Normal Form (2NF) if and only if it is in 1NF and satisfies which condition?",
    code: null,
    options: [
      "No non-prime attribute is partially dependent on any candidate key (no partial dependency)",
      "No transitive dependency exists between non-prime attributes",
      "All columns contain atomic, non-divisible values",
      "Every determinant is a candidate key (BCNF)"
    ],
    correctIndex: 0,
    explanation:
      "2NF requires 1NF plus eliminating partial dependencies: every non-prime attribute must be fully functionally dependent on the entire primary key (relevant when keys are composite). 3NF goes further to eliminate transitive dependencies."
  },
  {
    id: "sql-8",
    language: "SQL",
    difficulty: "Beginner",
    topic: "Primary Key vs Unique Key",
    companies: ["Infosys", "Wipro", "Zoho", "TCS"],
    question: "What is a primary distinction between a PRIMARY KEY and a UNIQUE KEY constraint?",
    code: null,
    options: [
      "A table can have only one PRIMARY KEY which disallows NULLs, whereas multiple UNIQUE constraints are allowed and can accept NULL values",
      "UNIQUE KEY creates a clustered index by default, while PRIMARY KEY does not",
      "PRIMARY KEY only works on numeric columns",
      "UNIQUE KEY cannot be referenced by a FOREIGN KEY"
    ],
    correctIndex: 0,
    explanation:
      "A table can only have one PRIMARY KEY, which strictly forbids NULL values. A table can have multiple UNIQUE constraints, which guarantee uniqueness across non-null entries and typically accept a NULL value."
  },
  {
    id: "sql-9",
    language: "SQL",
    difficulty: "Intermediate",
    topic: "Candidate Key vs Super Key",
    companies: ["Amazon", "Cognizant", "TCS", "Capgemini"],
    question: "How is a Candidate Key defined in relational database theory?",
    code: null,
    options: [
      "A minimal Super Key that contains no unnecessary or redundant attributes",
      "Any set of columns that allows duplicate values",
      "The foreign key of a parent table",
      "An index automatically created on a view"
    ],
    correctIndex: 0,
    explanation:
      "A Super Key is any attribute set that uniquely identifies a row. A Candidate Key is a minimal super key—no proper subset can uniquely identify the tuple. One candidate key is chosen as the Primary Key."
  },
  {
    id: "sql-10",
    language: "SQL",
    difficulty: "Beginner",
    topic: "SQL Injection Prevention",
    companies: ["Capgemini", "Tech Mahindra", "Accenture", "Amazon"],
    question: "Which mechanism provides the most robust defense against SQL Injection vulnerabilities in production code?",
    code: null,
    options: [
      "Using PreparedStatements with parameterized queries",
      "Escaping single quotes using regex replacement in the frontend",
      "Converting all inputs to uppercase",
      "Encrypting database column names"
    ],
    correctIndex: 0,
    explanation:
      "PreparedStatements (parameterized queries) compile the SQL template first and treat user inputs strictly as literal parameters, never as executable SQL commands, preventing SQL injection completely."
  },

  // ==========================================
  // PLACEMENT DRIVE CLASSICS: DSA & ALGORITHMS
  // ==========================================
  {
    id: "dsa-1",
    language: "DSA & Algorithms",
    difficulty: "Intermediate",
    topic: "QuickSort Worst-Case Time Complexity",
    companies: ["TCS", "Infosys", "Wipro", "Amazon", "Cognizant"],
    question: "Under what condition does QuickSort degrade to its worst-case time complexity of O(N^2)?",
    code: null,
    options: [
      "When the chosen pivot is always the smallest or largest element (e.g. naive pivot on already sorted array)",
      "When the array size is a power of 2",
      "When all elements in the array are distinct and in random order",
      "When QuickSort runs on 64-bit hardware"
    ],
    correctIndex: 0,
    explanation:
      "When the pivot divides the problem into subproblems of size 0 and N - 1 (as happens with naive first/last element pivot on sorted data), recursion depth becomes N, resulting in O(N^2) comparisons. Randomized pivot or median-of-three mitigates this."
  },
  {
    id: "dsa-2",
    language: "DSA & Algorithms",
    difficulty: "Beginner",
    topic: "Stable Sorting Algorithms",
    companies: ["Cognizant", "Accenture", "Infosys", "TCS"],
    question: "What does it mean for a sorting algorithm to be 'Stable', and which algorithm is stable?",
    code: null,
    options: [
      "It preserves the original relative order of elements with equal keys; MergeSort is stable",
      "It uses O(1) auxiliary space; HeapSort is stable",
      "It completes in O(N log N) worst-case; QuickSort is stable",
      "It can only sort integer arrays"
    ],
    correctIndex: 0,
    explanation:
      "Stability means equal keys maintain their initial relative sequence after sorting. MergeSort and InsertionSort are stable. QuickSort and HeapSort are unstable because elements can jump across equal items during partitioning/heapify."
  },
  {
    id: "dsa-3",
    language: "DSA & Algorithms",
    difficulty: "Beginner",
    topic: "BST Inorder Traversal Property",
    companies: ["TCS", "Capgemini", "Zoho", "Infosys"],
    question: "What sequence is produced by performing an Inorder traversal (Left, Root, Right) on a Binary Search Tree (BST)?",
    code: null,
    options: [
      "Elements in strictly non-decreasing (sorted ascending) order",
      "Elements in reverse descending order",
      "Level-by-level breadth-first sequence",
      "Preorder prefix notation"
    ],
    correctIndex: 0,
    explanation:
      "In a valid BST, all elements in the left subtree are smaller than the root, and all elements in the right subtree are greater. Traversal in the order (Left -> Root -> Right) visits nodes in strictly sorted ascending order."
  },
  {
    id: "dsa-4",
    language: "DSA & Algorithms",
    difficulty: "Intermediate",
    topic: "Circular Queue Full Condition",
    companies: ["Amazon", "Microsoft", "Infosys", "Wipro"],
    question: "In an array-based Circular Queue of size `N`, what condition indicates that the queue is completely full?",
    code: null,
    options: [
      "`(rear + 1) % N == front`",
      "`rear == front`",
      "`rear == N - 1`",
      "`front == (rear + 1)`"
    ],
    correctIndex: 0,
    explanation:
      "In a circular queue utilizing modulo arithmetic, advancing rear by 1 wraps around using `(rear + 1) % N`. When that position coincides with `front`, the queue is full. (`rear == front` denotes an empty queue)."
  },
  {
    id: "dsa-5",
    language: "DSA & Algorithms",
    difficulty: "Beginner",
    topic: "Postfix Expression Evaluation using Stack",
    companies: ["Wipro", "TCS", "Tech Mahindra", "Cognizant"],
    question: "What is the evaluated result of the postfix expression `5 3 + 2 * 4 /`?",
    code: null,
    options: [
      "4",
      "8",
      "16",
      "2"
    ],
    correctIndex: 0,
    explanation:
      "Using a stack: Push 5, Push 3. On '+': pop 3 and 5, compute 5 + 3 = 8, push 8. Push 2. On '*': pop 2 and 8, compute 8 * 2 = 16, push 16. Push 4. On '/': pop 4 and 16, compute 16 / 4 = 4. Final result is 4."
  },

  // ==========================================
  // PLACEMENT DRIVE CLASSICS: CORE CS (OS & NETWORKS)
  // ==========================================
  {
    id: "cs-1",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "Coffman Conditions for Deadlock",
    companies: ["TCS", "Infosys", "Cognizant", "Capgemini"],
    question: "Which of the following is NOT one of the four necessary Coffman conditions required for a Deadlock to occur in an Operating System?",
    code: null,
    options: [
      "Preemption allowed (processes can forcefully seize resources)",
      "Mutual Exclusion",
      "Hold and Wait",
      "Circular Wait"
    ],
    correctIndex: 0,
    explanation:
      "The four necessary Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. NO Preemption (resources cannot be forcibly taken away), and 4. Circular Wait. If preemption is allowed, deadlock is broken."
  },
  {
    id: "cs-2",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "Process vs Thread Memory Sharing",
    companies: ["Infosys", "Accenture", "Wipro", "Amazon"],
    question: "What memory resources are shared between multiple threads belonging to the same parent process?",
    code: null,
    options: [
      "Heap memory, global variables, and code/text segment are shared; each thread retains its own Stack and Registers",
      "Each thread gets its own private Heap and Code segment",
      "Threads share the same Stack pointer and Program Counter",
      "Nothing is shared; threads have isolated virtual address spaces"
    ],
    correctIndex: 0,
    explanation:
      "Threads of the same process share the process virtual address space: Heap, Global data, and Code segment. However, to execute independently, each thread has its own private Stack, Program Counter (PC), and CPU Register set."
  },
  {
    id: "cs-3",
    language: "Operating Systems (OS)",
    difficulty: "Beginner",
    topic: "Semaphore vs Mutex",
    companies: ["TCS", "Cognizant", "Tech Mahindra", "Infosys"],
    question: "What is the primary architectural difference between a Mutex and a Semaphore?",
    code: null,
    options: [
      "A Mutex is a locking mechanism with ownership (only the lock owner can unlock); a Semaphore is a signaling mechanism without ownership (any thread can signal)",
      "Mutex supports multiple concurrent threads, while Semaphore allows only 1",
      "Semaphore is strictly in hardware, while Mutex is purely software",
      "Mutex uses busy-waiting, while Semaphore never context switches"
    ],
    correctIndex: 0,
    explanation:
      "A Mutex (Mutual Exclusion) provides locking with ownership: only the thread that acquired the mutex can release it. A Semaphore is a signaling mechanism (using wait/signal or P/V operations) that manages access to a finite pool of resources; any thread can signal it."
  },
  {
    id: "cs-4",
    language: "Computer Networks (CN)",
    difficulty: "Beginner",
    topic: "OSI Network Layer Responsibility",
    companies: ["Accenture", "Infosys", "Wipro", "TCS"],
    question: "At which layer of the OSI 7-layer model do Routers operate and IP packet routing occur?",
    code: null,
    options: [
      "Layer 3: Network Layer",
      "Layer 2: Data Link Layer",
      "Layer 4: Transport Layer",
      "Layer 7: Application Layer"
    ],
    correctIndex: 0,
    explanation:
      "Routers operate at the Network Layer (Layer 3), responsible for logical IP addressing, routing path selection, and packet forwarding across networks. Switches operate primarily at the Data Link Layer (Layer 2)."
  },
  {
    id: "cs-5",
    language: "Computer Networks (CN)",
    difficulty: "Beginner",
    topic: "TCP Three-Way Handshake",
    companies: ["Capgemini", "Amazon", "TCS", "Infosys"],
    question: "What is the exact sequence of flag packets exchanged during a standard TCP Three-Way Handshake to establish a connection?",
    code: null,
    options: [
      "SYN -> SYN-ACK -> ACK",
      "ACK -> SYN -> SYN-ACK",
      "SYN -> ACK -> DATA",
      "HELLO -> ACCEPT -> CONNECT"
    ],
    correctIndex: 0,
    explanation:
      "To establish a reliable TCP session: 1. Client sends SYN (synchronize sequence number). 2. Server responds with SYN-ACK (acknowledging client and synchronizing server's sequence number). 3. Client replies with ACK. The connection is then ESTABLISHED."
  },

  // ==========================================
  // CORE SUBJECTS: OPERATING SYSTEMS (OS)
  // ==========================================
  {
    id: "os-1",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "Virtual Memory Thrashing",
    companies: ["TCS", "Infosys", "Amazon", "Microsoft"],
    question: "What is 'Thrashing' in an operating system with virtual memory?",
    code: null,
    options: [
      "A severe state where the system spends significantly more time swapping pages between RAM and disk than executing actual CPU instructions",
      "Total CPU failure due to high clock speeds and heating",
      "Overwriting kernel memory buffers by an unauthorized thread",
      "Instant termination of background daemon processes"
    ],
    correctIndex: 0,
    explanation:
      "Thrashing occurs when the total working sets of active processes exceed the physical memory available. Because required pages are constantly being paged out, frequent page faults force the OS into continuous disk I/O swapping, dropping CPU utilization to near zero."
  },
  {
    id: "os-2",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "Belady's Anomaly in FIFO Page Replacement",
    companies: ["Infosys", "Wipro", "Cognizant", "TCS"],
    question: "Which page replacement algorithm can suffer from Belady's Anomaly (where allocating MORE physical page frames causes MORE page faults)?",
    code: null,
    options: [
      "FIFO (First-In, First-Out)",
      "LRU (Least Recently Used)",
      "Optimal Page Replacement",
      "LFU (Least Frequently Used)"
    ],
    correctIndex: 0,
    explanation:
      "Belady's Anomaly occurs in non-stack page replacement algorithms like FIFO. In stack algorithms (such as LRU and Optimal), the set of pages in an n-frame system is always a strict subset of pages in an (n+1)-frame system, mathematically guaranteeing that page faults cannot increase."
  },
  {
    id: "os-3",
    language: "Operating Systems (OS)",
    difficulty: "Beginner",
    topic: "CPU Scheduling & Convoy Effect",
    companies: ["Cognizant", "TCS", "Capgemini", "Accenture"],
    question: "What causes the 'Convoy Effect' in operating systems, and which scheduling algorithm is susceptible to it?",
    code: null,
    options: [
      "FCFS (First-Come, First-Served) when a CPU-bound process with a huge burst time holds the CPU while multiple short I/O-bound processes wait behind it",
      "Round Robin when the time slice is configured too short",
      "Priority Scheduling when high-priority processes starve lower-priority tasks",
      "Multilevel Feedback Queue when processes move between queues"
    ],
    correctIndex: 0,
    explanation:
      "The Convoy Effect arises in non-preemptive FCFS scheduling when a long CPU-bound process monopolizes the processor. Multiple short, I/O-bound processes are forced to wait in the ready queue, leading to poor device utilization and bloated average turnaround times."
  },
  {
    id: "os-4",
    language: "Operating Systems (OS)",
    difficulty: "Advanced",
    topic: "Critical Section Criteria (Peterson's Algorithm)",
    companies: ["Amazon", "Microsoft", "Infosys", "Zoho"],
    question: "To provide a valid solution to the Critical Section problem, which three criteria must strictly be satisfied?",
    code: null,
    options: [
      "Mutual Exclusion, Progress, and Bounded Waiting",
      "Concurrency, Atomicity, and Consistency",
      "Deadlock, Starvation, and Aging",
      "Preemption, Relocation, and Paging"
    ],
    correctIndex: 0,
    explanation:
      "A complete solution to the critical-section problem requires: 1. Mutual Exclusion (only one process in critical section at a time), 2. Progress (processes outside critical section do not block others from entering), and 3. Bounded Waiting (a limit exists on the number of times others can enter before a request is granted, avoiding starvation)."
  },
  {
    id: "os-5",
    language: "Operating Systems (OS)",
    difficulty: "Beginner",
    topic: "Dynamic Memory Allocation Strategies",
    companies: ["TCS", "Wipro", "Accenture", "Tech Mahindra"],
    question: "In contiguous memory allocation, which strategy searches the entire free list to allocate the largest available free block to a process?",
    code: null,
    options: [
      "Worst Fit (leaves the largest remaining leftover chunk)",
      "Best Fit",
      "First Fit",
      "Next Fit"
    ],
    correctIndex: 0,
    explanation:
      "Worst Fit allocates the largest hole available. Although it requires scanning the entire list (unless sorted by size), it produces the largest leftover hole, which is often large enough to be useful for subsequent allocations, unlike Best Fit which produces tiny unusable fragments."
  },
  {
    id: "os-6",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "Banker's Algorithm & Safe State",
    companies: ["Capgemini", "Infosys", "TCS", "Cognizant"],
    question: "What is the primary role of Dijkstra's Banker's Algorithm in Operating Systems?",
    code: null,
    options: [
      "Deadlock Avoidance: granting requests only if allocating resources leaves the system in a Safe State where all processes can complete",
      "Deadlock Detection: terminating the process with the highest memory consumption",
      "CPU Scheduling: assigning threads to different processor sockets",
      "Virtual Paging: writing dirty pages to swap space"
    ],
    correctIndex: 0,
    explanation:
      "The Banker's Algorithm is a classic Deadlock Avoidance algorithm. It evaluates the current Available, Allocation, and Max Need matrices before granting an allocation. If granting the request leads to an Unsafe State (a state that might degrade into deadlock), the requesting process must wait."
  },
  {
    id: "os-7",
    language: "Operating Systems (OS)",
    difficulty: "Intermediate",
    topic: "TLB (Translation Lookaside Buffer)",
    companies: ["Amazon", "Microsoft", "Cognizant", "Google"],
    question: "Why is a Translation Lookaside Buffer (TLB) critical in modern paged virtual memory architectures?",
    code: null,
    options: [
      "It is a high-speed associative hardware cache holding recent page-to-frame translations, avoiding two physical RAM accesses per memory reference",
      "It compresses virtual memory data before sending it to the hard disk",
      "It checks for syntax errors in executable ELF files",
      "It generates random salt for password encryption"
    ],
    correctIndex: 0,
    explanation:
      "Standard virtual paging requires two memory accesses for every single data read: one to consult the Page Table in RAM, and one to read the actual memory frame. The hardware TLB caches recent translations, achieving hit rates >95% and near single-access speed."
  },

  // ==========================================
  // CORE SUBJECTS: COMPUTER NETWORKS (CN)
  // ==========================================
  {
    id: "cn-1",
    language: "Computer Networks (CN)",
    difficulty: "Intermediate",
    topic: "IPv4 Subnetting & Host Calculation",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
    question: "In an IPv4 network with the CIDR prefix `192.168.1.0/26`, how many usable host IP addresses are available on this subnet?",
    code: null,
    options: [
      "62 usable host addresses",
      "64 usable host addresses",
      "126 usable host addresses",
      "30 usable host addresses"
    ],
    correctIndex: 0,
    explanation:
      "A /26 subnet leaves 32 - 26 = 6 host bits. Total IP addresses = 2^6 = 64. You must subtract 2 addresses: the Network ID (first address) and the Directed Broadcast Address (last address). Thus, 64 - 2 = 62 usable host IPs."
  },
  {
    id: "cn-2",
    language: "Computer Networks (CN)",
    difficulty: "Intermediate",
    topic: "Sliding Window: Go-Back-N vs Selective Repeat",
    companies: ["Amazon", "Cognizant", "TCS", "Microsoft"],
    question: "What is the principal efficiency benefit of Selective Repeat ARQ compared to Go-Back-N ARQ during packet loss?",
    code: null,
    options: [
      "Selective Repeat retransmits only the specific corrupted/lost frames using individual acknowledgments, avoiding re-sending correctly received frames",
      "Selective Repeat does not require receiver buffer memory",
      "Selective Repeat operates without sequence numbers",
      "Selective Repeat eliminates the need for round-trip timers"
    ],
    correctIndex: 0,
    explanation:
      "In Go-Back-N, if frame k is lost, all subsequent frames k+1, k+2... in the window are discarded by the receiver and retransmitted by the sender. Selective Repeat buffers out-of-order frames at the receiver and requests retransmission of ONLY the missing packet."
  },
  {
    id: "cn-3",
    language: "Computer Networks (CN)",
    difficulty: "Beginner",
    topic: "TCP Header vs UDP Header Size",
    companies: ["Infosys", "Accenture", "Capgemini", "TCS"],
    question: "What are the default minimum header sizes of standard TCP and UDP packets respectively?",
    code: null,
    options: [
      "TCP: 20 bytes, UDP: 8 bytes",
      "TCP: 32 bytes, UDP: 16 bytes",
      "TCP: 8 bytes, UDP: 20 bytes",
      "TCP: 40 bytes, UDP: 24 bytes"
    ],
    correctIndex: 0,
    explanation:
      "A standard TCP header without optional parameters is 20 bytes (consisting of ports, sequence/ack numbers, data offset, flags, window size, checksum, and urgent pointer). A lightweight UDP header has only 4 fixed fields totaling 8 bytes."
  },
  {
    id: "cn-4",
    language: "Computer Networks (CN)",
    difficulty: "Beginner",
    topic: "ARP (Address Resolution Protocol)",
    companies: ["TCS", "Wipro", "Tech Mahindra", "Infosys"],
    question: "What is the primary role of the Address Resolution Protocol (ARP) in a local area network?",
    code: null,
    options: [
      "Mapping a known logical IPv4 address to its physical hardware MAC address on a local Ethernet subnet",
      "Translating human-readable domain names (google.com) to IP addresses",
      "Encrypting packet payloads before wireless transmission",
      "Dynamically allocating IP addresses to newly connected laptops (DHCP)"
    ],
    correctIndex: 0,
    explanation:
      "When a host needs to communicate with another device on the same local subnet, it knows the target IP but needs the layer-2 destination hardware MAC address. It broadcasts an ARP Request, and the machine with that IP replies with its MAC address."
  },
  {
    id: "cn-5",
    language: "Computer Networks (CN)",
    difficulty: "Intermediate",
    topic: "HTTPS Hybrid Cryptography",
    companies: ["Amazon", "Microsoft", "Zoho", "Flipkart"],
    question: "How does HTTPS achieve both strong authentication and high-throughput data transfer during a secure web session?",
    code: null,
    options: [
      "It uses Asymmetric encryption during the TLS handshake to authenticate and negotiate a session key, then switches to fast Symmetric encryption for payload data",
      "It encrypts all web pages exclusively with asymmetric RSA keys",
      "It only checks digital certificates without encrypting the HTTP stream",
      "It hashes all packets using MD5 without symmetric ciphers"
    ],
    correctIndex: 0,
    explanation:
      "Asymmetric encryption (e.g. RSA or ECDHE) is computationally heavy but allows secure key exchange without a pre-shared secret. Symmetric encryption (e.g. AES-GCM) is extremely fast in CPU hardware. HTTPS leverages asymmetric crypto solely to exchange a symmetric session key, then uses symmetric crypto for the entire session."
  },
  {
    id: "cn-6",
    language: "Computer Networks (CN)",
    difficulty: "Beginner",
    topic: "Standard Network Port Numbers",
    companies: ["TCS", "Cognizant", "Infosys", "Wipro"],
    question: "Which default well-known port numbers correspond to DNS, HTTP, SSH, and HTTPS protocols respectively?",
    code: null,
    options: [
      "DNS: 53, HTTP: 80, SSH: 22, HTTPS: 443",
      "DNS: 80, HTTP: 53, SSH: 443, HTTPS: 22",
      "DNS: 25, HTTP: 8080, SSH: 21, HTTPS: 8443",
      "DNS: 110, HTTP: 80, SSH: 23, HTTPS: 443"
    ],
    correctIndex: 0,
    explanation:
      "According to IANA standards: DNS queries listen on Port 53 (UDP/TCP), unencrypted HTTP listens on Port 80, secure shell (SSH) listens on Port 22, and encrypted web traffic (HTTPS) listens on Port 443."
  },
  {
    id: "cn-7",
    language: "Computer Networks (CN)",
    difficulty: "Intermediate",
    topic: "CSMA/CD vs CSMA/CA",
    companies: ["Capgemini", "Accenture", "Wipro", "TCS"],
    question: "Why does standard 802.11 Wi-Fi rely on CSMA/CA (Collision Avoidance) rather than Ethernet's CSMA/CD (Collision Detection)?",
    code: null,
    options: [
      "Wireless transceivers cannot reliably detect collisions while transmitting because their own transmitted signal completely drowns out incoming signals",
      "Wi-Fi operates on unbounded fiber optic links",
      "Collision Detection is mathematically impossible on digital signals",
      "CSMA/CA operates without carrier sensing"
    ],
    correctIndex: 0,
    explanation:
      "In wireless RF environments, a station's transmitter power is much higher than any remote signal it might receive (near-far problem and half-duplex radio). A transmitting antenna cannot detect weaker collisions on the channel, making Collision Detection impractical. Therefore, Wi-Fi uses Collision Avoidance (RTS/CTS and random backoff)."
  },

  // ==========================================
  // CORE SUBJECTS: DBMS & DATABASE ARCHITECTURE
  // ==========================================
  {
    id: "dbms-1",
    language: "DBMS & Database Architecture",
    difficulty: "Intermediate",
    topic: "B+ Tree vs B-Tree Storage Architecture",
    companies: ["Amazon", "Google", "Oracle", "Microsoft"],
    question: "Why do relational database storage engines (such as MySQL InnoDB and PostgreSQL) utilize B+ Trees instead of standard B-Trees for primary and secondary indexing?",
    code: null,
    options: [
      "B+ Trees store actual record pointers only in leaf nodes, keeping internal nodes small (higher fanout) and linking leaf nodes sequentially for high-speed range scans",
      "B+ Trees eliminate the need for secondary storage",
      "B-Trees cannot store numeric index keys",
      "B+ Trees use binary branching with a maximum of 2 child nodes"
    ],
    correctIndex: 0,
    explanation:
      "In a B+ Tree, non-leaf nodes contain only keys and child pointers (no data pointers), maximizing fanout and minimizing tree height (fewer disk I/O reads). Furthermore, all leaf nodes are connected via a doubly-linked list, allowing sequential range queries (e.g. BETWEEN 10 AND 50) to traverse leaves without tree re-traversals."
  },
  {
    id: "dbms-2",
    language: "DBMS & Database Architecture",
    difficulty: "Intermediate",
    topic: "Clustered vs Non-Clustered Indexes",
    companies: ["TCS", "Infosys", "Cognizant", "Wipro"],
    question: "What is the defining structural difference between a Clustered Index and a Non-Clustered Index?",
    code: null,
    options: [
      "A Clustered Index reorganizes the physical storage order of the actual table rows on disk (thus only 1 per table); a Non-Clustered Index is a separate structure holding pointers to table rows",
      "A table can have unlimited clustered indexes but only one non-clustered index",
      "Non-clustered indexes are stored in CPU L1 cache",
      "Clustered indexes cannot be used for primary keys"
    ],
    correctIndex: 0,
    explanation:
      "Because table data rows on a physical disk drive can only be sorted in one order, a table can possess at most ONE Clustered Index (typically on the Primary Key). Non-clustered indexes maintain an independent B-Tree whose leaf nodes store row locators (clustered index keys or RID pointers)."
  },
  {
    id: "dbms-3",
    language: "DBMS & Database Architecture",
    difficulty: "Advanced",
    topic: "Two-Phase Locking (2PL) Protocol",
    companies: ["Amazon", "Oracle", "TCS", "Microsoft"],
    question: "What property does the strict Two-Phase Locking (2PL) protocol guarantee in database concurrency control, and what does it NOT prevent?",
    code: null,
    options: [
      "It guarantees Conflict Serializability, but does NOT prevent Deadlocks",
      "It prevents Deadlocks, but does not guarantee Serializability",
      "It guarantees zero query execution latency",
      "It completely eliminates the need for transaction rollbacks"
    ],
    correctIndex: 0,
    explanation:
      "Under 2PL, a transaction has a Growing Phase (locks are acquired, none released) and a Shrinking Phase (locks are released, none acquired). The point where the last lock is acquired is the Lock Point. This guarantees conflict serializability, but transactions can still enter circular wait conditions, meaning Deadlocks can still occur."
  },
  {
    id: "dbms-4",
    language: "DBMS & Database Architecture",
    difficulty: "Intermediate",
    topic: "ACID Durability & Write-Ahead Logging (WAL)",
    companies: ["Amazon", "Microsoft", "Infosys", "Flipkart"],
    question: "How do relational databases guarantee the 'Durability' property of ACID transactions in the event of an abrupt power outage?",
    code: null,
    options: [
      "Using Write-Ahead Logging (WAL): appending changes to an immutable on-disk log before dirty data pages are flushed from RAM to table storage",
      "By keeping all tables solely in RAM without writing to disk",
      "By executing every query twice on separate CPUs",
      "By disabling auto-commit on all SELECT queries"
    ],
    correctIndex: 0,
    explanation:
      "The Write-Ahead Logging (WAL) protocol mandates that log records describing a change must be flushed to persistent non-volatile disk BEFORE the actual database table page is modified on disk. During crash recovery, the database reads the WAL log to REDO committed transactions and UNDO uncommitted ones."
  },
  {
    id: "dbms-5",
    language: "DBMS & Database Architecture",
    difficulty: "Beginner",
    topic: "Relational Algebra Cartesian Product",
    companies: ["TCS", "Wipro", "Capgemini", "Accenture"],
    question: "If relation R has degree 5 (attributes) and cardinality 10 (tuples), and relation S has degree 3 and cardinality 20, what is the degree and cardinality of their Cartesian Product (R x S)?",
    code: null,
    options: [
      "Degree: 8 attributes, Cardinality: 200 tuples",
      "Degree: 15 attributes, Cardinality: 30 tuples",
      "Degree: 8 attributes, Cardinality: 30 tuples",
      "Degree: 15 attributes, Cardinality: 200 tuples"
    ],
    correctIndex: 0,
    explanation:
      "In relational algebra, Cartesian Product cross-combines every row of R with every row of S: Degree (number of attributes/columns) = 5 + 3 = 8. Cardinality (number of tuples/rows) = 10 * 20 = 200."
  },
  {
    id: "dbms-6",
    language: "DBMS & Database Architecture",
    difficulty: "Advanced",
    topic: "Lossless Join vs Dependency Preservation (BCNF vs 3NF)",
    companies: ["GATE", "Infosys", "TCS", "Amazon"],
    question: "When decomposing a relational schema into Boyce-Codd Normal Form (BCNF), which property is always preserved and which may be lost?",
    code: null,
    options: [
      "Lossless Join is always guaranteed, but Dependency Preservation may not be achievable in BCNF (unlike 3NF)",
      "Dependency Preservation is guaranteed, but Lossless Join is lost",
      "Both Lossless Join and Dependency Preservation are lost",
      "BCNF eliminates all foreign keys automatically"
    ],
    correctIndex: 0,
    explanation:
      "3NF can always achieve both Lossless-Join Decomposition AND Dependency Preservation. However, BCNF is stricter (every determinant must be a candidate key). While BCNF always guarantees a Lossless Join, certain functional dependencies spanning across tables cannot always be preserved without a cross-table join check."
  },

  // ==========================================
  // CORE SUBJECTS: OOPS & SOFTWARE DESIGN
  // ==========================================
  {
    id: "oops-1",
    language: "OOPs & Software Design",
    difficulty: "Intermediate",
    topic: "Composition vs Aggregation",
    companies: ["Infosys", "Cognizant", "Accenture", "Amazon"],
    question: "What is the fundamental architectural distinction between Composition and Aggregation relationships in Object-Oriented Design?",
    code: null,
    options: [
      "Composition is a strong 'has-a' relationship with shared lifecycle ownership (if parent is deleted, child is destroyed); Aggregation has independent lifecycles",
      "Aggregation destroys the child object when the parent class terminates",
      "Composition is strictly implemented via multiple inheritance",
      "Aggregation only applies to primitive types"
    ],
    correctIndex: 0,
    explanation:
      "In Composition (e.g. Car and Engine, or House and Rooms), the child component cannot logically exist without the parent; the parent owns its lifecycle. In Aggregation (e.g. Department and Professors), the parts can exist independently outside the container."
  },
  {
    id: "oops-2",
    language: "OOPs & Software Design",
    difficulty: "Intermediate",
    topic: "SOLID: Liskov Substitution Principle (LSP)",
    companies: ["Amazon", "Microsoft", "Zoho", "Google"],
    question: "What does the Liskov Substitution Principle (the 'L' in SOLID design) strictly require?",
    code: null,
    options: [
      "Objects of a subclass should be seamlessly substitutable for objects of the superclass without altering the correctness of the program",
      "Every class should have exactly one single reason to change",
      "Software entities should be open for modification and closed for extension",
      "Classes must inherit from at least two interfaces"
    ],
    correctIndex: 0,
    explanation:
      "LSP asserts that derived classes must extend base behavior without violating base contracts or throwing unexpected exceptions. A classic violation is making a `Square` inherit from `Rectangle` and overriding `setWidth()`, which unexpectedly mutates height and breaks code expecting rectangle behavior."
  },
  {
    id: "oops-3",
    language: "OOPs & Software Design",
    difficulty: "Advanced",
    topic: "Singleton Pattern & Double-Checked Locking",
    companies: ["Microsoft", "Amazon", "Zoho", "TCS"],
    question: "Why is the `volatile` keyword mandatory for the instance variable when implementing thread-safe Singleton with Double-Checked Locking in Java?",
    code: null,
    options: [
      "To prevent instruction reordering by the compiler or CPU that could allow another thread to see a non-null but partially initialized object reference",
      "To force the singleton object to be serialized to disk",
      "To make the instance variable accessible from other packages",
      "To make constructor execution run asynchronously"
    ],
    correctIndex: 0,
    explanation:
      "Without `volatile`, the JVM/CPU can reorder instructions during `instance = new Singleton()` (allocating memory, assigning reference to instance, then running constructor). A second thread checking `instance != null` could receive a reference before constructor execution completes. `volatile` establishes a happens-before memory barrier."
  },
  {
    id: "oops-4",
    language: "OOPs & Software Design",
    difficulty: "Beginner",
    topic: "Early Binding vs Late Binding",
    companies: ["TCS", "Cognizant", "Capgemini", "Wipro"],
    question: "Which category of methods in Java/C++ undergo Early (Static) Binding at compile time rather than Late (Dynamic) Binding at runtime?",
    code: null,
    options: [
      "`static`, `final`, and `private` methods (and overloaded methods resolved by parameter types)",
      "Overridden `virtual` methods called via base class reference",
      "Interface method invocations",
      "Abstract methods in concrete subclasses"
    ],
    correctIndex: 0,
    explanation:
      "Early binding binds the method call to its code definition during compilation. Because `static`, `final`, and `private` methods cannot be overridden in derived classes, the compiler resolves their exact addresses directly at compile time without vtable lookups."
  },
  {
    id: "oops-5",
    language: "OOPs & Software Design",
    difficulty: "Intermediate",
    topic: "Factory Method vs Abstract Factory",
    companies: ["Amazon", "Microsoft", "Infosys", "Adobe"],
    question: "What is the key architectural distinction between the Factory Method pattern and the Abstract Factory pattern?",
    code: null,
    options: [
      "Factory Method uses inheritance to create one specific product; Abstract Factory uses composition to create entire families of related or dependent products",
      "Factory Method creates interfaces, while Abstract Factory creates abstract classes",
      "Abstract Factory can only be used with database connections",
      "Factory Method prevents all forms of subclassing"
    ],
    correctIndex: 0,
    explanation:
      "Factory Method delegates object creation to derived subclasses via a single method (`createDialog() -> Button`). Abstract Factory provides an interface with multiple creation methods (`createButton()`, `createScrollbar()`, `createWindow()`) to construct whole suites of consistent products without specifying concrete classes."
  },
  {
    id: "oops-6",
    language: "OOPs & Software Design",
    difficulty: "Beginner",
    topic: "Shallow Copy vs Deep Copy",
    companies: ["Accenture", "Wipro", "TCS", "Zoho"],
    question: "What occurs when a Shallow Copy of an object containing nested references is performed?",
    code: null,
    options: [
      "The top-level fields are copied, but any reference fields still point to the exact same nested objects in heap memory",
      "All nested objects and graph references are recursively cloned onto new heap memory",
      "The original source object is destroyed immediately",
      "A compile-time error occurs whenever references exist"
    ],
    correctIndex: 0,
    explanation:
      "A shallow copy duplicates the bit values of the immediate fields. If a field holds a memory reference to an internal list or object, only the pointer address is copied. Mutating the nested object through the clone alters the original object as well. Deep copy recursively creates new instances."
  },

  // ==========================================
  // CORE SUBJECTS: SOFTWARE ENGINEERING & ARCHITECTURE
  // ==========================================
  {
    id: "se-1",
    language: "OOPs & Software Design",
    difficulty: "Beginner",
    topic: "REST API Idempotency (HTTP Methods)",
    companies: ["Amazon", "Flipkart", "Cognizant", "TCS"],
    question: "In RESTful web service architecture, which of the following standard HTTP methods is NOT idempotent?",
    code: null,
    options: [
      "POST",
      "GET",
      "PUT",
      "DELETE"
    ],
    correctIndex: 0,
    explanation:
      "An HTTP method is idempotent if making multiple identical requests has the same intended effect on the server as making a single request. GET, PUT, and DELETE are idempotent. POST is NOT idempotent because submitting multiple identical POST requests repeatedly creates multiple new database records."
  },
  {
    id: "se-2",
    language: "OOPs & Software Design",
    difficulty: "Intermediate",
    topic: "CAP Theorem in Distributed Systems",
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
    question: "According to Eric Brewer's CAP Theorem, what are the three guarantees, and what trade-off must a distributed system make during a network partition?",
    code: null,
    options: [
      "Consistency, Availability, Partition Tolerance — during a network partition (P), a distributed system must choose between Consistency (CP) or Availability (AP)",
      "Capacity, Authentication, Performance — all three must be guaranteed simultaneously",
      "Concurrency, Atomicity, Persistence — only one can be chosen",
      "Compression, Availability, Parallelism — all three are maintained by routers"
    ],
    correctIndex: 0,
    explanation:
      "In distributed computing, network partitions (communication breakdowns between nodes) are inevitable. When a partition occurs, a database must either reject requests to guarantee that all nodes return the same latest data (Consistency over Availability, CP) or accept writes on all nodes at the risk of returning stale data (Availability over Consistency, AP)."
  },
  {
    id: "se-3",
    language: "OOPs & Software Design",
    difficulty: "Beginner",
    topic: "Agile Scrum: Sprint Retrospective",
    companies: ["Infosys", "Accenture", "Capgemini", "TCS"],
    question: "What is the dedicated purpose of the Sprint Retrospective ceremony in the Agile Scrum framework?",
    code: null,
    options: [
      "For the Scrum team to inspect their process, evaluate what went well and what went wrong during the sprint, and commit to continuous improvements",
      "To demo finished product features to stakeholders and client executives",
      "To estimate story points for the upcoming release",
      "To assign individual annual performance ratings to developers"
    ],
    correctIndex: 0,
    explanation:
      "The Sprint Retrospective occurs after the Sprint Review and prior to the next Sprint Planning. Its sole focus is internal team process improvement: inspecting people, relationships, processes, and tools, identifying impediments, and actionable steps to improve the next sprint."
  }
];
