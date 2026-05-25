"""
app/data/mock.py
────────────────
All mock data for the API.

Think of this as a fake database.
In a real app, you'd replace these with database queries.

Data shape is designed to match the Next.js frontend exactly.
"""

from app.utils.helpers import minutes_ago, days_from_now

# ── Users ──────────────────────────────────────────────────────────────────

MOCK_USERS: list[dict] = [
    {
        "id": "u_01",
        "name": "Alex Rivera",
        "email": "alex@student.edu",
        "password": "password123",   # Never store plain passwords in real apps!
        "level": 14,
        "xp": 3240,
        "xp_to_next_level": 5000,
        "streak": 12,
        "total_study_minutes": 2860,
        "subjects": ["Mathematics", "Physics", "Computer Science", "Chemistry"],
        "joined_at": "2024-01-15T00:00:00Z",
    },
    {
        "id": "u_02",
        "name": "Sam Chen",
        "email": "sam@student.edu",
        "password": "password123",
        "level": 8,
        "xp": 1540,
        "xp_to_next_level": 2000,
        "streak": 4,
        "total_study_minutes": 1120,
        "subjects": ["Biology", "Chemistry"],
        "joined_at": "2024-03-10T00:00:00Z",
    },
]

# ── Analytics summary ────────────────────────────────────────────────────────
# Matches the AnalyticsSummary schema used by GET /analytics.

MOCK_STATS: dict = {
    "total_study_hours": 47.7,   # user.total_study_minutes (2860) / 60
    "total_xp": 3240,
    "quizzes_completed": 51,     # sum across all subjects
    "average_quiz_score": 87,
    "current_streak": 12,
}

# ── Weekly study data ────────────────────────────────────────────────────────

MOCK_WEEKLY: list[dict] = [
    {"day": "Mon", "study_minutes": 45,  "xp": 320, "quizzes_taken": 2},
    {"day": "Tue", "study_minutes": 90,  "xp": 580, "quizzes_taken": 4},
    {"day": "Wed", "study_minutes": 60,  "xp": 410, "quizzes_taken": 3},
    {"day": "Thu", "study_minutes": 125, "xp": 760, "quizzes_taken": 5},
    {"day": "Fri", "study_minutes": 75,  "xp": 490, "quizzes_taken": 3},
    {"day": "Sat", "study_minutes": 155, "xp": 930, "quizzes_taken": 6},
    {"day": "Sun", "study_minutes": 35,  "xp": 210, "quizzes_taken": 1},
]

# ── Subject mastery stats ────────────────────────────────────────────────────

MOCK_SUBJECT_STATS: list[dict] = [
    {"subject": "Mathematics",      "mastery_pct": 72, "study_minutes": 840, "quizzes_completed": 14, "color_hex": "#7c3aed"},
    {"subject": "Physics",          "mastery_pct": 58, "study_minutes": 620, "quizzes_completed": 11, "color_hex": "#2563eb"},
    {"subject": "Computer Science", "mastery_pct": 84, "study_minutes": 960, "quizzes_completed": 18, "color_hex": "#4f46e5"},
    {"subject": "Chemistry",        "mastery_pct": 45, "study_minutes": 480, "quizzes_completed":  8, "color_hex": "#0891b2"},
]

# ── Activity feed ────────────────────────────────────────────────────────────

MOCK_ACTIVITY: list[dict] = [
    {"id": "a1", "type": "quiz",        "title": "Calculus Derivatives",     "subtitle": "Scored 92% · 15 questions",   "xp_gained": 180, "score": 92, "created_at": minutes_ago(28)},
    {"id": "a2", "type": "flashcard",   "title": "Quantum Mechanics Deck",   "subtitle": "Reviewed 24 cards",           "xp_gained": 120,             "created_at": minutes_ago(110)},
    {"id": "a3", "type": "achievement", "title": "7-Day Streak Unlocked",    "subtitle": "Badge: Consistency Champion", "xp_gained": 250,             "created_at": minutes_ago(290)},
    {"id": "a4", "type": "study",       "title": "Organic Chemistry Notes",  "subtitle": "Session · 45 minutes",       "xp_gained": 90,              "created_at": minutes_ago(1450)},
    {"id": "a5", "type": "quiz",        "title": "Newton's Laws",            "subtitle": "Scored 78% · 10 questions",  "xp_gained": 140, "score": 78, "created_at": minutes_ago(1550)},
    {"id": "a6", "type": "flashcard",   "title": "Linear Algebra Deck",      "subtitle": "Reviewed 18 cards",          "xp_gained": 90,              "created_at": minutes_ago(2900)},
]

# ── AI suggestions ───────────────────────────────────────────────────────────

MOCK_SUGGESTIONS: list[dict] = [
    {
        "id": "s1", "title": "Integration Techniques",
        "rationale": "You scored 62% on u-substitution last session. A focused drill will close that gap.",
        "subject": "Mathematics", "difficulty": "medium", "estimated_minutes": 25,
        "action_type": "quiz", "match_pct": 94,
    },
    {
        "id": "s2", "title": "Thermodynamics Flashcards",
        "rationale": "Spaced repetition shows 16 cards are due today for optimal retention.",
        "subject": "Physics", "difficulty": "hard", "estimated_minutes": 15,
        "action_type": "flashcard", "match_pct": 89,
    },
    {
        "id": "s3", "title": "Recursion & Tree Traversal",
        "rationale": "Data structures score can jump 12+ points with this 30-min session.",
        "subject": "Computer Science", "difficulty": "medium", "estimated_minutes": 30,
        "action_type": "study", "match_pct": 87,
    },
    {
        "id": "s4", "title": "Periodic Table Trends",
        "rationale": "Quick 10-min drill on electronegativity before tomorrow's test.",
        "subject": "Chemistry", "difficulty": "easy", "estimated_minutes": 10,
        "action_type": "quiz", "match_pct": 91,
    },
]

# ── Flashcard decks ──────────────────────────────────────────────────────────

MOCK_DECKS: list[dict] = [
    {"id": "d1", "title": "Calculus Fundamentals",  "subject": "Mathematics",     "card_count": 48, "mastery_pct": 72, "last_studied_at": minutes_ago(60),    "color_hex": "#7c3aed"},
    {"id": "d2", "title": "Quantum Mechanics",       "subject": "Physics",         "card_count": 36, "mastery_pct": 58, "last_studied_at": minutes_ago(120),   "color_hex": "#2563eb"},
    {"id": "d3", "title": "Organic Reactions",       "subject": "Chemistry",       "card_count": 62, "mastery_pct": 45, "last_studied_at": minutes_ago(1440),  "color_hex": "#0891b2"},
    {"id": "d4", "title": "Data Structures",         "subject": "Computer Science","card_count": 41, "mastery_pct": 81, "last_studied_at": minutes_ago(2880),  "color_hex": "#4f46e5"},
    {"id": "d5", "title": "Electromagnetic Fields",  "subject": "Physics",         "card_count": 29, "mastery_pct": 33, "last_studied_at": None,               "color_hex": "#d97706"},
    {"id": "d6", "title": "Linear Algebra",          "subject": "Mathematics",     "card_count": 55, "mastery_pct": 67, "last_studied_at": minutes_ago(4320),  "color_hex": "#db2777"},
]

# ── Flashcards per deck ──────────────────────────────────────────────────────

MOCK_CARDS: dict[str, list[dict]] = {
    "d1": [
        {"id": "c1_1", "deck_id": "d1", "front": "Derivative of sin(x)?",        "back": "cos(x) — proven via limit definition.", "mastery_pct": 90, "difficulty": "easy"},
        {"id": "c1_2", "deck_id": "d1", "front": "Power rule: d/dx[xⁿ]?",        "back": "n·xⁿ⁻¹ — example: d/dx[x³] = 3x².",   "mastery_pct": 85, "difficulty": "easy"},
        {"id": "c1_3", "deck_id": "d1", "front": "Integration by parts formula?","back": "∫u dv = uv − ∫v du (use LIATE rule).",   "mastery_pct": 70, "difficulty": "medium"},
        {"id": "c1_4", "deck_id": "d1", "front": "Chain rule?",                   "back": "d/dx[f(g(x))] = f′(g(x)) · g′(x).",    "mastery_pct": 65, "difficulty": "medium"},
    ],
    "d2": [
        {"id": "c2_1", "deck_id": "d2", "front": "Heisenberg Uncertainty Principle?", "back": "Δx·Δp ≥ ℏ/2 — position & momentum can't both be precise.", "mastery_pct": 45, "difficulty": "hard"},
        {"id": "c2_2", "deck_id": "d2", "front": "Wave-particle duality?",            "back": "Quantum objects show wave AND particle behavior depending on observation.", "mastery_pct": 60, "difficulty": "medium"},
        {"id": "c2_3", "deck_id": "d2", "front": "Schrödinger Equation?",             "back": "iℏ ∂ψ/∂t = Ĥψ — describes quantum state evolution over time.", "mastery_pct": 35, "difficulty": "hard"},
    ],
    "d4": [
        {"id": "c4_1", "deck_id": "d4", "front": "Binary search complexity?",      "back": "O(log n) — halves search space each step. Requires sorted data.", "mastery_pct": 90, "difficulty": "easy"},
        {"id": "c4_2", "deck_id": "d4", "front": "Stack vs Queue?",                "back": "Stack = LIFO (last in, first out). Queue = FIFO (first in, first out).", "mastery_pct": 80, "difficulty": "easy"},
        {"id": "c4_3", "deck_id": "d4", "front": "QuickSort worst case?",          "back": "O(n²) when pivot is always min/max. Average case: O(n log n).", "mastery_pct": 70, "difficulty": "medium"},
        {"id": "c4_4", "deck_id": "d4", "front": "Dynamic programming definition?","back": "Solve problems by breaking into overlapping subproblems + caching (memoization).", "mastery_pct": 60, "difficulty": "hard"},
    ],
}

# Default cards for decks that don't have specific cards
MOCK_CARDS_DEFAULT: list[dict] = [
    {"id": "cd_1", "deck_id": "default", "front": "What is spaced repetition?",  "back": "A learning technique that spaces review sessions over increasing intervals to boost long-term memory.", "mastery_pct": 50, "difficulty": "easy"},
    {"id": "cd_2", "deck_id": "default", "front": "What is active recall?",      "back": "Testing yourself on material rather than re-reading it — proven to be far more effective.", "mastery_pct": 50, "difficulty": "easy"},
]

# ── Quizzes ──────────────────────────────────────────────────────────────────

MOCK_QUIZZES: list[dict] = [
    {"id": "q1", "title": "Calculus Derivatives & Integrals", "subject": "Mathematics",     "question_count": 5, "duration_minutes": 10, "difficulty": "medium", "completed_at": minutes_ago(60),    "score": 87, "tags": ["calculus", "derivatives"]},
    {"id": "q2", "title": "Quantum Mechanics Fundamentals",   "subject": "Physics",         "question_count": 5, "duration_minutes": 10, "difficulty": "hard",   "completed_at": None,               "score": None,"tags": ["quantum", "wave function"]},
    {"id": "q3", "title": "Big-O Complexity Analysis",        "subject": "Computer Science","question_count": 5, "duration_minutes": 8,  "difficulty": "medium", "completed_at": minutes_ago(2880),  "score": 70, "tags": ["algorithms", "complexity"]},
    {"id": "q4", "title": "Organic Chemistry Reactions",      "subject": "Chemistry",       "question_count": 5, "duration_minutes": 12, "difficulty": "hard",   "completed_at": None,               "score": None,"tags": ["organic", "mechanisms"]},
    {"id": "q5", "title": "Newton's Laws & Kinematics",       "subject": "Physics",         "question_count": 5, "duration_minutes": 8,  "difficulty": "easy",   "completed_at": minutes_ago(4320),  "score": 100,"tags": ["mechanics", "forces"]},
]

# ── Quiz questions per quiz ──────────────────────────────────────────────────

MOCK_QUESTIONS: dict[str, list[dict]] = {
    "q1": [  # Calculus
        {"id": "q1_1", "question": "What is ∫2x dx?",               "options": ["x²","x² + C","2x²","2x² + C"],                  "answer": 1, "explanation": "Power rule: ∫2x dx = x² + C."},
        {"id": "q1_2", "question": "Derivative of sin(x)?",         "options": ["cos(x)","-cos(x)","sin(x)","-sin(x)"],            "answer": 0, "explanation": "d/dx[sin(x)] = cos(x)."},
        {"id": "q1_3", "question": "Chain rule: d/dx[f(g(x))] = ?", "options": ["f′·g","f′(g)·g′","f·g′","f(g′)"],               "answer": 1, "explanation": "Chain rule: f′(g(x)) · g′(x)."},
        {"id": "q1_4", "question": "If f(x) = x³, f′(x) = ?",      "options": ["x²","3x","3x²","x⁴/4"],                          "answer": 2, "explanation": "Power rule: d/dx[xⁿ] = n·xⁿ⁻¹, so 3x²."},
        {"id": "q1_5", "question": "lim(x→0) sin(x)/x = ?",        "options": ["0","∞","1","undefined"],                          "answer": 2, "explanation": "Famous limit = 1 (L'Hôpital or squeeze theorem)."},
    ],
    "q2": [  # Quantum Mechanics
        {"id": "q2_1", "question": "Heisenberg's principle involves:", "options": ["Energy & time","Position & momentum","Mass & velocity","Charge & field"], "answer": 1, "explanation": "Δx·Δp ≥ ℏ/2."},
        {"id": "q2_2", "question": "The Schrödinger equation describes:", "options": ["Gravity","Quantum state evolution","Chemical bonds","Nuclear decay"], "answer": 1, "explanation": "iℏ ∂ψ/∂t = Ĥψ describes how quantum states change over time."},
        {"id": "q2_3", "question": "Wave-particle duality was shown by:", "options": ["Newton","Einstein","de Broglie","Faraday"], "answer": 2, "explanation": "Louis de Broglie proposed matter has wave properties (λ = h/p)."},
        {"id": "q2_4", "question": "Quantum entanglement means:", "options": ["Particles collide","States are correlated regardless of distance","Energy is quantised","Waves interfere"], "answer": 1, "explanation": "Entangled particles have correlated states even when separated."},
        {"id": "q2_5", "question": "Planck's constant h ≈", "options": ["6.63×10⁻³⁴ J·s","9.11×10⁻³¹ kg","1.6×10⁻¹⁹ C","3×10⁸ m/s"], "answer": 0, "explanation": "h ≈ 6.626×10⁻³⁴ J·s — fundamental quantum of action."},
    ],
    "q3": [  # Computer Science
        {"id": "q3_1", "question": "O(1) means:", "options": ["One step","Constant time","One second","One iteration"], "answer": 1, "explanation": "O(1) = constant time regardless of input size."},
        {"id": "q3_2", "question": "Binary search requires data to be:", "options": ["Random","Sorted","Linked","Hashed"], "answer": 1, "explanation": "Must be sorted to split the search space in half."},
        {"id": "q3_3", "question": "QuickSort worst case?", "options": ["O(n)","O(n log n)","O(n²)","O(log n)"], "answer": 2, "explanation": "O(n²) when pivot is always the smallest or largest element."},
        {"id": "q3_4", "question": "LIFO describes:", "options": ["Queue","Tree","Stack","Graph"], "answer": 2, "explanation": "Stack uses Last In, First Out ordering."},
        {"id": "q3_5", "question": "DFS stands for:", "options": ["Data Flow Scan","Depth-First Search","Direct File System","Dynamic Function Set"], "answer": 1, "explanation": "Depth-First Search — explores as far as possible before backtracking."},
    ],
    "q4": [  # Chemistry
        {"id": "q4_1", "question": "Ideal Gas Law?", "options": ["PV=nRT","E=mc²","F=ma","H=U+PV"], "answer": 0, "explanation": "PV = nRT: Pressure × Volume = moles × R × Temperature."},
        {"id": "q4_2", "question": "Atomic number = ?", "options": ["Neutrons","Protons","Protons+neutrons","Electrons"], "answer": 1, "explanation": "Atomic number = number of protons, defining the element."},
        {"id": "q4_3", "question": "pH of pure water?", "options": ["0","7","14","1"], "answer": 1, "explanation": "Pure water has pH = 7 — the neutral point of the scale."},
        {"id": "q4_4", "question": "Covalent bond involves:", "options": ["Electron transfer","Electron sharing","Proton transfer","Neutron sharing"], "answer": 1, "explanation": "Covalent bonds form by sharing electron pairs."},
        {"id": "q4_5", "question": "Avogadro's number ≈", "options": ["6.02×10²³","6.02×10¹⁶","3.14×10²³","1.38×10²³"], "answer": 0, "explanation": "6.022×10²³ particles per mole."},
    ],
    "q5": [  # Physics — Newton
        {"id": "q5_1", "question": "Newton's Second Law:", "options": ["F=mv","F=ma","E=mc²","p=mv"], "answer": 1, "explanation": "F = ma: Force = mass × acceleration."},
        {"id": "q5_2", "question": "SI unit of force?", "options": ["Joule","Watt","Newton","Pascal"], "answer": 2, "explanation": "Force is measured in Newtons (N = kg·m/s²)."},
        {"id": "q5_3", "question": "Kinetic energy formula?", "options": ["mgh","½mv²","Fd","mv"], "answer": 1, "explanation": "KE = ½mv² where m = mass, v = velocity."},
        {"id": "q5_4", "question": "Newton's Third Law:", "options": ["F=ma","Every action has equal/opposite reaction","Objects at rest stay at rest","E=mc²"], "answer": 1, "explanation": "For every action, there is an equal and opposite reaction."},
        {"id": "q5_5", "question": "Speed of light ≈", "options": ["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10¹² m/s"], "answer": 1, "explanation": "c ≈ 3×10⁸ m/s in vacuum."},
    ],
}

# ── Planner tasks ────────────────────────────────────────────────────────────

MOCK_TASKS: list[dict] = [
    {"id": "t1", "title": "Review Integration Techniques",    "subject": "Mathematics",     "type": "study",     "priority": "high",   "due_at": days_from_now(1), "estimated_minutes": 45, "completed": False},
    {"id": "t2", "title": "Quantum Mechanics Flashcards",     "subject": "Physics",         "type": "flashcard", "priority": "medium", "due_at": days_from_now(1), "estimated_minutes": 20, "completed": False},
    {"id": "t3", "title": "Big-O Notation Quiz",              "subject": "Computer Science","type": "quiz",      "priority": "medium", "due_at": days_from_now(2), "estimated_minutes": 15, "completed": True},
    {"id": "t4", "title": "Organic Reactions Revision",       "subject": "Chemistry",       "type": "revision",  "priority": "high",   "due_at": days_from_now(3), "estimated_minutes": 60, "completed": False},
    {"id": "t5", "title": "Linear Algebra Problem Set",       "subject": "Mathematics",     "type": "study",     "priority": "low",    "due_at": days_from_now(4), "estimated_minutes": 90, "completed": False},
    {"id": "t6", "title": "Thermodynamics Study Session",     "subject": "Physics",         "type": "study",     "priority": "medium", "due_at": days_from_now(5), "estimated_minutes": 30, "completed": False},
]

# ── AI study session mock content ────────────────────────────────────────────
# Used by /study/generate to return pre-built content (simulating AI output).

STUDY_NOTES_TEMPLATE: dict = {
    "sections": [
        {
            "heading": "Core Concept",
            "body": "Integration by parts rewrites the integral of a product: ∫u dv = uv − ∫v du. Use the LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) to choose u.",
        },
        {
            "heading": "Worked Example",
            "body": "To evaluate ∫x·eˣ dx: let u=x and dv=eˣdx. Then du=dx and v=eˣ. Result: xeˣ − ∫eˣdx = xeˣ − eˣ + C.",
        },
        {
            "heading": "Key Tips",
            "body": "① Use LIATE to pick u. ② For cyclic integrals (trig × exponential), apply IBP twice then solve algebraically. ③ Always add the constant C.",
        },
    ],
    "key_takeaways": ["LIATE selection rule", "∫u dv = uv − ∫v du", "Cyclic integrals", "Constant of integration C"],
    "xp_reward": 120,
}

STUDY_QUIZ_TEMPLATE: list[dict] = [
    {"question": "What does 'A' in LIATE stand for?",       "options": ["Advanced","Algebraic","Antiderivative","Asymptotic"], "answer": 1, "explanation": "LIATE: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential."},
    {"question": "Evaluate ∫x·eˣ dx",                       "options": ["eˣ + C","xeˣ + C","xeˣ − eˣ + C","x²eˣ + C"],    "answer": 2, "explanation": "IBP with u=x, dv=eˣdx: xeˣ − eˣ + C."},
    {"question": "Best choice of u for ∫ln(x) dx?",         "options": ["u=x","u=ln(x)","u=1/x","u=xln(x)"],               "answer": 1, "explanation": "ln(x) is 'L' in LIATE — highest priority choice for u."},
]

STUDY_CARDS_TEMPLATE: list[dict] = [
    {"front": "Integration by Parts formula?",         "back": "∫u dv = uv − ∫v du\n\nUse LIATE to choose u."},
    {"front": "What does LIATE stand for?",            "back": "Logarithmic → Inverse trig → Algebraic → Trigonometric → Exponential"},
    {"front": "Evaluate ∫x·eˣ dx",                    "back": "= xeˣ − eˣ + C\n\nLet u=x, dv=eˣdx and apply the formula."},
    {"front": "When does IBP give a cyclic integral?", "back": "When integrating trig × exponential.\n\nApply IBP twice, then solve algebraically."},
]
