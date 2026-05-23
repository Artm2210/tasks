import express from "express";

interface Book {
    isbn: string;
    name: string;
    author: string;
    pages: number;
    year: number;
    addedOn: string;
    deleted?: boolean;
}

const books: Record<string, Book> = {};

const sampleBooks: Omit<Book, "addedOn">[] = [
    { isbn: "978-5-699-12011-6", name: "Война и мир", author: "Лев Толстой", pages: 1300, year: 1869 },
    { isbn: "978-5-17-118903-7", name: "Преступление и наказание", author: "Федор Достоевский", pages: 672, year: 1866 },
    { isbn: "978-5-389-15744-4", name: "Мастер и Маргарита", author: "Михаил Булгаков", pages: 480, year: 1967 },
];

sampleBooks.forEach(book => {
    books[book.isbn] = { ...book, addedOn: new Date().toISOString() };
});

export function createApp() {
    const app = express();
    
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        
        if (_req.method === "OPTIONS") {
            res.sendStatus(200);
            return;
        }
        next();
    });
    
    app.use(express.json());

    app.get("/api/books", (req, res) => {
        const page = parseInt(req.query.page as string) || 1;
        const take = parseInt(req.query.take as string) || 10;
        const sort = (req.query.sort as string) || "addedOn";
        const filter = ((req.query.filter as string) || "").toLowerCase();
        
        let items = Object.values(books).filter(b => !b.deleted);
        
        if (filter) {
            items = items.filter(b => 
                b.name.toLowerCase().includes(filter) || 
                b.author.toLowerCase().includes(filter) ||
                b.isbn.toLowerCase().includes(filter)
            );
        }
        
        const reverse = sort.startsWith("-");
        const sortField = reverse ? sort.slice(1) : sort;
        items.sort((a, b) => {
            const aVal = a[sortField as keyof Book];
            const bVal = b[sortField as keyof Book];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return reverse ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return reverse ? bVal - aVal : aVal - bVal;
            }
            return 0;
        });
        
        const total = items.length;
        const start = (page - 1) * take;
        const data = items.slice(start, start + take);
        
        res.json({
            data,
            total,
            page,
            take,
            total_pages: Math.ceil(total / take)
        });
    });

    app.post("/api/books", (req, res) => {
        const { isbn, name, author, pages, year } = req.body;
        
        if (!isbn || !name || !author) {
            res.status(400).json({ type: "ValidationError", message: "ISBN, name and author are required" });
            return;
        }
        
        if (books[isbn] && !books[isbn].deleted) {
            res.status(400).json({ type: "ValidationError", message: "Book already exists" });
            return;
        }
        
        const book: Book = {
            isbn,
            name,
            author,
            pages: parseInt(pages) || 0,
            year: parseInt(year) || 0,
            addedOn: new Date().toISOString()
        };
        
        books[isbn] = book;
        res.status(201).json(book);
    });

    app.get("/api/books/:isbn", (req, res) => {
        const book = books[req.params.isbn];
        
        if (!book || book.deleted) {
            res.status(404).json({ type: "NotFound", message: "Book not found" });
            return;
        }
        
        res.json(book);
    });

    app.patch("/api/books/:isbn", (req, res) => {
        const book = books[req.params.isbn];
        
        if (!book || book.deleted) {
            res.status(404).json({ type: "NotFound", message: "Book not found" });
            return;
        }
        
        const { name, author, pages, year } = req.body;
        if (name) book.name = name;
        if (author) book.author = author;
        if (pages) book.pages = parseInt(pages);
        if (year) book.year = parseInt(year);
        
        res.json(book);
    });

    app.delete("/api/books/:isbn", (req, res) => {
        const book = books[req.params.isbn];
        
        if (!book || book.deleted) {
            res.status(404).json({ type: "NotFound", message: "Book not found" });
            return;
        }
        
        book.deleted = true;
        res.json({ message: "Book deleted successfully" });
    });

    app.get("/api/books/:isbn/status", (req, res) => {
        const book = books[req.params.isbn];
        
        if (!book || book.deleted) {
            res.status(404).json({ type: "NotFound", message: "Book not found" });
            return;
        }
        
        res.json({
            total: 1,
            available: 1,
            popularity: 0
        });
    });

    return app;
}