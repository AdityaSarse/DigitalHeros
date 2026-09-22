import "dotenv/config";
import app from "./app.js";

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Digital Heroes API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
