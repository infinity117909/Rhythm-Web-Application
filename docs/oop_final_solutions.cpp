// ============================================================
//  OOP SAMPLE FINAL — SPRING 2026
//  C++ Solutions (all 8 problems)
// ============================================================

// ─────────────────────────────────────────────────────────────
// PROBLEM 1
// ─────────────────────────────────────────────────────────────
//
// Vectors:
//   v1 = {40,24,30,25}        max=40, size=4
//   v2 = {28,18,45,10}        max=45, size=4
//   v3 = {14,40,13}           max=40, size=3
//   v4 = {12,8,33,10,40,5}    max=40, size=6
//   v5 = {14,40,13,28,2}      max=40, size=5
//
// Lexicographic sort (w) — std::sort default:
//   Compare element-by-element; shorter vector is "less" on prefix tie.
//   First elements:  v4(12) < v3(14) = v5(14) < v2(28) < v1(40)
//   v3 vs v5: first three are equal {14,40,13}; v3 ends there → v3 < v5
//   Result order: v4, v3, v5, v2, v1
//
//   Output:
//     12 8 33 10 40 5
//     14 40 13
//     14 40 13 28 2
//     28 18 45 10
//     40 24 30 25
//
// VectorComp sort (v) — sort by max element; tie-break by size (smaller first):
//   v3: max=40, size=3
//   v1: max=40, size=4
//   v5: max=40, size=5
//   v4: max=40, size=6
//   v2: max=45, size=4
//   Result order: v3, v1, v5, v4, v2
//
//   Output:
//     14 40 13
//     40 24 30 25
//     14 40 13 28 2
//     12 8 33 10 40 5
//     28 18 45 10

#include <iostream>
#include <vector>
#include <iterator>
#include <algorithm>
#include <set>
#include <string>
using namespace std;

// ─────────────────────────────────────────────────────────────
// PROBLEM 1 — runnable version (uncomment main_p1 to test)
// ─────────────────────────────────────────────────────────────
class VectorComp {
public:
    bool operator()(const vector<int>& a, const vector<int>& b) const {
        auto i1 = max_element(a.begin(), a.end());
        auto i2 = max_element(b.begin(), b.end());
        if (*i1 == *i2)
            return a.size() < b.size();
        else
            return *i1 < *i2;
    }
};

void problem1() {
    vector<int> v1{40,24,30,25}, v2{28,18,45,10}, v3{14,40,13},
                v4{12,8,33,10,40,5}, v5{14,40,13,28,2};
    vector<vector<int>> v, w;
    v.push_back(v1); v.push_back(v2); v.push_back(v3);
    v.push_back(v4); v.push_back(v5);
    w = v;

    sort(w.begin(), w.end());
    sort(v.begin(), v.end(), VectorComp());

    cout << "Vector of vectors sorted lexicographically\n";
    for (auto i = w.begin(); i != w.end(); ++i) {
        ostream_iterator<int> osi(cout, " ");
        copy(i->begin(), i->end(), osi);
        cout << '\n';
    }

    cout << "Vector of vectors sorted by VectorComp\n";
    for (auto i = v.begin(); i != v.end(); ++i) {
        ostream_iterator<int> osi(cout, " ");
        copy(i->begin(), i->end(), osi);
        cout << '\n';
    }
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 2 — Implementation of reverse_copy
// ─────────────────────────────────────────────────────────────
//
// reverse_copy copies elements from [sourceBeg, sourceEnd) into
// the destination in reverse order, leaving the source unchanged.
// Returns the iterator pointing one past the last written element.

template<class BidirectionalIterator, class OutputIterator>
OutputIterator my_reverse_copy(BidirectionalIterator sourceBeg,
                               BidirectionalIterator sourceEnd,
                               OutputIterator destBeg) {
    while (sourceBeg != sourceEnd) {
        --sourceEnd;
        *destBeg = *sourceEnd;
        ++destBeg;
    }
    return destBeg;
}

void problem2() {
    vector<int> src{1, 2, 3, 4, 5};
    vector<int> dst(src.size());
    my_reverse_copy(src.begin(), src.end(), dst.begin());
    cout << "reverse_copy result: ";
    for (int x : dst) cout << x << " ";
    cout << '\n';
    // Expected: 5 4 3 2 1
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 3 — Set container operations
// ─────────────────────────────────────────────────────────────
//
// Output:
//   1 2 3 5 6 7 8 9          <- set<int> x after initial inserts (sorted, unique)
//   1 2 3 4 5 6 7 8 9        <- after inserting v (4 is new; duplicates ignored)
//   2 4 6 8 1 3 5 7 9        <- set<int,EvenOdd> w (evens first, then odds, each sorted)

struct EvenOdd {
    bool operator()(int x, int y) const {
        // Even before odd; within same parity, ascending order.
        bool xEven = (x % 2 == 0);
        bool yEven = (y % 2 == 0);
        if (xEven != yEven)
            return xEven;            // even < odd
        return x < y;               // same parity: ascending
    }
};

void problem3() {
    // (a) Declare and fill set x
    set<int> x{3, 2, 6, 8, 1, 9, 5, 7};

    // (b) Print x
    cout << "x after initial inserts: ";
    copy(x.begin(), x.end(), ostream_iterator<int>(cout, " "));
    cout << '\n';

    // (c) Declare vector v
    vector<int> v{3, 3, 4, 1, 1, 4, 2, 3, 2};

    // (d) Insert v into x
    x.insert(v.begin(), v.end());

    // (e) Print x
    cout << "x after inserting v:     ";
    copy(x.begin(), x.end(), ostream_iterator<int>(cout, " "));
    cout << '\n';

    // (f) Declare set w with EvenOdd comparator
    set<int, EvenOdd> w;

    // (g) Copy x into w
    copy(x.begin(), x.end(), insert_iterator<set<int,EvenOdd>>(w, w.begin()));

    // (h) Print w
    cout << "w (even-then-odd order): ";
    copy(w.begin(), w.end(), ostream_iterator<int>(cout, " "));
    cout << '\n';
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 4 — Palindrome check (no explicit loops)
// ─────────────────────────────────────────────────────────────
//
// Strategy: reverse a copy of the string and compare with the original.

bool palindrome(const string& s) {
    string t(s);
    reverse(t.begin(), t.end());  // STL algorithm — no manual loop
    return s == t;
}

void problem4() {
    cout << boolalpha;
    cout << "\"radar\" palindrome? " << palindrome("radar") << '\n'; // true
    cout << "\"aha\"   palindrome? " << palindrome("aha")   << '\n'; // true
    cout << "\"hello\" palindrome? " << palindrome("hello") << '\n'; // false
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 5 — Virtual function mechanism during construction
// ─────────────────────────────────────────────────────────────
//
// Output:
//   Base::vf()
//   Derived::vf()
//   Derived::vf()
//
// Explanation:
//   D d;
//     → B::B() is called first (base constructor runs before derived).
//       Inside B::B(), the object is still "purely B" — the vtable points
//       to B's vtable, so vf() resolves to B::vf()  → "Base::vf()"
//     → D::D() body runs. Now the full D object exists, vtable updated.
//       vf() resolves to D::vf()                     → "Derived::vf()"
//   d.f();
//     → Calls B::f() (non-virtual, found by static type).
//       Inside B::f(), this->vf() uses the virtual dispatch on the live D
//       object, so it calls D::vf()                  → "Derived::vf()"

namespace p5 {
    class B {
    public:
        B()       { vf(); }
        void f()  { vf(); }
        virtual void vf() { cout << "Base::vf()\n"; }
    };
    class D : public B {
    public:
        D()       { vf(); }
        void vf() { cout << "Derived::vf()\n"; }
    };
}

void problem5() {
    p5::D d;
    d.f();
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 6 — Virtual vs. non-virtual dispatch through pointer
// ─────────────────────────────────────────────────────────────
//
// Output:
//   Base class invoke function
//   Derived class print function
//
// Explanation:
//   b is a Base* pointing to a Derived object.
//   b->invoke() uses STATIC dispatch (invoke is NOT virtual), so
//   Base::invoke() is called → prints "Base class invoke function".
//   Inside Base::invoke(), this->print() uses VIRTUAL dispatch because
//   print() IS virtual and b actually points to a Derived object, so
//   Derived::print() is called → prints "Derived class print function".

namespace p6 {
    class Base {
    public:
        virtual void print() {
            cout << "Base class print function\n";
        }
        void invoke() {
            cout << "Base class invoke function\n";
            this->print();   // virtual dispatch → Derived::print
        }
    };
    class Derived : public Base {
    public:
        void print() {
            cout << "Derived class print function\n";
        }
        void invoke() {
            cout << "Derived class invoke function\n";
            this->print();
        }
    };
}

void problem6() {
    p6::Base* b = new p6::Derived;
    b->invoke();
    delete b;
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 7 — Virtual base class + copy constructors
// ─────────────────────────────────────────────────────────────
//
// Output:   ABCDABCd
//
// Explanation:
//   D d1;
//     Construction order for diamond inheritance (B and C both virtual-inherit A):
//       1. A()  → "A"   (virtual base constructed exactly once, by the most-derived class D)
//       2. B()  → "B"
//       3. C()  → "C"
//       4. D()  → "D"
//     Prints: ABCD
//
//   D d2(d1);
//     D's user-defined copy constructor is  D(const D&) { cout << "d"; }
//     It has NO explicit initializer list, so base sub-objects are initialized
//     by their DEFAULT constructors (not copy constructors):
//       1. A()  → "A"   (virtual base; D's ctor is responsible, no explicit call → default)
//       2. B()  → "B"   (default, not copy)
//       3. C()  → "C"   (default, not copy)
//       4. D body       → "d"
//     Prints: ABCd

namespace p7 {
    class A {
    public:
        A()           { cout << "A"; }
        A(const A&)   { cout << "a"; }
    };
    class B : public virtual A {
    public:
        B()           { cout << "B"; }
        B(const B&)   { cout << "b"; }
    };
    class C : public virtual A {
    public:
        C()           { cout << "C"; }
        C(const C&)   { cout << "c"; }
    };
    class D : public B, public C {
    public:
        D()           { cout << "D"; }
        D(const D&)   { cout << "d"; }
    };
}

void problem7() {
    p7::D d1;
    p7::D d2(d1);
    cout << '\n';
}

// ─────────────────────────────────────────────────────────────
// PROBLEM 8 — True / False
// ─────────────────────────────────────────────────────────────
//
// (a) FALSE.
//     A class that inherits from an abstract base class does NOT have to
//     override all pure virtual functions — but it will itself become abstract
//     (and cannot be instantiated) if any pure virtual function remains
//     un-overridden.
//
// (b) TRUE.
//     In STL sequence containers (vector, deque, list), the position of an
//     element is determined by when and where it is inserted.  Insertion does
//     not reorder existing elements.
//
// (c) TRUE.
//     Template argument deduction requires an exact type match (no implicit
//     conversions).  E.g., max<T>(int, double) fails to deduce T.
//
// (d) FALSE.
//     This is generally true for normal inheritance, but there is an important
//     exception: when the grandparent is a *virtual* base class, the most-
//     derived class's constructor MUST (and can) call the virtual base's
//     constructor directly, bypassing the intermediate parent.

// ─────────────────────────────────────────────────────────────
// main — run all problems
// ─────────────────────────────────────────────────────────────
int main() {
    cout << "=== Problem 1 ===\n";
    problem1();
    cout << "\n=== Problem 2 ===\n";
    problem2();
    cout << "\n=== Problem 3 ===\n";
    problem3();
    cout << "\n=== Problem 4 ===\n";
    problem4();
    cout << "\n=== Problem 5 ===\n";
    problem5();
    cout << "\n=== Problem 6 ===\n";
    problem6();
    cout << "\n=== Problem 7 ===\n";
    problem7();
    cout << "\n=== Problem 8 (see comments above) ===\n";
    cout << "(a) FALSE  (b) TRUE  (c) TRUE  (d) FALSE\n";
    return 0;
}
