import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = 3001;

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

// Get all blogs
app.get("/blogs", (req: Request, res: Response) => {
  res.json(blogs);
});

// Create a new blog
app.post("/blogs", (req: Request, res: Response) => {
  const newBlog: Blog = {
    id: Date.now().toString(),
    title: req.body.title,
    body: req.body.body,
  };

  blogs.push(newBlog);

  res.status(201).json(newBlog);
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
