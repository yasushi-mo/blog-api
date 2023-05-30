import express, { Application, Request, Response } from "express";
import mysql from "mysql2";

const app: Application = express();
const port = 3001;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "blog_app",
});

const connectToDatabase = () => {
  connection.connect((error) => {
    if (error) {
      console.error("Error connecting to MySQL: ", error);
      return;
    }

    console.log("Success connecting to MySQL");
  });
};

app.use(express.json());

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Get all blogs
app.get("/blogs", (req: Request, res: Response) => {
  const query = "SELECT * FROM blogs";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error select values:", error);
      res.status(500).json(error);
      return;
    }
    res.status(200).json(results);
  });
});

// Create a new blog
app.post("/blogs", (req: Request, res: Response) => {
  connectToDatabase();

  const query = "INSERT INTO blogs (title, body) VALUES (?, ?)";
  connection.query(
    query,
    [`${req.body.title}`, `${req.body.body}`],
    (error, results) => {
      if (error) {
        console.error("Error insert values:", error);
        res.status(500).json(error);
        return;
      }
      res.status(201).json({ message: "Blog created successfully" });
    }
  );
});

// Update a blog
app.put("/blogs/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, body } = req.body;

  const checkQuery = "SELECT * FROM blogs WHERE id = ?";
  connection.query(checkQuery, [id], (error, results) => {
    if (error) {
      console.error("Error checking ID existence:", error);
      res.status(500).json(error);
      return;
    }

    const isExists = Array.isArray(results) && results.length > 0;
    if (!isExists) {
      console.log("Blog ID not found");
      res.status(404).json({ message: "Blog ID not found" });
      return;
    }

    const updateQuery = "UPDATE blogs SET title = ?, body = ? WHERE id = ?";
    connection.query(updateQuery, [title, body, id], (error, results) => {
      if (error) {
        console.error("Error update values:", error);
        res.status(500).json(error);
        return;
      }

      res.status(200).json({ message: "Blog updated successfully" });
    });
  });
});

// Delete a blog
app.delete("/blogs/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const checkQuery = "SELECT * FROM blogs WHERE id = ?";
  connection.query(checkQuery, [id], (error, results) => {
    if (error) {
      console.error("Error checking ID existence:", error);
      res.status(500).json(error);
      return;
    }

    const isExists = Array.isArray(results) && results.length > 0;
    if (!isExists) {
      console.log("Blog ID not found");
      res.status(404).json({ message: "Blog ID not found" });
      return;
    }

    const deleteQuery = "DELETE FROM blogs WHERE id = ?";
    connection.query(deleteQuery, [id], (error, results) => {
      if (error) {
        console.error("Error update values:", error);
        res.status(500).json(error);
        return;
      }

      res.status(200).json({ message: "Blog deleted successfully" });
    });
  });
});
