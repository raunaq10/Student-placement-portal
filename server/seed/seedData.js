const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Placement = require("../models/Placement");
const { connectDB } = require("../config/db");

// Ensure sample resume file exists
const sampleResumeDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(sampleResumeDir)) {
  fs.mkdirSync(sampleResumeDir, { recursive: true });
}
const sampleResumePath = path.join(sampleResumeDir, "sample-resume.pdf");
if (!fs.existsSync(sampleResumePath)) {
  fs.writeFileSync(
    sampleResumePath,
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF"
  );
}

const seedDatabase = async () => {
  try {
    // If DB not connected, connect
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log("[Seed] Clearing existing collections...");
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Placement.deleteMany({}),
    ]);

    console.log("[Seed] Creating Users...");
    // 1. Admin
    const admin = await User.create({
      name: "Dr. Ramesh Sharma (Dean Placement)",
      email: "admin@placement.edu",
      password: "admin123",
      role: "admin",
    });

    // 2. Recruiters
    const recruiterGoogle = await User.create({
      name: "Sarah Jenkins",
      email: "recruiter@techcorp.com",
      password: "recruiter123",
      role: "recruiter",
    });

    const recruiterTCS = await User.create({
      name: "Rajesh Verma",
      email: "tcs_hr@consulting.com",
      password: "recruiter123",
      role: "recruiter",
    });

    // 3. Students
    const studentArjun = await User.create({
      name: "Arjun Patel",
      email: "student@placement.edu",
      password: "student123",
      role: "student",
    });

    const studentPriya = await User.create({
      name: "Priya Sharma",
      email: "priya@student.edu",
      password: "student123",
      role: "student",
    });

    const studentRohit = await User.create({
      name: "Rohit Verma",
      email: "rohit@student.edu",
      password: "student123",
      role: "student",
    });

    const studentSneha = await User.create({
      name: "Sneha Nair",
      email: "sneha@student.edu",
      password: "student123",
      role: "student",
    });

    console.log("[Seed] Creating Student Profiles...");
    await StudentProfile.create([
      {
        userId: studentArjun._id,
        rollNumber: "2022BCSE101",
        phone: "+91 98765 43210",
        course: "B.Tech",
        branch: "Computer Science and Engineering",
        semester: 7,
        cgpa: 8.85,
        tenthPercentage: 92.4,
        twelfthPercentage: 89.6,
        backlogs: 0,
        skills: ["React", "Node.js", "Python", "Data Structures", "Docker", "AWS", "MongoDB"],
        projects: [
          {
            title: "Campus Placement Management System",
            description: "Full stack MERN web application with automated eligibility verification.",
            techStack: ["React", "Node.js", "Express", "MongoDB"],
            githubLink: "https://github.com/sample/placement-portal",
          },
          {
            title: "Distributed Task Queue",
            description: "High performance message queue broker with Redis.",
            techStack: ["Node.js", "Redis"],
            githubLink: "https://github.com/sample/task-queue",
          },
        ],
        certifications: [
          { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2024" },
          { title: "Meta Front-End Developer", issuer: "Coursera", year: "2023" },
        ],
        internships: [
          {
            company: "TechNova Solutions",
            role: "Software Engineering Intern",
            duration: "May 2024 - Jul 2024",
            description: "Built microservices for analytics pipeline.",
          },
        ],
        resume: {
          filename: "sample-resume.pdf",
          originalName: "Arjun_Patel_Resume.pdf",
          path: sampleResumePath,
          url: "/uploads/resumes/sample-resume.pdf",
          uploadedAt: new Date(),
        },
      },
      {
        userId: studentPriya._id,
        rollNumber: "2022BIT105",
        phone: "+91 98123 45678",
        course: "B.Tech",
        branch: "Information Technology",
        semester: 7,
        cgpa: 7.6,
        tenthPercentage: 84.0,
        twelfthPercentage: 81.2,
        backlogs: 1,
        skills: ["Java", "Spring Boot", "SQL", "Git", "REST APIs"],
        projects: [
          {
            title: "Banking API Microservice",
            description: "Secure financial transaction server with OAuth2 authentication.",
            techStack: ["Java", "Spring Boot", "PostgreSQL"],
          },
        ],
        resume: {
          filename: "sample-resume.pdf",
          originalName: "Priya_Sharma_Resume.pdf",
          path: sampleResumePath,
          url: "/uploads/resumes/sample-resume.pdf",
          uploadedAt: new Date(),
        },
      },
      {
        userId: studentRohit._id,
        rollNumber: "2022BECE042",
        phone: "+91 97456 12389",
        course: "B.Tech",
        branch: "Electronics and Communication",
        semester: 7,
        cgpa: 6.4,
        tenthPercentage: 72.0,
        twelfthPercentage: 70.5,
        backlogs: 2,
        skills: ["Embedded C", "Python", "IoT", "Arduino", "MATLAB"],
        resume: {
          filename: "sample-resume.pdf",
          originalName: "Rohit_Verma_Resume.pdf",
          path: sampleResumePath,
          url: "/uploads/resumes/sample-resume.pdf",
          uploadedAt: new Date(),
        },
      },
      {
        userId: studentSneha._id,
        rollNumber: "2022BCSE210",
        phone: "+91 99001 22334",
        course: "B.Tech",
        branch: "Computer Science and Engineering",
        semester: 7,
        cgpa: 9.42,
        tenthPercentage: 96.0,
        twelfthPercentage: 94.8,
        backlogs: 0,
        skills: ["Go", "Kubernetes", "Python", "Deep Learning", "TensorFlow", "FastAPI"],
        resume: {
          filename: "sample-resume.pdf",
          originalName: "Sneha_Nair_Resume.pdf",
          path: sampleResumePath,
          url: "/uploads/resumes/sample-resume.pdf",
          uploadedAt: new Date(),
        },
      },
    ]);

    console.log("[Seed] Creating Companies...");
    const companyGoogle = await Company.create({
      name: "Google",
      industry: "Technology & Cloud Computing",
      description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
      website: "https://careers.google.com",
      location: "Bengaluru / Hyderabad",
      recruiterId: recruiterGoogle._id,
      contactEmail: "campus-hiring@google.com",
      contactPhone: "+91 80 6721 8000",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    });

    const companyMicrosoft = await Company.create({
      name: "Microsoft",
      industry: "Software & AI Solutions",
      description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
      website: "https://careers.microsoft.com",
      location: "Hyderabad / Bengaluru / Noida",
      recruiterId: recruiterGoogle._id,
      contactEmail: "recruitment@microsoft.com",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    });

    const companyTCS = await Company.create({
      name: "Tata Consultancy Services (TCS)",
      industry: "IT Services & Consulting",
      description: "A premier global IT services, consulting and business solutions organization delivering real results.",
      website: "https://www.tcs.com/careers",
      location: "Pan India",
      recruiterId: recruiterTCS._id,
      contactEmail: "campus.tcs@tcs.com",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    });

    const companyInfosys = await Company.create({
      name: "Infosys",
      industry: "Digital Services & Consulting",
      description: "A global leader in next-generation digital services and consulting navigating client digital transformations.",
      website: "https://www.infosys.com/careers",
      location: "Bengaluru / Pune / Chennai",
      recruiterId: recruiterTCS._id,
      contactEmail: "campus.infy@infosys.com",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    });

    console.log("[Seed] Creating Jobs...");
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const in45Days = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    const driveDate1 = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    const driveDate2 = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

    const jobGoogleSDE = await Job.create({
      companyId: companyGoogle._id,
      title: "Software Development Engineer (L3)",
      description:
        "We are looking for passionate Software Engineers to build scalable systems, distributed microservices, and AI-driven platforms. You will collaborate with global teams across Google Search, Cloud, and Android.",
      salary: "₹24.0 LPA",
      packageLPA: 24.0,
      location: "Bengaluru / Hyderabad",
      minimumCGPA: 8.0,
      minTenthPercentage: 75.0,
      minTwelfthPercentage: 75.0,
      branches: ["Computer Science and Engineering", "Information Technology"],
      requiredSkills: ["Data Structures", "Algorithms", "Java / C++ / Python", "System Design"],
      maxBacklogs: 0,
      deadline: in30Days,
      driveDate: driveDate1,
      status: "Active",
      createdBy: recruiterGoogle._id,
    });

    const jobMicrosoftCloud = await Job.create({
      companyId: companyMicrosoft._id,
      title: "Cloud Support Associate",
      description:
        "Join Microsoft Azure engineering to empower global enterprise customers. Resolve complex cloud architectural challenges and build diagnostic automation tooling.",
      salary: "₹16.5 LPA",
      packageLPA: 16.5,
      location: "Hyderabad",
      minimumCGPA: 7.5,
      minTenthPercentage: 70.0,
      minTwelfthPercentage: 70.0,
      branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication"],
      requiredSkills: ["Networking", "Linux", "Cloud Computing", "Python / PowerShell"],
      maxBacklogs: 0,
      deadline: in30Days,
      driveDate: driveDate2,
      status: "Active",
      createdBy: recruiterGoogle._id,
    });

    const jobTCSDigital = await Job.create({
      companyId: companyTCS._id,
      title: "Systems Engineer (Digital Track)",
      description:
        "TCS Digital role is tailored for high-potential engineering graduates with strong algorithmic problem solving, modern full stack development, and AI engineering acumen.",
      salary: "₹7.5 LPA",
      packageLPA: 7.5,
      location: "Pan India",
      minimumCGPA: 7.0,
      minTenthPercentage: 65.0,
      minTwelfthPercentage: 65.0,
      branches: ["All"],
      requiredSkills: ["Java", "Python", "SQL", "Web Development"],
      maxBacklogs: 1,
      deadline: in45Days,
      driveDate: driveDate2,
      status: "Active",
      createdBy: recruiterTCS._id,
    });

    const jobTCSNinja = await Job.create({
      companyId: companyTCS._id,
      title: "Associate Software Engineer (Ninja)",
      description:
        "Launch your enterprise IT career with comprehensive onboarding, global project rotations, and digital transformation initiatives.",
      salary: "₹3.8 LPA",
      packageLPA: 3.8,
      location: "Pan India",
      minimumCGPA: 6.0,
      minTenthPercentage: 60.0,
      minTwelfthPercentage: 60.0,
      branches: ["All"],
      requiredSkills: ["C", "C++", "Basic Database", "Problem Solving"],
      maxBacklogs: 2,
      deadline: in45Days,
      status: "Active",
      createdBy: recruiterTCS._id,
    });

    const jobInfosysSP = await Job.create({
      companyId: companyInfosys._id,
      title: "Specialist Programmer (Power Programmer)",
      description:
        "High-performance coding role focusing on modern microservices, open-source technology stacks, cloud architectures, and machine learning solutions.",
      salary: "₹9.5 LPA",
      packageLPA: 9.5,
      location: "Bengaluru / Pune",
      minimumCGPA: 7.0,
      minTenthPercentage: 65.0,
      minTwelfthPercentage: 65.0,
      branches: ["Computer Science and Engineering", "Information Technology"],
      requiredSkills: ["Full Stack", "Data Structures", "Spring Boot / Node.js"],
      maxBacklogs: 0,
      deadline: in30Days,
      status: "Active",
      createdBy: recruiterTCS._id,
    });

    console.log("[Seed] Creating Applications & Placements...");
    // 1. Sneha Nair -> Google SDE -> Selected & Placed!
    await Application.create({
      studentId: studentSneha._id,
      jobId: jobGoogleSDE._id,
      resume: {
        filename: "sample-resume.pdf",
        originalName: "Sneha_Nair_Resume.pdf",
        url: "/uploads/resumes/sample-resume.pdf",
      },
      status: "Selected",
      feedback: "Exceptional coding speed, outstanding algorithmic reasoning and clear communication.",
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    });

    await Placement.create({
      studentId: studentSneha._id,
      companyId: companyGoogle._id,
      jobId: jobGoogleSDE._id,
      package: "₹24.0 LPA",
      packageLPA: 24.0,
      joiningDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // 2. Arjun Patel -> Google SDE -> Interview
    await Application.create({
      studentId: studentArjun._id,
      jobId: jobGoogleSDE._id,
      resume: {
        filename: "sample-resume.pdf",
        originalName: "Arjun_Patel_Resume.pdf",
        url: "/uploads/resumes/sample-resume.pdf",
      },
      status: "Interview",
      feedback: "Passed technical round 1 with distinction. Round 2 scheduled for next Tuesday.",
      interviewDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    });

    // 3. Arjun Patel -> Microsoft Cloud -> Shortlisted
    await Application.create({
      studentId: studentArjun._id,
      jobId: jobMicrosoftCloud._id,
      resume: {
        filename: "sample-resume.pdf",
        originalName: "Arjun_Patel_Resume.pdf",
        url: "/uploads/resumes/sample-resume.pdf",
      },
      status: "Shortlisted",
      feedback: "Profile shortlisted based on AWS certification and web development experience.",
      appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    });

    // 4. Priya Sharma -> TCS Digital -> Selected & Placed!
    await Application.create({
      studentId: studentPriya._id,
      jobId: jobTCSDigital._id,
      resume: {
        filename: "sample-resume.pdf",
        originalName: "Priya_Sharma_Resume.pdf",
        url: "/uploads/resumes/sample-resume.pdf",
      },
      status: "Selected",
      feedback: "Cleared technical test and manager round.",
      appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    });

    await Placement.create({
      studentId: studentPriya._id,
      companyId: companyTCS._id,
      jobId: jobTCSDigital._id,
      package: "₹7.5 LPA",
      packageLPA: 7.5,
      joiningDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      placedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    // 5. Rohit Verma -> TCS Ninja -> Under Review
    await Application.create({
      studentId: studentRohit._id,
      jobId: jobTCSNinja._id,
      resume: {
        filename: "sample-resume.pdf",
        originalName: "Rohit_Verma_Resume.pdf",
        url: "/uploads/resumes/sample-resume.pdf",
      },
      status: "Under Review",
      feedback: "Awaiting aptitude round score assessment.",
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    console.log("[Seed] Database successfully seeded with rich placement portal data!");
    console.log("-----------------------------------------------------------------");
    console.log("Demo Credentials:");
    console.log("  • Admin:     admin@placement.edu        / admin123");
    console.log("  • Recruiter: recruiter@techcorp.com     / recruiter123");
    console.log("  • Student:   student@placement.edu      / student123");
    console.log("-----------------------------------------------------------------");
  } catch (error) {
    console.error(`[Seed] Error seeding data: ${error.message}`);
  }
};

// If run directly via command line
if (require.main === module) {
  seedDatabase().then(() => {
    console.log("[Seed] Finished seeding process.");
    process.exit(0);
  });
}

module.exports = seedDatabase;
