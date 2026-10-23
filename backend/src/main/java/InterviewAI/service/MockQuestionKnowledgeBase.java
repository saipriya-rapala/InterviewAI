package InterviewAI.service;

import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

final class MockQuestionKnowledgeBase {

    private static final Map<String, Entry> ENTRIES = createEntries();

    private MockQuestionKnowledgeBase() {
    }

    static Entry find(String questionText) {
        return ENTRIES.get(normalizeQuestion(questionText));
    }

    private static Map<String, Entry> createEntries() {
        Map<String, Entry> entries = new LinkedHashMap<>();
        add(entries, "What is Java?",
                "Java is a high-level, class-based programming language. Java source is compiled to bytecode that runs on a Java Virtual Machine (JVM), which supports portability across compatible systems. It also provides object-oriented features and automatic memory management.",
                concept("high-level programming language", 2, "high-level", "programming language"),
                concept("JVM bytecode", 3, "bytecode", "jvm", "java virtual machine"),
                concept("object-oriented", 2, "object-oriented", "object oriented", "oop"),
                concept("portable execution", 1, "portable", "platform independent", "platform-independent"));

        add(entries, "What is a class in Java?",
                "A class is a blueprint for creating objects. It declares the data an object can hold, commonly as fields, and the operations it can perform, commonly as methods. Objects are instances created from that class.",
                concept("blueprint for objects", 3, "blueprint", "template", "class definition"),
                concept("fields or state", 2, "fields", "state", "data members"),
                concept("methods or behavior", 2, "methods", "behavior", "behaviour"),
                concept("objects are instances", 1, "instances", "objects"));

        add(entries, "What is an object in Java?",
                "An object is an instance of a class. It has state, represented by its fields, and behavior, represented by its methods. In Java, an object is commonly created with the new keyword. For example:\n\n```java\nclass Car {\n    String color;\n    void drive() { System.out.println(\"Driving\"); }\n}\nCar car = new Car();\n```\n\nHere, `car` refers to a Car object with a color field and a drive method.",
                concept("instance of a class", 3, "instance of a class", "class instance"),
                concept("state through fields", 2, "state", "fields", "field values"),
                concept("behavior through methods", 2, "behavior", "behaviour", "methods"),
                concept("created using new", 2, "new", "new keyword", "using new"));

        add(entries, "Explain multithreading in Java.",
                "Multithreading allows multiple threads to make progress concurrently within one process. Threads share the process memory, so shared mutable state must be coordinated with synchronization or other concurrency tools to avoid race conditions.",
                concept("multiple threads", 2, "multiple threads", "threads"),
                concept("concurrent progress", 2, "concurrently", "concurrent", "parallel"),
                concept("shared process memory", 2, "share memory", "shared memory", "same process"),
                concept("synchronization and races", 2, "synchronization", "synchronized", "race condition", "thread safe"));

        add(entries, "What is the difference between HashMap and Hashtable?",
                "Both HashMap and Hashtable store key-value mappings. HashMap is generally unsynchronized and permits one null key and null values. Hashtable is a legacy synchronized collection and does not permit null keys or values; modern concurrent code often uses ConcurrentHashMap instead.",
                concept("key-value mappings", 1, "key value mapping", "key-value mapping", "key value pair", "key-value pair"),
                concept("HashMap synchronization", 2, "unsynchronized", "not synchronized"),
                concept("Hashtable synchronization", 2, "synchronized", "thread safe"),
                concept("null behavior", 2, "null key", "null value", "null keys", "null values"),
                concept("legacy collection", 1, "legacy", "concurrenthashmap"));

        add(entries, "Explain exception handling in Java.",
                "Java exception handling uses try and catch blocks to handle exceptional conditions. A finally block can run cleanup code. Checked exceptions must be caught or declared with throws, while unchecked exceptions extend RuntimeException. throw raises an exception explicitly.",
                concept("try and catch", 2, "try", "catch"),
                concept("cleanup with finally", 1, "finally", "cleanup"),
                concept("checked and unchecked", 2, "checked exception", "unchecked exception", "runtimeexception"),
                concept("throw and throws", 2, "throw", "throws"));

        add(entries, "What is Python?",
                "Python is a high-level, general-purpose programming language known for readable syntax. It is dynamically typed and supports several programming styles, including procedural, object-oriented, and functional programming.",
                concept("high-level general-purpose", 2, "high level", "general purpose"),
                concept("readable syntax", 2, "readable", "readability", "syntax"),
                concept("dynamic typing", 2, "dynamically typed", "dynamic typing"),
                concept("multiple paradigms", 2, "object oriented", "object-oriented", "functional", "procedural"));

        add(entries, "What is a list in Python?",
                "A Python list is an ordered, mutable sequence. Items can be accessed by zero-based index, changed after creation, and added with methods such as append. A list can contain values of different types.",
                concept("ordered sequence", 2, "ordered", "sequence"),
                concept("mutable", 2, "mutable", "changeable"),
                concept("indexing", 2, "index", "indices", "zero based", "zero-based"),
                concept("append items", 1, "append", "add items"),
                concept("mixed values", 1, "different types", "mixed types"));

        add(entries, "What is a tuple in Python?",
                "A tuple is an ordered sequence that is generally immutable after creation. It supports indexing like a list and is useful for fixed collections of values. A tuple containing only hashable elements can itself be used as a dictionary key.",
                concept("ordered sequence", 2, "ordered", "sequence"),
                concept("immutable", 3, "immutable", "cannot be changed"),
                concept("indexing", 1, "index", "indices"),
                concept("fixed collection", 1, "fixed", "constant collection"),
                concept("hashable elements", 1, "hashable", "dictionary key"));

        add(entries, "Explain decorators in Python.",
                "A decorator is a callable that takes a function or class and returns a wrapped or modified callable. The `@decorator` syntax applies it at definition time. Decorators are often used for reusable cross-cutting behavior such as logging, authorization, or caching.",
                concept("takes a callable", 2, "takes a function", "callable", "function"),
                concept("returns a wrapper", 2, "wrapper", "wrapped", "returns a function"),
                concept("at syntax", 2, "decorator syntax", "at sign syntax"),
                concept("reusable behavior", 2, "logging", "authorization", "caching", "cross cutting"));

        add(entries, "What are generators in Python?",
                "A generator produces values lazily, one at a time, commonly using yield. Calling a generator function returns an iterator; each iteration resumes execution where it last yielded. This can reduce memory use for large sequences.",
                concept("lazy values", 2, "lazily", "lazy", "one at a time"),
                concept("yield", 2, "yield"),
                concept("iterator", 2, "iterator", "iteration"),
                concept("memory efficiency", 2, "memory", "memory efficient", "less memory"));

        add(entries, "Explain Python's memory management.",
                "Python manages object memory automatically. In CPython, reference counting reclaims many objects when their count reaches zero, and a cyclic garbage collector handles reference cycles that reference counting alone cannot reclaim. The implementation details can differ between Python implementations.",
                concept("automatic management", 2, "automatic", "automatically"),
                concept("reference counting", 3, "reference counting", "reference count"),
                concept("cyclic garbage collection", 2, "cyclic garbage collector", "garbage collection", "garbage collector"),
                concept("implementation detail", 1, "cpython", "implementation"));

        add(entries, "What is SQL?",
                "SQL (Structured Query Language) is a declarative language for working with relational databases. It is used to define database structures and query or modify relational data using statements such as SELECT, INSERT, UPDATE, and DELETE.",
                concept("structured query language", 2, "structured query language"),
                concept("relational databases", 2, "relational database", "relational databases"),
                concept("declarative queries", 2, "declarative", "query"),
                concept("data operations", 2, "select", "insert", "update", "delete", "modify data"));

        add(entries, "What is a primary key?",
                "A primary key is a column or set of columns that uniquely identifies each row in a table. Its values must be unique and cannot be NULL. A table has one primary-key constraint, which may be composite.",
                concept("identifies a row", 3, "identifies each row", "unique identifier", "identifies a record"),
                concept("unique values", 2, "unique", "uniqueness"),
                concept("not null", 2, "not null", "cannot be null", "non-null"),
                concept("composite key", 1, "composite", "multiple columns"));

        add(entries, "What is a foreign key?",
                "A foreign key is a column or set of columns whose values reference a candidate key, usually a primary key, in the same or another table. It enforces referential integrity so references do not point to missing rows, subject to the configured delete and update rules.",
                concept("references another key", 3, "references", "foreign key", "referenced key"),
                concept("primary key", 2, "primary key"),
                concept("referential integrity", 3, "referential integrity", "valid reference", "orphan"));

        add(entries, "Explain joins in SQL.",
                "A JOIN combines rows from tables using a related-column condition. INNER JOIN returns matching rows, while LEFT JOIN keeps every row from the left table and fills unmatched right-side columns with NULL. RIGHT and FULL OUTER JOIN provide corresponding alternatives.",
                concept("combines table rows", 2, "combines rows from tables", "combines rows", "combines tables"),
                concept("join condition", 2, "on clause", "join condition", "related columns", "matching columns"),
                concept("inner join", 2, "inner join", "matching rows"),
                concept("outer join behavior", 2, "left join", "right join", "full outer", "null"));

        add(entries, "What is a window function?",
                "A SQL window function calculates a value across related rows while keeping each input row in the result, unlike a grouping aggregate that collapses rows. The OVER clause defines a window, often with PARTITION BY and ORDER BY. Examples include ROW_NUMBER and running totals.",
                concept("keeps individual rows", 2, "keeps each row", "each row", "without collapsing", "does not collapse"),
                concept("over clause", 2, "over clause"),
                concept("partition and ordering", 2, "partition by", "order by"),
                concept("ranking or aggregate", 2, "row_number", "rank", "running total", "aggregate"));

        add(entries, "Explain database normalization.",
                "Normalization organizes relational data to reduce duplication and update anomalies. First normal form requires atomic column values; second normal form removes partial dependencies on part of a composite key; third normal form removes transitive dependencies so non-key attributes depend on the key, the whole key, and nothing but the key.",
                concept("reduces redundancy", 2, "redundancy", "duplication", "duplicate data"),
                concept("prevents anomalies", 2, "update anomalies", "insert anomaly", "delete anomaly", "anomalies"),
                concept("first normal form", 1, "first normal form", "1nf", "atomic"),
                concept("second normal form", 1, "second normal form", "2nf", "partial dependency"),
                concept("third normal form", 2, "third normal form", "3nf", "transitive dependency"));

        return Map.copyOf(entries);
    }

    private static void add(
            Map<String, Entry> entries,
            String question,
            String sampleAnswer,
            Concept... concepts) {
        entries.put(normalizeQuestion(question), new Entry(sampleAnswer, List.of(concepts)));
    }

    private static Concept concept(String label, int weight, String... aliases) {
        return new Concept(label, weight, List.of(aliases));
    }

    private static String normalizeQuestion(String question) {
        return Normalizer.normalize(question == null ? "" : question, Normalizer.Form.NFKD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#]+", " ")
                .trim()
                .replaceAll("\\s+", " ");
    }

    record Entry(String sampleAnswer, List<Concept> concepts) {
    }

    record Concept(String label, int weight, List<String> aliases) {

        boolean matches(String normalizedAnswer) {
            String paddedAnswer = " " + normalizedAnswer + " ";
            return aliases.stream()
                    .map(MockQuestionKnowledgeBase::normalizeQuestion)
                    .anyMatch(alias -> paddedAnswer.contains(" " + alias + " "));
        }
    }
}