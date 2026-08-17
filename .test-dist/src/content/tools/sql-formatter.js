export const sqlFormatter = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: SQL Architecture & Injection (SQLi)

Welcome to the engineering guide to SQL (Structured Query Language). This handbook explains how databases parse your queries, and exposes the most famous and devastating vulnerability in internet history.

---

## 1. Prerequisites: The Abstract Syntax Tree (AST)

When you write a massive 500-line SQL query containing \`SELECT\`, \`JOIN\`, and \`GROUP BY\`, the database doesn't just read it like a book. 

Before execution, the database engine (like Postgres or MySQL) sends your string to a **Parser**. The parser breaks your string into tokens and builds an **Abstract Syntax Tree (AST)**. 
The database uses this tree to mathematically calculate the most efficient way to fetch your data (the Query Execution Plan).

When you use KaruviLab's SQL Formatter, we execute the exact same parsing logic. We don't just use Regex to add newlines; we build a virtual AST to ensure that nested \`SUBQUERIES\` are perfectly indented relative to their parent \`JOIN\` conditions.

---

## 2. Threat Model: The SQL Injection (SQLi) Catastrophe

Because SQL is executed as a dynamic string, it is vulnerable to the most infamous hack in computer science: **SQL Injection**.

### The Naive Developer (Vulnerable)
A junior developer writes backend code that takes user input directly and glues it into the SQL string:
\`\`\`javascript
const query = "SELECT * FROM users WHERE email = '" + userInput + "'";
db.execute(query);
\`\`\`

### The Attack ("Little Bobby Tables")
A hacker goes to your login form. Instead of typing an email, they type:
\`' OR 1=1; DROP TABLE users; --\`

The resulting string sent to the database becomes:
\`SELECT * FROM users WHERE email = '' OR 1=1; DROP TABLE users; --'\`

**What happens?**
1. The \`OR 1=1\` statement is mathematically true, so the database bypasses the email check and logs the hacker in as the first user (usually the Admin).
2. The \`;\` ends the first query.
3. The database immediately executes the second query: \`DROP TABLE users\`, permanently deleting your entire database.
4. The \`--\` comments out the rest of the original string to prevent syntax errors.

---

## 3. The Ultimate Defense: Parameterized Queries

How do professional engineers prevent SQL Injection? They **never** glue strings together. 
They use **Parameterized Queries** (Prepared Statements).

\`\`\`javascript
// The Professional Approach
const query = "SELECT * FROM users WHERE email = ?";
db.execute(query, [userInput]);
\`\`\`

**Why is this secure?**
When you use a prepared statement, the backend sends the SQL command to the database *first*, and the user's input *second*. 
The database compiles the AST using only the strict SQL command. When the user's input arrives, the database treats it strictly as a literal String value, not as executable code. Even if the user types \`DROP TABLE\`, the database just searches for an email address literally named "DROP TABLE".

---

## 4. Engineering Challenge: Dialects

Formatting SQL is complicated because SQL is not a single language. 
PostgreSQL, MySQL, SQLite, and Microsoft T-SQL all have unique proprietary syntax, functions, and quoting rules (e.g., MySQL uses backticks \` \` \` for columns, Postgres uses double quotes \`"\`). A professional formatter must support dialect-specific lexers to avoid breaking the query.

---

## 5. Production Workflows

- **Code Reviews / PRs:** Senior engineers refuse to review 200-character, single-line unformatted SQL strings. Formatting queries cleanly into logical blocks (\`SELECT\` at the top, \`WHERE\` filters indented) is a strict requirement for maintainable codebases.
- **ORM Debugging:** Frameworks like Prisma, Hibernate, or Django auto-generate massive, highly unreadable SQL queries behind the scenes. Developers copy the raw output from their terminal into a formatter to understand exactly what the ORM is doing.

---

## 6. Interactive Quiz

**Beginner:**
1. Does the database care if my query is formatted nicely? *(Answer: No. The database strips all whitespace when it compiles the AST. Formatting is strictly for human readability and code maintenance).*

**Intermediate:**
2. What is a SQL Injection attack? *(Answer: It is an attack where a hacker submits malicious SQL code into an input field (like a login box). If the backend naively glues the input into the query string, the database executes the hacker's commands).*

**Advanced:**
3. How do Parameterized Queries prevent SQL Injection? *(Answer: They separate the SQL logic from the user data. The database compiles the execution tree first, ensuring that any subsequent user data is treated strictly as a literal string value, not executable syntax).*

---

`,
    howTo: [
        "**Step 1:** Paste your messy, unformatted, or ORM-generated SQL query.",
        "**Step 2:** Select the specific Database Dialect (PostgreSQL, MySQL, standard SQL) to ensure accurate keyword highlighting.",
        "**Step 3:** Click Format.",
        "**Step 4:** The tool parses the query and returns a perfectly indented, uppercase-keyword standardized SQL block ready for your codebase."
    ],
    faq: [
        {
            question: "Will formatting change the logic of my query?",
            answer: "No. The formatter only injects whitespace and standardizes the casing of reserved keywords (like SELECT or WHERE). The actual mathematical logic and table names are untouched."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["JSON Formatter", "XML Formatter"]
};
