const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { dbConnection } = require("./database");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const db = await dbConnection();
    const collection = db.collection("details");
    const newuser = { name, username, email, phone, password };
    const result = await collection.insertOne(newuser);
    res.sendFile(path.join(__dirname, "public", "success.html"));
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send("Error submitting form data");
  }
});
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  console.log("SignIn data received:", req.body);
  try {
    const db = await dbConnection();
    const collection = db.collection("details");
    const user = await collection.findOne({ username, password });

    console.log(user);
    if (user) {
      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Sign In Success</title>
              <style>
                  body {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f9;
                  }
                  h1 {
                      color: #4caf50;
                  }
                  p {
                      font-size: 16px;
                      color: #333;
                  }
                  a {
                      text-decoration: none;
                      color: #fff;
                      background-color: #4caf50;
                      padding: 10px 20px;
                      border-radius: 5px;
                      margin-top: 20px;
                      transition: background-color 0.3s;
                  }
                  a:hover {
                      background-color: #45a049;
                  }
                  .container {
                      text-align: center;
                      padding: 20px;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      background-color: #fff;
                      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Welcome, ${user.username}!</h1>
                  <p>You have successfully signed in.</p>
                  <a href="/">Back to Home</a>
              </div>
          </body>
          </html>
        `);
    } else {
      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Sign In Failed</title>
              <style>
                  body {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f9;
                  }
                  h1 {
                      color: #e74c3c; /* Red color for error */
                  }
                  p {
                      font-size: 16px;
                      color: #333;
                  }
                  a {
                      text-decoration: none;
                      color: #fff;
                      background-color: #e74c3c; /* Red background for error */
                      padding: 10px 20px;
                      border-radius: 5px;
                      margin-top: 20px;
                      transition: background-color 0.3s;
                  }
                  a:hover {
                      background-color: #c0392b; /* Darker red on hover */
                  }
                  .container {
                      text-align: center;
                      padding: 20px;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      background-color: #fff;
                      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Sign In Failed</h1>
                  <p>Invalid username or password. Please try again.</p>
                  <a href="signin.html">Back to Sign In</a>
              </div>
          </body>
          </html>
        `);
    }
  } catch (err) {
    console.error("Error during sign in:", err);
    res.status(500).send("Error processing sign in");
  }
});
app.listen(3000, () => {
  console.log("server is running");
});
