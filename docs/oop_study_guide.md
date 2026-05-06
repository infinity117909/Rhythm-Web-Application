# OOP Final Study Guide
### Spring 2026 — Expanded Edition

---

## Table of Contents

1. [Class Design Foundations](#1-class-design-foundations)
2. [Inheritance and Access Rules](#2-inheritance-and-access-rules)
   - [2.1 Basics](#21-inheritance-basics)
   - [2.2 Polymorphism – Virtual Functions](#22-polymorphism--virtual-functions)
   - [2.3 Abstract Base Classes – Pure Virtual Functions](#23-abstract-base-classes--pure-virtual-functions)
   - [2.4 Multiple Inheritance & the Diamond Problem](#24-multiple-inheritance--the-diamond-problem)
3. [Copying, Assignment, Move Semantics](#3-copying-assignment-move-semantics)
4. [Templates & Generic Programming](#4-templates--generic-programming)
   - [4.1 Template Functions](#41-template-functions)
   - [4.2 Template Classes](#42-template-classes)
   - [4.3 STL — Template Data Structures (Containers)](#43-stl--template-data-structures-containers)
   - [4.4 STL — Template Algorithms](#44-stl--template-algorithms)
   - [4.5 STL — Iterators](#45-stl--iterators)
5. [Casting & Type System](#5-casting--type-system)
6. [Modern C++ Features](#6-modern-c-features)
7. [Exam Strategy Checklist](#7-exam-strategy-checklist)
8. [Quick Reference: High-Probability Topics](#8-quick-reference-high-probability-topics)

---

## 1) Class Design Foundations

### Core Concepts
- **Class syntax**: data members + member functions bundled behind an access specifier.
- **Construction vs. Initialization**: Construction allocates memory; initialization sets member values (initializer list runs *before* the constructor body).
- **Default constructor**: synthesized by the compiler only when no user-declared constructor exists. Suppressed as soon as you declare *any* constructor.
- **Destructor**: called when an object leaves scope or `delete` is used. Should be `virtual` in any base class.

### C++ Example

```cpp
class BankAccount {
private:
    std::string owner;
    double balance;

public:
    // Default constructor
    BankAccount() : owner("Unknown"), balance(0.0) {}

    // Parameterized constructor (initializer list)
    BankAccount(const std::string& name, double bal)
        : owner(name), balance(bal) {}

    // Destructor
    ~BankAccount() { /* release resources */ }

    // Getter / setter
    double getBalance() const { return balance; }
    void   deposit(double amount) { balance += amount; }
};
```

### Python Equivalent

```python
class BankAccount:
    def __init__(self, owner="Unknown", balance=0.0):
        self._owner   = owner
        self._balance = balance

    def __del__(self):
        pass  # Python uses garbage collection

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount
```

### Check Yourself
- When is the compiler-generated default constructor suppressed?
- What is the order of execution: initializer list vs. constructor body?
- Why should base-class destructors be `virtual`?

---

## 2) Inheritance and Access Rules

### 2.1 Inheritance Basics

**Relationship**: "is-a". A `Dog` **is-a** `Animal`.

| Inheritance type | `public` member of base | `protected` member of base | `private` member of base |
|---|---|---|---|
| `public` inheritance | `public` in derived | `protected` in derived | inaccessible |
| `protected` inheritance | `protected` in derived | `protected` in derived | inaccessible |
| `private` inheritance | `private` in derived | `private` in derived | inaccessible |

**Constructor chaining**: Derived constructors must call a base constructor (explicitly or implicitly via default).

```cpp
class Animal {
protected:
    std::string name;
public:
    Animal(const std::string& n) : name(n) {}
    void eat() { std::cout << name << " is eating.\n"; }
};

class Dog : public Animal {
private:
    std::string breed;
public:
    // Base constructor called in initializer list
    Dog(const std::string& n, const std::string& b)
        : Animal(n), breed(b) {}

    void bark() { std::cout << name << " says: Woof!\n"; }
};
```

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print(f"{self.name} is eating.")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # explicit base call
        self.breed = breed

    def bark(self):
        print(f"{self.name} says: Woof!")
```

**Overriding vs. Overloading**

| | Definition | Language mechanism |
|---|---|---|
| **Overriding** | Same name, same signature in a derived class | Runtime (virtual) dispatch |
| **Overloading** | Same name, different parameter list in same scope | Compile-time resolution |

---

### 2.2 Polymorphism – Virtual Functions

**Key rule**: `virtual` enables *dynamic dispatch* — the function called is determined by the **runtime type** of the object, not the static (compile-time) type of the pointer/reference.

```cpp
class Shape {
public:
    virtual double area() const {
        return 0.0;           // default implementation
    }
    virtual ~Shape() {}       // ALWAYS make base destructor virtual
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {   // 'override' keyword catches typos
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

// Polymorphic usage through base pointer
void printArea(const Shape* s) {
    std::cout << "Area = " << s->area() << "\n";  // dynamic dispatch
}

int main() {
    Shape* shapes[] = { new Circle(5), new Rectangle(3, 4) };
    for (auto s : shapes) printArea(s);
    // Circle->area() and Rectangle->area() called correctly
}
```

**Virtual dispatch during construction** (classic exam trap):

```cpp
class B {
public:
    B()  { vf(); }             // calls B::vf — vtable not yet set to D
    virtual void vf() { std::cout << "B::vf\n"; }
};
class D : public B {
public:
    D()  { vf(); }             // now vtable is D's; calls D::vf
    void vf() override { std::cout << "D::vf\n"; }
};
// D d;  =>  B::vf  then  D::vf
```

> **Rule**: Inside a constructor (or destructor), `virtual` calls resolve to the **class being constructed/destroyed**, not the most-derived class.

**Static binding** (non-virtual through pointer):

```cpp
class Base {
public:
    void f() { std::cout << "Base::f\n"; }  // NOT virtual
};
class Derived : public Base {
public:
    void f() { std::cout << "Derived::f\n"; }
};

Base* b = new Derived;
b->f();   // prints "Base::f" — static type decides (Base*)
```

**Python**: All method calls are dynamically dispatched by default — Python has no equivalent of a non-virtual method. Use `Base.method(self)` to force static dispatch.

---

### 2.3 Abstract Base Classes – Pure Virtual Functions

A **pure virtual function** (`= 0`) makes the class **abstract** — it cannot be instantiated directly.  
Derived classes must override all pure virtual functions to become concrete; otherwise they remain abstract.

```cpp
class Animal {
public:
    virtual void speak() = 0;    // pure virtual
    virtual ~Animal() {}
};

class Dog : public Animal {
public:
    void speak() override { std::cout << "Woof!\n"; }
};

class Cat : public Animal {
public:
    void speak() override { std::cout << "Meow!\n"; }
};

// Animal a;        // ERROR — abstract class
Dog d; d.speak();   // OK
```

Abstract classes are used to define **interfaces** — a contract that derived classes must fulfill.

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self): ...

class Dog(Animal):
    def speak(self):
        print("Woof!")

# Animal()   # raises TypeError
Dog().speak()
```

**True/False reminder (Problem 8a)**:  
A derived class does NOT have to override all pure virtual functions — but it will itself be abstract and uninstantiable if it does not.

---

### 2.4 Multiple Inheritance & the Diamond Problem

#### Basic Multiple Inheritance

```cpp
class Flyable {
public:
    void fly() { std::cout << "Flying\n"; }
};
class Swimmable {
public:
    void swim() { std::cout << "Swimming\n"; }
};
class Duck : public Flyable, public Swimmable {};

Duck d;
d.fly();   // OK
d.swim();  // OK
```

#### The Diamond Problem

```
       A
      / \
     B   C
      \ /
       D
```

Without `virtual` inheritance, `D` would contain **two copies** of `A`.

```cpp
// Without virtual: ambiguous, two A sub-objects
class A { public: int x; };
class B : public A {};
class C : public A {};
class D : public B, public C {};

D d;
// d.x = 5;    // ERROR: ambiguous — B::A::x or C::A::x?
d.B::x = 5;    // must qualify
```

**Solution: virtual base class**

```cpp
class A { public: int x; A() { std::cout << "A\n"; } };
class B : public virtual A { public: B() { std::cout << "B\n"; } };
class C : public virtual A { public: C() { std::cout << "C\n"; } };
class D : public B, public C   { public: D() { std::cout << "D\n"; } };

D d;   // prints: A B C D  (A constructed exactly once)
d.x = 5;  // unambiguous
```

**Constructor order with virtual base**:
1. The **most-derived** class (`D`) is responsible for constructing the virtual base (`A`) directly.
2. Order: virtual bases first, then left-to-right non-virtual bases, then derived.

**Copy constructor trap** (Problem 7 from exam):

```cpp
class D : public B, public C {
public:
    D(const D&) { std::cout << "d"; }  // no initializer list!
};
// D d2(d1):
// D's copy ctor has no explicit call to B(const B&) or C(const C&),
// so ALL bases fall back to their DEFAULT constructors.
// A() → "A",  B() → "B",  C() → "C",  then body → "d"
// Output: ABCd
```

**Python diamond (MRO)**:

```python
class A:
    def hello(self): print("A")

class B(A):
    def hello(self): print("B"); super().hello()

class C(A):
    def hello(self): print("C"); super().hello()

class D(B, C):
    def hello(self): print("D"); super().hello()

D().hello()   # D B C A  — MRO: D → B → C → A
```

Python's **C3 linearization** (MRO) guarantees each class appears exactly once.

---

## 3) Copying, Assignment, Move Semantics

### Copy Constructor vs. Copy Assignment

```cpp
MyClass a;
MyClass b = a;   // copy constructor
MyClass c;
c = a;           // copy assignment operator
```

### Shallow vs. Deep Copy

```cpp
// Shallow (default) — both objects share the same raw pointer
class Shallow {
    int* data;
public:
    Shallow(int v) : data(new int(v)) {}
    // compiler-generated copy ctor copies the POINTER — double-free on destruction!
};

// Deep — each object owns its own copy
class Deep {
    int* data;
public:
    Deep(int v) : data(new int(v)) {}
    Deep(const Deep& o) : data(new int(*o.data)) {}  // allocate fresh
    Deep& operator=(const Deep& o) {
        if (this != &o) { delete data; data = new int(*o.data); }
        return *this;
    }
    ~Deep() { delete data; }
};
```

### Move Semantics (`std::move`)

```cpp
std::vector<int> src{1, 2, 3};
std::vector<int> dst = std::move(src);
// src is now in a valid but unspecified state (typically empty)
// No heap allocation — ownership transferred
```

- **Move constructor**: steals resources, leaves source empty.
- **Move assignment**: same, with self-assignment check.
- Use `std::move` to turn an lvalue into an rvalue when you no longer need the source.

---

## 4) Templates & Generic Programming

> **Exam note**: You are MORE likely to be asked to **write code** in a template context.

---

### 4.1 Template Functions

A template function works with any type that satisfies its operations.

```cpp
template<typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

maxOf(3, 5);          // T deduced as int
maxOf(3.14, 2.71);    // T deduced as double
// maxOf(3, 2.71);    // ERROR — ambiguous (int vs double), no implicit conversion
```

**Argument deduction rules**:
- Deduction performs **exact matches** (no implicit conversions).
- You can explicitly specify: `maxOf<double>(3, 2.71)`.

**Function template specialization**:

```cpp
template<typename T>
bool equal(T a, T b) { return a == b; }

// Specialization for C-strings
template<>
bool equal<const char*>(const char* a, const char* b) {
    return std::strcmp(a, b) == 0;
}
```

---

### 4.2 Template Classes

```cpp
template<typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& val) { data.push_back(val); }
    void pop()              { data.pop_back(); }
    T&   top()              { return data.back(); }
    bool empty() const      { return data.empty(); }
    std::size_t size() const { return data.size(); }
};

Stack<int>         iStack;
Stack<std::string> sStack;
iStack.push(42);
sStack.push("hello");
```

**Class template with multiple type parameters**:

```cpp
template<typename K, typename V>
class Pair {
public:
    K key;
    V value;
    Pair(K k, V v) : key(k), value(v) {}
};

Pair<std::string, int> p("age", 30);
```

**Non-type template parameters**:

```cpp
template<typename T, std::size_t N>
class FixedArray {
    T data[N];
public:
    T& operator[](std::size_t i) { return data[i]; }
    constexpr std::size_t size() const { return N; }
};

FixedArray<int, 5> arr;
arr[0] = 10;
```

**Variadic templates** (C++11+):

```cpp
// Base case
void print() { std::cout << "\n"; }

// Recursive case — unpacks one argument at a time
template<typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << " ";
    print(rest...);
}

print(1, "hello", 3.14);  // 1 hello 3.14
```

---

### 4.3 STL — Template Data Structures (Containers)

All STL containers are class templates parameterized on their element type (and optionally an allocator or comparator).

#### Container Categories

| Category | Containers | Ordering | Unique? |
|---|---|---|---|
| Sequence | `vector`, `deque`, `list`, `array`, `forward_list` | Insertion order | No |
| Ordered associative | `set`, `multiset`, `map`, `multimap` | Sorted by key | `set`/`map`: yes |
| Unordered associative | `unordered_set`, `unordered_map`, etc. | Hash bucket | `unordered_set`/`map`: yes |
| Container adaptors | `stack`, `queue`, `priority_queue` | Adapts above | — |

#### `vector<T>` — Dynamic Array

```cpp
#include <vector>
std::vector<int> v{1, 2, 3};
v.push_back(4);           // O(1) amortized
v.insert(v.begin(), 0);   // O(n)
v.erase(v.begin() + 2);   // O(n)
std::cout << v.size();    // 4
```

#### `list<T>` — Doubly-Linked List

```cpp
#include <list>
std::list<int> lst{1, 2, 3};
lst.push_front(0);   // O(1)
lst.push_back(4);    // O(1)
lst.sort();          // O(n log n) — member function, not std::sort
```

#### `set<T>` — Ordered Unique Set (BST-backed, O(log n))

```cpp
#include <set>
std::set<int> s{3, 1, 4, 1, 5};  // {1, 3, 4, 5} — duplicates removed
s.insert(2);
s.erase(3);
auto it = s.find(4);  // returns iterator, or s.end() if not found

// Custom comparator
struct Descending {
    bool operator()(int a, int b) const { return a > b; }
};
std::set<int, Descending> sd{3, 1, 4, 1, 5};  // {5, 4, 3, 1}
```

#### `map<K, V>` — Ordered Key-Value (BST-backed)

```cpp
#include <map>
std::map<std::string, int> freq;
freq["apple"]++;
freq["banana"] = 3;
for (auto& [key, val] : freq)       // C++17 structured binding
    std::cout << key << ": " << val << "\n";
```

#### `unordered_map<K, V>` — Hash Map (O(1) average)

```cpp
#include <unordered_map>
std::unordered_map<std::string, int> ht;
ht["x"] = 10;
ht["y"] = 20;
```

#### Python Analogs

| C++ | Python |
|---|---|
| `vector<T>` | `list` |
| `set<T>` | `set` (unordered) / `SortedList` from `sortedcontainers` |
| `map<K,V>` | `dict` (unordered) / `SortedDict` |
| `unordered_map` | `dict` |
| `multiset` | `Counter` / unsorted list |
| `stack` | `list` with `.append`/`.pop` |
| `queue` | `collections.deque` |

---

### 4.4 STL — Template Algorithms

STL algorithms live in `<algorithm>` and `<numeric>`. They are **template functions** parameterized on iterator types and optionally on function objects/lambdas.

> **Exam rule**: When a question says "no explicit loop", use STL algorithms.

#### Sorting

```cpp
std::vector<int> v{3, 1, 4, 1, 5};
std::sort(v.begin(), v.end());                          // ascending
std::sort(v.begin(), v.end(), std::greater<int>());     // descending

// Custom comparator (functor)
struct ByAbs {
    bool operator()(int a, int b) const { return std::abs(a) < std::abs(b); }
};
std::sort(v.begin(), v.end(), ByAbs());

// Custom comparator (lambda)
std::sort(v.begin(), v.end(), [](int a, int b){ return std::abs(a) < std::abs(b); });
```

#### Searching

```cpp
auto it = std::find(v.begin(), v.end(), 4);
if (it != v.end()) std::cout << "Found: " << *it;

// Binary search (requires sorted range)
bool found = std::binary_search(v.begin(), v.end(), 4);
auto lb = std::lower_bound(v.begin(), v.end(), 4); // first >= 4
auto ub = std::upper_bound(v.begin(), v.end(), 4); // first >  4
```

#### Copying and Transforming

```cpp
// copy
std::vector<int> dst(v.size());
std::copy(v.begin(), v.end(), dst.begin());

// reverse_copy
std::reverse_copy(v.begin(), v.end(), dst.begin());

// copy_if (filter)
std::vector<int> evens;
std::copy_if(v.begin(), v.end(), std::back_inserter(evens),
             [](int x){ return x % 2 == 0; });

// transform (map)
std::vector<int> squares(v.size());
std::transform(v.begin(), v.end(), squares.begin(),
               [](int x){ return x * x; });
```

#### Reducing / Accumulating

```cpp
#include <numeric>
int sum     = std::accumulate(v.begin(), v.end(), 0);
int product = std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>());
```

#### Other Commonly Tested Algorithms

```cpp
std::reverse(v.begin(), v.end());         // in-place reverse
std::max_element(v.begin(), v.end());     // returns iterator to max
std::min_element(v.begin(), v.end());     // returns iterator to min
std::count(v.begin(), v.end(), 3);        // count occurrences
std::any_of(v.begin(), v.end(), [](int x){ return x > 4; });
std::all_of(v.begin(), v.end(), [](int x){ return x > 0; });
std::none_of(v.begin(), v.end(), [](int x){ return x < 0; });
std::unique(v.begin(), v.end());          // collapse consecutive duplicates
std::fill(v.begin(), v.end(), 0);
std::generate(v.begin(), v.end(), [n=0]() mutable { return n++; });
```

#### Printing with `ostream_iterator`

```cpp
#include <iterator>
std::copy(v.begin(), v.end(), std::ostream_iterator<int>(std::cout, " "));
```

#### Inserting into Associative Containers

```cpp
std::set<int> s;
std::copy(v.begin(), v.end(), std::inserter(s, s.begin()));
// or
std::copy(v.begin(), v.end(), std::insert_iterator<std::set<int>>(s, s.begin()));
```

#### Python Equivalents

```python
# sort
v.sort()                              # in-place
sorted(v)                             # new list
sorted(v, key=abs)                    # custom key

# find / filter / map / reduce
any(x > 4 for x in v)
all(x > 0 for x in v)
list(filter(lambda x: x % 2 == 0, v))
list(map(lambda x: x*x, v))

from functools import reduce
import operator
reduce(operator.add, v, 0)            # sum
```

---

### 4.5 STL — Iterators

Iterators are the glue between containers and algorithms.  They model a generalized pointer.

#### Iterator Categories (weakest → strongest)

| Category | Operations | Example container |
|---|---|---|
| **Input** | `++`, `*` (read once), `==` | `istream_iterator` |
| **Output** | `++`, `*` (write once) | `ostream_iterator`, `back_insert_iterator` |
| **Forward** | `++`, `*` (read/write, multi-pass) | `forward_list` |
| **Bidirectional** | Forward + `--` | `list`, `set`, `map` |
| **Random Access** | Bidirectional + `+n`, `-n`, `[]`, `<` | `vector`, `deque`, `array` |

#### Common Iterator Patterns

```cpp
// Range-based traversal
for (auto it = v.begin(); it != v.end(); ++it)
    std::cout << *it << " ";

// Range-for (preferred C++11+)
for (const auto& x : v) std::cout << x << " ";

// Reverse iteration
for (auto it = v.rbegin(); it != v.rend(); ++it)
    std::cout << *it << " ";
```

#### `ostream_iterator` — Output Iterator

```cpp
std::ostream_iterator<int> osi(std::cout, " ");
*osi = 42;   // writes 42 followed by " " to cout
++osi;       // advance (no-op for ostream_iterator)

// Used with copy:
std::copy(v.begin(), v.end(), std::ostream_iterator<int>(std::cout, "\n"));
```

#### `back_insert_iterator` / `inserter`

```cpp
std::vector<int> dst;
std::copy(src.begin(), src.end(), std::back_inserter(dst));
// equivalent to calling dst.push_back() for each element

std::set<int> s;
std::copy(src.begin(), src.end(), std::inserter(s, s.begin()));
// calls s.insert() for each element
```

#### `istream_iterator` — Read from Stream

```cpp
std::istream_iterator<int> begin(std::cin), end;
std::vector<int> v(begin, end);   // reads all ints from stdin
```

#### Custom `reverse_copy` (Exam Question 2)

```cpp
template<class BidirectionalIterator, class OutputIterator>
OutputIterator reverse_copy(BidirectionalIterator srcBeg,
                            BidirectionalIterator srcEnd,
                            OutputIterator        destBeg) {
    while (srcBeg != srcEnd) {
        --srcEnd;
        *destBeg = *srcEnd;
        ++destBeg;
    }
    return destBeg;
}
```

#### Custom `back_insert_iterator` Skeleton

```cpp
template<class Container>
class back_insert_iterator {
    Container* c;
public:
    explicit back_insert_iterator(Container& cont) : c(&cont) {}

    back_insert_iterator& operator=(const typename Container::value_type& val) {
        c->push_back(val);
        return *this;
    }
    back_insert_iterator& operator*()  { return *this; }
    back_insert_iterator& operator++() { return *this; }
};

template<class Container>
back_insert_iterator<Container> back_inserter(Container& c) {
    return back_insert_iterator<Container>(c);
}
```

---

## 5) Casting & Type System

| Cast | Purpose | Safe? |
|---|---|---|
| `static_cast<T>` | Compile-time conversions (numeric, up/downcast) | Partially — no runtime check |
| `dynamic_cast<T*>` | Safe polymorphic downcast; returns `nullptr` on failure | Yes — requires virtual function |
| `const_cast<T>` | Add/remove `const`/`volatile` | Yes, if original wasn't const |
| `reinterpret_cast<T>` | Bit-level reinterpretation | Dangerous |

```cpp
class Base { public: virtual ~Base() {} };
class Derived : public Base { public: void extra() {} };

Base* b = new Derived;
Derived* d = dynamic_cast<Derived*>(b);   // safe downcast
if (d) d->extra();

// static_cast — no runtime check (faster but dangerous if wrong)
Derived* d2 = static_cast<Derived*>(b);
```

**Object slicing** — occurs when a derived object is assigned/passed by value to a base:

```cpp
Derived obj;
Base b = obj;   // SLICED — derived members lost
// Fix: use pointers or references
Base& bRef = obj;   // no slicing
```

---

## 6) Modern C++ Features

### `constexpr`

```cpp
constexpr int square(int x) { return x * x; }
constexpr int s = square(5);   // computed at compile time
```

### `if constexpr` (C++17)

```cpp
template<typename T>
void describe(T val) {
    if constexpr (std::is_integral_v<T>)
        std::cout << "integer: " << val;
    else
        std::cout << "other: " << val;
}
```

### `decltype` and `auto`

```cpp
auto x = 5;                          // int
decltype(x) y = 10;                  // same type as x → int
auto add(int a, int b) -> int { return a + b; }  // trailing return
```

### Structured Bindings (C++17)

```cpp
std::map<std::string, int> m{{"a", 1}, {"b", 2}};
for (auto& [key, val] : m)
    std::cout << key << "=" << val << "\n";
```

### Ranges (C++20)

```cpp
#include <ranges>
auto evens = v | std::views::filter([](int x){ return x % 2 == 0; })
               | std::views::transform([](int x){ return x * x; });
for (int x : evens) std::cout << x << " ";
```

### Three-Way Comparison (C++20)

```cpp
#include <compare>
auto result = 3 <=> 5;   // std::strong_ordering::less
```

---

## 7) Exam Strategy Checklist

- **Output questions**: trace constructor order and virtual dispatch step-by-step. Ask: "Is the vtable fully set at this point?"
- **Virtual dispatch in constructors**: during `B::B()`, the vtable points to `B`'s version even if the full object is a `D`.
- **STL questions**: prefer `copy`, `transform`, `reverse`, `accumulate` over manual loops.
- **Set/map questions**: remember ordering (BST → sorted) and uniqueness guarantees.
- **Template questions**: deduction requires exact type match — no implicit conversions.
- **Inheritance questions**: always identify **static type** (compile-time) vs. **dynamic type** (runtime) before predicting which function is called.
- **Diamond/virtual base**: the most-derived class constructs the virtual base; copy ctors without initializer lists fall back to default ctors for bases.
- **Abstract classes**: uninstantiable; a derived class inheriting un-overridden pure virtuals is also abstract.

---

## 8) Quick Reference: High-Probability Topics

| Topic | Key Rule | Exam Trap |
|---|---|---|
| Virtual dispatch in ctor/dtor | Resolves to current class, not most-derived | `B::B()` calls `B::vf()` even if object is `D` |
| Non-virtual wrapper calling virtual | Static dispatch on wrapper; dynamic on inner call | `b->invoke()` calls `Base::invoke`, but `this->print()` inside calls `Derived::print` |
| `set` ordering | BST-backed, sorted, unique | Custom comparator must be a strict weak ordering |
| `reverse_copy` | Writes source backwards into dest; source unchanged | Iterator must be bidirectional |
| Diamond inheritance copy ctor | User-defined copy ctor with no initializer → default ctors for bases | Output is `ABCd` not `abcd` |
| Template deduction | Exact match only | `maxOf(3, 2.71)` fails (int vs double) |
| Abstract class | `= 0` makes class abstract | Derived still abstract if any pure virtual remains |
| Grandchild calling grandparent ctor | Normally illegal **except** for virtual base class | Virtual base ctor must be called by most-derived |
| Sequence container ordering | Insertion order preserved | `set`/`map` re-order; `vector`/`list` do not |
| `ostream_iterator` + `copy` | Standard idiom for printing containers | Remember the delimiter argument |

---

*Practice files referenced in the original study guide: `cplusplus_class.txt`, `dynamic_binding.txt`, `virtual_functions.txt`, `ABC.txt`, `cplusplus_abstract_class.txt`, `diamond_problem*.txt`, `virtual_base_classes.txt`, `set_code.txt`, `map.txt`, `vector_example.txt`, `cplusplus_template_function.txt`, `cplusplus_template_class.txt`, `template_argument_deduction*.txt`, `variadic_template*.txt`, `inserter1.txt`, `reverse_iterator.txt`, `copy_if.txt`.*
