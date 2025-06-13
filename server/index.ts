import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/hola", (req, res) => {
  console.log("hola amigo");
  res.send("hola");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
