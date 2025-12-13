# Internship Evaluation – Practical Exam

Instructions:
1. Write solution inside src folder
2. Use any one language: C / C++ / Java / Python
3. Add comment block with Name, Enrollment, Logic
4. Push final code before time ends


# Internship Evaluation – Library Management System (2025–2026)

## Objective
Design and develop a console-based **Library Management System** that allows a librarian
to manage book records efficiently.

This problem statement is **language-independent** and can be implemented using:
- C
- C++
- Java
- Python

The objective is to evaluate core programming concepts such as control structures,
functions/methods, searching, sorting, logical deletion, authentication, and file handling.

---

## Mandatory Authentication Requirement

1. The system must ask for a **username and password** at startup.
2. Maximum **three login attempts** are allowed.
3. If valid credentials are entered, access is granted.
4. After three failed attempts, the program must terminate automatically.

### Sample Login Output

Attempt 1:
Username: admin  
Password: 111  
Output: Invalid credentials. Attempts left: 2

Attempt 2:
Username: admin  
Password: 222  
Output: Invalid credentials. Attempts left: 1

Attempt 3:
Username: admin  
Password: 123  
Output: Login successful.

After 3 failed attempts:
Output: Too many failed login attempts. Program terminated.

---

## Functional Requirements

### 1. Add Book
- Add new book details:
  - Book ID
  - Title
  - Author
  - Quantity
  - Price
- Duplicate Book IDs must **not** be allowed.

---

### 2. Display All Books
- Display **only active books**
- Provide sorting options:
  1. Sort by Book ID
  2. Sort by Book Title

---

### 3. Search Book
Search a book only if it is **active**.

Use **nested switch** logic:

1 → Search by Book ID  
2 → Search by Book Title  

---

### 4. Issue Book
- Issue a book only if quantity is available
- Reduce the quantity after issuing

---

### 5. Return Book
- Increase the quantity of the returned book

---

### 6. Delete Book (Logical Deletion)
Delete a book **logically**, not physically.

Use an **active flag** to mark the book as inactive.

Use **nested switch** logic:

1 → Delete by Book ID  
2 → Delete by Book Title  

---

### 7. Exit
- Safely terminate the program

---

## Sample Menu

===== LIBRARY MANAGEMENT SYSTEM =====  
1. Add Book  
2. Display All Books  
3. Search Book  
4. Issue Book  
5. Return Book  
6. Delete Book  
7. Exit  

---

## Implementation Notes (Important)

- The mentioned data structures, classes, and logic are **guidelines only**
- Students are free to use **any valid approach**
- Any solution that fulfills all functional requirements correctly will be accepted

---

## Technical Rules

- Console-based application only
- No external frameworks
- Proper use of:
  - Functions / Methods
  - Classes / Structures
- Clean, readable, and modular code
- File handling must be used for data persistence

---

## Concepts Expected to be Used

- Structure / Class
- Arrays / Dynamic Arrays / Lists
- Functions / Methods
- Conditional statements (if, else, switch)
- Looping (for, while, do-while)
- String handling
- Linear search
- Sorting (Bubble sort or built-in)
- Logical deletion (active flag)
- Menu-driven programming
- User authentication
- Encapsulation (for OOP languages)
- File I/O

---

## Submission Instructions

1. Accept the GitHub Classroom assignment link
2. Clone your private repository
3. Implement the solution
4. Commit and push **only final working code**
5. Late commits will not be considered

---

## Evaluation Criteria

- Correct implementation of all requirements
- Proper authentication logic
- File handling usage
- Code clarity and structure
- Successful execution

---

## Important Rules

- Plagiarism will lead to disqualification
- Each student has an individual private repository
- Follow exam discipline strictly

---



Internship Evaluation – Practical Exam
GitHub Submission Instructions (Read Carefully)
## Step 1: Create Your Repository
Open the following link:
https://github.com/Internship-Eval-2025-2026/Internship-Eval-2025/generate
Click Create a new repository
Repository name format:
EnrollmentNo_FullName
(Example: 21CE045_RahulPatel)
Owner must be your own GitHub account
Set repository visibility to Private
Click Create repository

## Step 2: Write Your Solution
Open your newly created repository
Go to the src folder
Write your solution code ONLY inside the src folder
Use any ONE language only:
C
C++
Java
Python

## Step 3: Mandatory Comment Block
At the top of your code file, add the following comment:
Name:
Enrollment No:
Language Used:
Logic:

(Logic must briefly explain your approach)

## Step 4: Final Submission Rules
Push (commit) your final working code before time ends
Do NOT push code after time is over
Do NOT change repository name after creation
Do NOT copy code from others (plagiarism = disqualification)

## Step 5: Submit Repository Link
Submit your repository link as instructed by the examiner
Example format:
https://github.com/your-username/EnrollmentNo_Name


## Important Notes

Only code inside the src folder will be evaluated
Multiple languages in one repository are NOT allowed
Late commits will not be considered
Evaluation will be based on:
Correctness
Logic
Code quality
Folder structure

One-Line Reminder for Students
Create your own repository using the template → write code inside src → commit before time ends → submit repo link.




**Best of luck.**
