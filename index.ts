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

app.use(express.json());

interface Blog {
  id: string;
  title: string;
  body: string;
}

const sampleBlogs: Blog[] = [
  {
    id: "sample1",
    title: "Sample Blog Title 1",
    body: "This is a sample blog body 1.",
  },
  {
    id: "sample2",
    title: "Sample Blog Title 2",
    body: "This is a sample blog body 2.",
  },
];

let blogs: Blog[] = sampleBlogs;

const connectToDatabase = () => {
  connection.connect((error) => {
    if (error) {
      console.error("error connecting to MySQL: ", error);
      return;
    }

    console.log("success connecting to MySQL");
  });
};

// Get all blogs
app.get("/blogs", (req: Request, res: Response) => {
  const query = "SELECT * FROM blogs";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("error select blogs:", error);
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
        console.error("error insert blogs:", error);
        res.status(500).json(error);
        return;
      }
      res.status(201).json({ message: "Blog created successfully" });
    }
  );
});

// Update a blog
app.put("/blogs/:id", (req: Request, res: Response) => {
  if (!blogs.find((blog) => blog.id === req.params.id)) {
    return res.status(404).json({ error: "Blog Not  Found" });
  }

  const updatedBlog = {
    id: req.params.id,
    title: req.body.title,
    body: req.body.body,
  };

  res.status(200).json(updatedBlog);
});

// Delete a blog
app.delete("/blogs/:id", (req: Request, res: Response) => {
  if (!blogs.find((blog) => blog.id === req.params.id)) {
    return res.status(404).json({ error: "Blog Not  Found" });
  }

  const remainedBlogs = blogs.filter((blog) => blog.id !== req.params.id);

  res.json(remainedBlogs);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
