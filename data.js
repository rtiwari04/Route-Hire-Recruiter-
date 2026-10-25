/* ==========================================================================
   RouteHire Demo Data Store (Recruitment & Staffing Platform)
   ========================================================================== */

const ROUTEHIRE_DATA = {
  // Recruitment Requirements Posted by Travel Operators
  jobs: [
    {
      id: "job-101",
      operatorId: "op-201",
      operatorName: "Laxmi Holidays Travels",
      operatorLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Professional Bus Driver",
      location: "Nagpur, Maharashtra",
      routes: ["Nagpur → Mumbai", "Nagpur → Pune", "Nagpur → Hyderabad"],
      salaryMin: 30000,
      salaryMax: 35000,
      salaryFormatted: "₹30,000 – ₹35,000 / Month",
      minExperience: 3,
      vehicleTypes: ["Volvo B11R", "AC Sleeper Bus"],
      vacancies: 10,
      joining: "Immediate",
      jobType: "Full-Time",
      postedDate: "2 hours ago",
      description: "Laxmi Holidays Travels requires 10 professional heavy vehicle bus drivers for interstate long-distance express routes originating from Nagpur. Accomodation and daily trip allowances provided.",
      responsibilities: [
        "Safely operate assigned Volvo / AC Sleeper bus on scheduled interstate routes.",
        "Follow assigned highway routes, timetables, and passenger safety protocols.",
        "Perform pre-trip and post-trip basic vehicle inspections.",
        "Maintain high standards of driving etiquette, speed compliance, and passenger comfort.",
        "Report any vehicle maintenance issues immediately to the fleet operations depot."
      ],
      requirements: [
        "Valid Commercial Heavy Passenger Driving Licence with active badge.",
        "Minimum 3+ years of verifiable experience on long-distance interstate highways.",
        "Demonstrated experience driving Volvo B11R or AC Sleeper coaches.",
        "Good driving record with zero major accident history.",
        "Willingness to operate night shifts and interstate schedules."
      ],
      benefits: [
        "Company-provided accommodation at destination terminals",
        "Daily trip food allowance (₹350/trip)",
        "Zero-Accident quarterly performance incentives",
        "Provident Fund (PF) & ESI Medical Insurance coverage"
      ]
    },
    {
      id: "job-102",
      operatorId: "op-202",
      operatorName: "ABC Travels & Express",
      operatorLogo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Senior Sleeper Bus Pilot",
      location: "Pune, Maharashtra",
      routes: ["Pune → Hyderabad", "Pune → Bangalore"],
      salaryMin: 28000,
      salaryMax: 32000,
      salaryFormatted: "₹28,000 – ₹32,000 / Month",
      minExperience: 2,
      vehicleTypes: ["Scania Metrolink", "BharatBenz Sleeper"],
      vacancies: 5,
      joining: "Within 7 Days",
      jobType: "Full-Time",
      postedDate: "5 hours ago",
      description: "ABC Travels is expanding its Southern corridor services and hiring 5 experienced sleeper bus pilots for regular Pune-Hyderabad routes.",
      responsibilities: [
        "Drive overnight sleeper buses safely on national expressways.",
        "Maintain fuel efficiency and schedule compliance.",
        "Coordinate with bus conductors for smooth passenger boarding."
      ],
      requirements: [
        "Heavy Commercial Licence.",
        "Minimum 2+ years highway experience.",
        "Familiarity with Pune-Hyderabad route halts and tolls."
      ],
      benefits: [
        "Subsidized lodging",
        "Overtime allowance",
        "Health insurance"
      ]
    },
    {
      id: "job-103",
      operatorId: "op-203",
      operatorName: "XYZ Bus Services",
      operatorLogo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Multi-Axle Volvo Master Captain",
      location: "Mumbai, Maharashtra",
      routes: ["Mumbai → Goa", "Mumbai → Pune"],
      salaryMin: 35000,
      salaryMax: 42000,
      salaryFormatted: "₹35,000 – ₹42,000 / Month",
      minExperience: 5,
      vehicleTypes: ["Volvo 9400 B11R", "Scania Metrolink 14.5m"],
      vacancies: 8,
      joining: "Immediate",
      jobType: "Full-Time",
      postedDate: "1 day ago",
      description: "XYZ Bus Services is recruiting master Volvo drivers for the busy Mumbai-Goa coastal highway and expressway routes.",
      responsibilities: [
        "Master handling of 14.5m Multi-Axle Volvo buses.",
        "Strict adherence to highway safety standards and passenger comfort."
      ],
      requirements: [
        "5+ years multi-axle driving experience.",
        "Ghat / Hill driving expertise on Mumbai-Goa route."
      ],
      benefits: [
        "Premium Salary Structure",
        "Free Accommodation in Goa terminal",
        "Annual Performance Bonus"
      ]
    },
    {
      id: "job-104",
      operatorId: "op-204",
      operatorName: "Sunrise Travels India",
      operatorLogo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Commercial Intercity Bus Driver",
      location: "Nagpur, Maharashtra",
      routes: ["Nagpur → Indore", "Nagpur → Bhopal"],
      salaryMin: 26000,
      salaryMax: 30000,
      salaryFormatted: "₹26,000 – ₹30,000 / Month",
      minExperience: 2,
      vehicleTypes: ["Ashok Leyland AC", "Eicher Intercity"],
      vacancies: 6,
      joining: "Immediate",
      jobType: "Full-Time",
      postedDate: "1 day ago",
      description: "Hiring commercial drivers for daily MP-Maharashtra intercity connecting bus services.",
      responsibilities: [
        "Manage daytime scheduled passenger services between Nagpur, Indore, and Bhopal."
      ],
      requirements: [
        "Commercial heavy licence with 2+ years experience."
      ],
      benefits: [
        "Fixed monthly salary",
        "Night stay allowance"
      ]
    },
    {
      id: "job-105",
      operatorId: "op-205",
      operatorName: "CityLink Express",
      operatorLogo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Expressway Bus Pilot",
      location: "Pune, Maharashtra",
      routes: ["Pune → Mumbai", "Pune → Nashik"],
      salaryMin: 28000,
      salaryMax: 33000,
      salaryFormatted: "₹28,000 – ₹33,000 / Month",
      minExperience: 3,
      vehicleTypes: ["BharatBenz AC", "Volvo 9400"],
      vacancies: 4,
      joining: "Within 3 Days",
      jobType: "Full-Time",
      postedDate: "2 days ago",
      description: "High-frequency expressway shuttle service looking for punctual and disciplined drivers.",
      responsibilities: [
        "Run 2 round-trips daily between Pune and Mumbai Expressway."
      ],
      requirements: [
        "3+ years experience driving on Samruddhi or Mumbai-Pune expressway."
      ],
      benefits: [
        "Home daily benefit",
        "Punctuality incentive"
      ]
    },
    {
      id: "job-106",
      operatorId: "op-206",
      operatorName: "Intercity SmartBus Staffing",
      operatorLogo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      verifiedOperator: true,
      title: "Interstate Volvo Sleeper Captain",
      location: "Delhi, Delhi NCR",
      routes: ["Delhi → Jaipur", "Delhi → Manali"],
      salaryMin: 32000,
      salaryMax: 38000,
      salaryFormatted: "₹32,000 – ₹38,000 / Month",
      minExperience: 4,
      vehicleTypes: ["Volvo 9400 B11R", "Scania Metrolink"],
      vacancies: 7,
      joining: "Immediate",
      jobType: "Full-Time",
      postedDate: "3 days ago",
      description: "Hiring Volvo captains for Delhi-Jaipur expressways and Delhi-Manali hill routes.",
      responsibilities: [
        "Operate smart long-distance luxury coaches with GPS tracking."
      ],
      requirements: [
        "Hill driving endorsement for Himachal routes preferred."
      ],
      benefits: [
        "Lodging provided in Delhi & Manali",
        "PF & ESI benefits"
      ]
    }
  ],

  // Registered Driver Profiles
  drivers: [
    {
      id: "drv-101",
      name: "Rajesh Kumar",
      fatherName: "Rameshwar Kumar",
      dob: "1988-05-14",
      gender: "Male",
      city: "Nagpur",
      state: "Maharashtra",
      mobile: "+91 98765 43210",
      email: "rakesh.tiwari.0410@gmail.com",
      experience: 8,
      rating: 4.9,
      score: 96,
      availability: "Available",
      verified: true,
      previousCompany: "Neeta Travels & Logistics",
      lastPosition: "Senior Volvo Multi-Axle Pilot",
      expectedSalary: "₹38,000 / month",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      vehicles: ["Volvo B11R", "AC Sleeper Bus", "Scania Metrolink", "BharatBenz"],
      routes: [
        { origin: "Nagpur", destination: "Hyderabad", experienceYears: 6, trips: 450 },
        { origin: "Nagpur", destination: "Mumbai", experienceYears: 5, trips: 320 },
        { origin: "Nagpur", destination: "Pune", experienceYears: 8, trips: 620 }
      ],
      skills: ["Night Driving", "Highway Driving", "GPS Navigation", "Interstate Driving"],
      languages: ["English", "Hindi", "Marathi"],
      documents: {
        licence: { status: "Verified", expiry: "2032-11-20" },
        medical: { status: "Verified", date: "2026-01-15" },
        police: { status: "Pending", date: null }
      }
    },
    {
      id: "drv-102",
      name: "Suresh Patil",
      fatherName: "Shankar Patil",
      dob: "1985-09-22",
      gender: "Male",
      city: "Pune",
      state: "Maharashtra",
      mobile: "+91 98220 11223",
      email: "suresh.patil@demo.com",
      experience: 12,
      rating: 4.8,
      score: 94,
      availability: "Available",
      verified: true,
      previousCompany: "VRL Logistics Ltd",
      lastPosition: "Master Sleeper Bus Driver",
      expectedSalary: "₹42,000 / month",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      vehicles: ["Scania Metrolink", "Volvo 9400", "Ashok Leyland Sleeper"],
      routes: [
        { origin: "Pune", destination: "Mumbai", experienceYears: 10, trips: 900 },
        { origin: "Mumbai", destination: "Goa", experienceYears: 8, trips: 550 }
      ],
      skills: ["Night Driving", "Hill Driving", "Interstate Driving"],
      languages: ["Hindi", "Marathi"],
      documents: {
        licence: { status: "Verified", expiry: "2030-04-12" },
        medical: { status: "Verified", date: "2025-12-01" },
        police: { status: "Verified", date: "2025-08-20" }
      }
    }
  ],

  // Operator Profiles
  operators: [
    {
      id: "op-201",
      name: "Laxmi Holidays Travels",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80",
      contactPerson: "Vikram Malhotra",
      mobile: "+91 99999 99999",
      email: "recruitment@laxmiholidays.demo",
      city: "Nagpur",
      gst: "27AAACA1234B1Z9",
      fleetSize: "60 Buses"
    }
  ],

  // Driver Job Applications State
  applications: [
    {
      id: "app-501",
      jobId: "job-101",
      driverId: "drv-101",
      driverName: "Rajesh Kumar",
      driverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      operatorName: "Laxmi Holidays Travels",
      jobTitle: "Professional Bus Driver",
      route: "Nagpur → Mumbai / Hyderabad",
      appliedDate: "2026-08-12",
      status: "Shortlisted", // Statuses: Applied, Under Review, Shortlisted, Interview, Selected, Rejected
      matchScore: 96
    },
    {
      id: "app-502",
      jobId: "job-102",
      driverId: "drv-101",
      driverName: "Rajesh Kumar",
      driverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      operatorName: "ABC Travels & Express",
      jobTitle: "Senior Sleeper Bus Pilot",
      route: "Pune → Hyderabad",
      appliedDate: "2026-08-10",
      status: "Under Review",
      matchScore: 88
    }
  ],

  // Job Offers
  jobOffers: [
    {
      id: "off-301",
      driverId: "drv-101",
      operatorName: "Laxmi Holidays Travels",
      role: "Professional Bus Driver",
      route: "Nagpur → Hyderabad",
      offeredSalary: "₹35,000 / month",
      joiningDate: "2026-08-20",
      status: "Pending"
    }
  ],

  // Notifications
  notifications: [
    {
      id: "notif-1",
      type: "job",
      title: "New Opportunity Matched!",
      message: "Laxmi Holidays Travels posted a requirement matching your Nagpur → Hyderabad route experience.",
      timestamp: "10 mins ago",
      unread: true
    },
    {
      id: "notif-2",
      type: "application",
      title: "Application Shortlisted!",
      message: "RouteHire team has shortlisted your profile for Laxmi Holidays Travels.",
      timestamp: "1 hour ago",
      unread: true
    }
  ]
};
