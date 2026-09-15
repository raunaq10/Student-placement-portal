require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const seedDatabase = require("./seed/seedData");
const User = require("./models/User");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route - Welcome page & API directory
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Placement Portal API</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            padding: 40px;
            max-width: 620px;
            width: 100%;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .badge::before {
            content: '';
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
          }
          h1 {
            font-size: 26px;
            font-weight: 800;
            margin: 16px 0 8px 0;
            color: #0f172a;
          }
          p {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 24px 0;
          }
          .action-box {
            background: #eef2ff;
            border: 1px solid #c7d2fe;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
          }
          .action-box h3 {
            margin: 0 0 6px 0;
            font-size: 15px;
            color: #3730a3;
            font-weight: 700;
          }
          .action-box p {
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #4338ca;
          }
          .btn {
            display: inline-block;
            background: #4f46e5;
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 12px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            transition: all 0.2s ease;
          }
          .btn:hover {
            background: #4338ca;
            transform: translateY(-1px);
          }
          .endpoints {
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
          }
          .endpoints h4 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            margin: 0 0 12px 0;
          }
          .endpoint-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .endpoint-link {
            display: block;
            padding: 10px 14px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            text-decoration: none;
            color: #334155;
            font-size: 12px;
            font-weight: 600;
            font-family: monospace;
            transition: all 0.15s ease;
          }
          .endpoint-link:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            color: #4f46e5;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">API Server Online</span>
          <h1>Student Placement Portal Backend</h1>
          <p>
            The REST API server is running on port 5000 with MongoDB connected.
          </p>

          <div class="action-box">
            <h3>Looking for the web interface?</h3>
            <p>The interactive frontend application with role dashboards is running at port 5173.</p>
            <a href="http://localhost:5173" class="btn">Open Placement Portal (http://localhost:5173) &rarr;</a>
          </div>

          <div class="endpoints">
            <h4>Available REST Endpoints:</h4>
            <div class="endpoint-list">
              <a href="/api/health" class="endpoint-link">GET /api/health</a>
              <a href="/api/jobs" class="endpoint-link">GET /api/jobs</a>
              <a href="/api/companies" class="endpoint-link">GET /api/companies</a>
              <a href="/api/dashboard/stats" class="endpoint-link">GET /api/dashboard/stats</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      status: "online",
      message: "Student Placement Portal API Server is running",
      frontendUrl: "http://localhost:5173",
      endpoints: {
        health: "/api/health",
        jobs: "/api/jobs",
        companies: "/api/companies",
        dashboard: "/api/dashboard/stats",
      },
    });
  }
});

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Student Placement Portal API",
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[Server] Empty database detected. Auto-seeding initial data...");
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Placement Portal Server running on http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
