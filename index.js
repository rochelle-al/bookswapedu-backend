import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "test"
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello, this is the backend" });
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Book has been created successfully." });
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Book has been deleted successfully." });
    });
});

app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
        bookId,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Book has been updated successfully." });
    });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
