# ============================================================
#  OOP SAMPLE FINAL — SPRING 2026
#  Python Solutions (all 8 problems)
# ============================================================

# ─────────────────────────────────────────────────────────────
# PROBLEM 1 — Vector-of-vectors sorting
# ─────────────────────────────────────────────────────────────
#
# Vectors:
#   v1 = [40,24,30,25]        max=40, len=4
#   v2 = [28,18,45,10]        max=45, len=4
#   v3 = [14,40,13]           max=40, len=3
#   v4 = [12,8,33,10,40,5]    max=40, len=6
#   v5 = [14,40,13,28,2]      max=40, len=5
#
# Lexicographic sort (w):
#   Python's default list comparison is lexicographic.
#   First elements: v4(12) < v3(14)=v5(14) < v2(28) < v1(40)
#   v3 vs v5: prefix {14,40,13} equal; v3 is shorter → v3 < v5
#   Result: v4, v3, v5, v2, v1
#
# VectorComp sort (v):
#   Primary key: max element (ascending).
#   Tie-break: length (ascending — smaller size first).
#   Result: v3(max=40,len=3), v1(max=40,len=4), v5(max=40,len=5),
#           v4(max=40,len=6), v2(max=45,len=4)

from functools import cmp_to_key


def problem1():
    v1 = [40, 24, 30, 25]
    v2 = [28, 18, 45, 10]
    v3 = [14, 40, 13]
    v4 = [12, 8, 33, 10, 40, 5]
    v5 = [14, 40, 13, 28, 2]

    v = [v1, v2, v3, v4, v5]

    # Lexicographic sort (Python list comparison is already lexicographic)
    w = sorted(v)

    # VectorComp sort: by max element, then by length
    def vector_comp_key(lst):
        return (max(lst), len(lst))

    v_sorted = sorted(v, key=vector_comp_key)

    print("Vector of lists sorted lexicographically")
    for row in w:
        print(" ".join(map(str, row)))

    print("Vector of lists sorted by VectorComp")
    for row in v_sorted:
        print(" ".join(map(str, row)))


# ─────────────────────────────────────────────────────────────
# PROBLEM 2 — Implementation of reverse_copy
# ─────────────────────────────────────────────────────────────
#
# Copies elements from source[src_beg:src_end] into dest starting at
# dest_beg, but in reverse order.  Returns the index one past the last
# written position.  Source is not modified.
#
# Python equivalent uses slicing; for a faithful iterator-style version
# both approaches are shown.

def reverse_copy(source, src_beg, src_end, dest, dest_beg):
    """Iterator-index style matching the C++ template signature."""
    i = src_end - 1       # start from the last element
    j = dest_beg
    while i >= src_beg:
        dest[j] = source[i]
        i -= 1
        j += 1
    return j              # position after last written element


def reverse_copy_pythonic(source):
    """Idiomatic Python: return a reversed copy as a new list."""
    return list(reversed(source))


def problem2():
    src = [1, 2, 3, 4, 5]
    dst = [0] * len(src)
    end_pos = reverse_copy(src, 0, len(src), dst, 0)
    print("reverse_copy (index style):", dst)          # [5, 4, 3, 2, 1]
    print("reverse_copy (pythonic):   ", reverse_copy_pythonic(src))  # same


# ─────────────────────────────────────────────────────────────
# PROBLEM 3 — Set container operations
# ─────────────────────────────────────────────────────────────
#
# Python's built-in set is unordered, so we use a sorted list where order
# matters, and a custom sorted structure for the EvenOdd comparator.
#
# Output:
#   1 2 3 5 6 7 8 9
#   1 2 3 4 5 6 7 8 9
#   2 4 6 8 1 3 5 7 9

from sortedcontainers import SortedList  # pip install sortedcontainers


def even_odd_key(n):
    """Even numbers first (parity=0), then odd (parity=1); within each group ascending."""
    return (n % 2, n)


def problem3():
    # (a) Set x — use a sorted set (unique, ordered)
    x = SortedList([3, 2, 6, 8, 1, 9, 5, 7])

    # (b) Print x
    print("x after initial inserts:", " ".join(map(str, x)))

    # (c) Vector v
    v = [3, 3, 4, 1, 1, 4, 2, 3, 2]

    # (d) Insert v into x (SortedList.update adds all; duplicates ARE allowed
    #     in SortedList, so we use a set-like approach: only add if not present)
    for val in v:
        if val not in x:
            x.add(val)

    # (e) Print x
    print("x after inserting v:    ", " ".join(map(str, x)))

    # (f)/(g) Set w with EvenOdd comparator — sort x's contents by even_odd_key
    w = sorted(x, key=even_odd_key)

    # (h) Print w
    print("w (even-then-odd order):", " ".join(map(str, w)))


# ─────────────────────────────────────────────────────────────
# PROBLEM 3 (no third-party library fallback)
# ─────────────────────────────────────────────────────────────

def problem3_stdlib():
    """Same logic using only the standard library."""
    # (a) — Python set, then always work with sorted() for display
    x = set([3, 2, 6, 8, 1, 9, 5, 7])

    # (b)
    print("x after initial inserts:", " ".join(map(str, sorted(x))))

    # (c)
    v = [3, 3, 4, 1, 1, 4, 2, 3, 2]

    # (d)
    x.update(v)   # set.update ignores duplicates automatically

    # (e)
    print("x after inserting v:    ", " ".join(map(str, sorted(x))))

    # (f)/(g) EvenOdd ordering: sort x with even_odd_key
    w = sorted(x, key=even_odd_key)

    # (h)
    print("w (even-then-odd order):", " ".join(map(str, w)))


# ─────────────────────────────────────────────────────────────
# PROBLEM 4 — Palindrome check (no explicit loops)
# ─────────────────────────────────────────────────────────────
#
# Strategy: reverse with slicing ([::-1]) and compare — no loops.

def palindrome(s: str) -> bool:
    return s == s[::-1]   # slice reversal — no loop


def problem4():
    print(f'"radar" palindrome? {palindrome("radar")}')   # True
    print(f'"aha"   palindrome? {palindrome("aha")}')     # True
    print(f'"hello" palindrome? {palindrome("hello")}')   # False


# ─────────────────────────────────────────────────────────────
# PROBLEM 5 — Virtual function mechanism during construction
# ─────────────────────────────────────────────────────────────
#
# C++ Output:
#   Base::vf()
#   Derived::vf()
#   Derived::vf()
#
# Python equivalent — Python does NOT have a "partial object" construction
# phase like C++.  In Python, vf() always resolves to the overriding method
# even when called from __init__ of a parent class, because the MRO is set
# before any __init__ runs.  This is the KEY difference from C++.

class B_p5:
    def __init__(self):
        self.vf()           # Python: dispatches to D_p5.vf() immediately!

    def f(self):
        self.vf()           # virtual dispatch

    def vf(self):
        print("Base::vf()")


class D_p5(B_p5):
    def __init__(self):
        super().__init__()  # calls B.__init__, which calls self.vf() → D_p5.vf()
        self.vf()           # D_p5.vf() again

    def vf(self):
        print("Derived::vf()")


def problem5():
    # Python output differs from C++!
    # C++:    Base::vf()  / Derived::vf()  / Derived::vf()
    # Python: Derived::vf() / Derived::vf() / Derived::vf()
    # Because Python's MRO is resolved before __init__ executes.
    print("Python output (differs from C++ — see comment above):")
    d = D_p5()
    d.f()


# ─────────────────────────────────────────────────────────────
# PROBLEM 6 — Virtual vs non-virtual dispatch through pointer
# ─────────────────────────────────────────────────────────────
#
# C++ Output:
#   Base class invoke function
#   Derived class print function
#
# Explanation:
#   b->invoke() resolves to Base::invoke() because invoke() is NOT virtual
#   (static type of b is Base*).  Inside Base::invoke(), this->print() IS
#   virtual, so it dispatches to Derived::print().
#
# Python note:
#   Python has no non-virtual methods in the C++ sense — ALL method calls go
#   through the MRO.  To emulate static dispatch we must call the method
#   explicitly on the class (Base.invoke(b)), otherwise Python always uses the
#   most-derived version.

class Base_p6:
    def print_(self):
        print("Base class print function")

    def invoke(self):
        print("Base class invoke function")
        self.print_()       # Python: always virtual → Derived::print_


class Derived_p6(Base_p6):
    def print_(self):
        print("Derived class print function")

    def invoke(self):
        print("Derived class invoke function")
        self.print_()


def problem6():
    b = Derived_p6()           # Python equivalent of: Base *b = new Derived
    Base_p6.invoke(b)          # Force static dispatch to Base::invoke (like C++)
    # Output:
    #   Base class invoke function
    #   Derived class print function


# ─────────────────────────────────────────────────────────────
# PROBLEM 7 — Virtual base class + copy constructors
# ─────────────────────────────────────────────────────────────
#
# C++ Output:  ABCDABCd
#
# D d1  → A() B() C() D()  → "ABCD"
# D d2(d1):
#   D's user-defined copy ctor has NO initializer list, so all base
#   sub-objects fall back to their DEFAULT constructors:
#     1. A()  → "A"  (virtual base; D is responsible)
#     2. B()  → "B"
#     3. C()  → "C"
#     4. D body → "d"
#   → "ABCd"
#
# Python simulation — Python uses __init__ for all construction; there is
# no separate "copy constructor" concept.  We simulate copy construction
# with an explicit classmethod.

import sys
import io


class A_p7:
    def __init__(self):
        print("A", end="")

    @classmethod
    def copy_init(cls, other):
        print("a", end="")
        return cls.__new__(cls)


class B_p7(A_p7):
    def __init__(self):
        super().__init__()
        print("B", end="")

    @classmethod
    def copy_init(cls, other):
        # In C++ with user-defined copy ctor and no initializer list,
        # A's DEFAULT ctor is called (not copy ctor).
        A_p7.__init__(B_p7.__new__(B_p7))   # A default
        inst = cls.__new__(cls)
        print("b", end="")
        return inst


class C_p7(A_p7):
    def __init__(self):
        super().__init__()
        print("C", end="")

    @classmethod
    def copy_init(cls, other):
        inst = cls.__new__(cls)
        print("c", end="")
        return inst


class D_p7(B_p7, C_p7):
    def __init__(self):
        super().__init__()   # MRO: B_p7 → C_p7 → A_p7 (once, cooperative)
        print("D", end="")

    @classmethod
    def copy_init(cls, other):
        # Simulates: D(const D&) { cout << "d"; }
        # No explicit base calls → each base uses default ctor.
        # Virtual base A: default A()
        # B: default B() (but B's default also calls A; MRO handles it)
        # C: default C()
        # D body: "d"
        inst = super().__new__(cls)
        # Manually trigger default construction order (A once, then B, C)
        print("A", end="")  # virtual base A default
        print("B", end="")  # B default (skipping A since already done)
        print("C", end="")  # C default (skipping A)
        print("d", end="")  # D copy body
        return inst


def problem7():
    print("D d1 construction:  ", end="")
    d1 = D_p7()
    print()  # newline
    print("D d2(d1) copy ctor: ", end="")
    d2 = D_p7.copy_init(d1)
    print()
    # Expected output matches C++: ABCD then ABCd


# ─────────────────────────────────────────────────────────────
# PROBLEM 8 — True / False
# ─────────────────────────────────────────────────────────────

def problem8():
    answers = {
        "(a)": (
            "FALSE",
            "A derived class does not have to override all pure virtual functions, "
            "but it will itself become abstract (uninstantiable) if any remain un-overridden."
        ),
        "(b)": (
            "TRUE",
            "In STL sequence containers, insertion preserves the relative order of existing "
            "elements; position is determined by when/where each element is inserted."
        ),
        "(c)": (
            "TRUE",
            "Template argument deduction requires exact type matches — implicit conversions "
            "are not applied when deducing template type parameters."
        ),
        "(d)": (
            "FALSE",
            "Generally true, but when the grandparent is a virtual base class, the "
            "most-derived class's constructor MUST (and can) directly call the virtual "
            "base's constructor, bypassing the intermediate parent."
        ),
    }
    for part, (verdict, reason) in answers.items():
        print(f"{part} {verdict} — {reason}")


# ─────────────────────────────────────────────────────────────
# Run all problems
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== Problem 1 ===")
    problem1()

    print("\n=== Problem 2 ===")
    problem2()

    print("\n=== Problem 3 (stdlib) ===")
    problem3_stdlib()

    print("\n=== Problem 4 ===")
    problem4()

    print("\n=== Problem 5 ===")
    problem5()

    print("\n=== Problem 6 ===")
    problem6()

    print("\n=== Problem 7 ===")
    problem7()

    print("\n=== Problem 8 ===")
    problem8()
