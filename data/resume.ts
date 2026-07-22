// ---------------------------------------------------------------------------
// Resume content, mirroring public/resume.pdf.
//
// When you update the PDF, update this file too so the page and the download
// don't drift apart. Everything here is plain data — the layout lives in
// components/home/ResumePanel.tsx and doesn't need touching.
// ---------------------------------------------------------------------------

export type ResumeEntry = {
  /** Bolded lead — the project, employer, or club. */
  title: string;
  /** Everything after the title on the same line: what it was, where, team size. */
  meta?: string;
  /** Job or position title, on its own line. */
  role?: string;
  dates: string;
  /**
   * Full detail, mirroring the PDF. Deliberately NOT rendered on the web
   * page — it's kept here so the two stay in sync and so any section can be
   * dialled back up to full detail by rendering `bullets` instead.
   */
  bullets?: string[];
  /**
   * The one line that shows on the web page. Omit to show only the heading
   * row, which is the right call when the detail isn't doing real work for
   * a design portfolio.
   */
  highlight?: string;
  /** Project slug — turns the entry into a link to its case study page. */
  slug?: string;
};

export type ResumeSection = {
  heading: string;
  entries: ResumeEntry[];
};

export type SkillGroup = {
  label: string;
  items: string;
};

export const resumeMeta = {
  location: "Ottawa, ON",
  email: "tysonjiang@cmail.carleton.ca",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tysonjiang/" },
    {
      label: "Behance",
      href: "https://www.behance.net/gallery/241614847/Industrial-Design-Portfolio-2026",
    },
  ],
  availability:
    "Available for co-op/internship terms of 4–16 months between January 2027 and August 2028 (part-time January–April 2027; full-time from May 2027).",
};

export const education: ResumeEntry = {
  title: "Carleton University",
  meta: "Ottawa, ON",
  role: "Bachelor of Industrial Design, Co-op Option; Minor in Business (Entrepreneurship)",
  dates: "September 2024 – Present",
    highlight:
      "Expected April 2029 · CGPA 10.65/12.00 (A−) · Dean's Honour List 2024–26 · School of Industrial Design Award of Excellence 2024–25",
  bullets: [
    "Expected graduation April 2029. CGPA 10.65/12.00 (A−).",
    "Dean's Honour List, 2024–2025 and 2025–2026.",
    "School of Industrial Design Award of Excellence, 2024–2025.",
    "Relevant coursework: Design Studio, Human Factors and Ergonomics, Materials and Manufacturing Processes, Design Research Methods, Technical Drawing, Entrepreneurship.",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    label: "CAD and Engineering",
    items:
      "SolidWorks, Onshape (sheet metal, assemblies, technical drawings), AutoCAD, SketchUp, GD&T fundamentals, tolerance analysis, bill of materials (BOM) development, design for manufacturing (DFM)",
  },
  {
    label: "Visualization and Rendering",
    items:
      "Blender, Vizcom (AI-assisted concept and CMF exploration), Raylectron, Adobe Photoshop, Adobe Lightroom, product and event photography",
  },
  {
    label: "Graphics and Communication",
    items:
      "Adobe Illustrator, Adobe InDesign, Canva, brand identity systems, typography, presentation boards, technical documentation",
  },
  {
    label: "Prototyping and Fabrication",
    items:
      "FDM 3D printing (Bambu Studio), industrial design clay modelling, sheet-metal forming and torch annealing, thermoforming, foam and cardboard sketch modelling, jig and fixture design, bandsaw, grinder, thread tapping, hand and power tools, skid-steer (Bobcat) operation",
  },
  {
    label: "Design Methods",
    items:
      "User-centered design, usability testing, design research, concept development, rapid prototyping, iterative design, ergonomics, persona and use-case development, CMF",
  },
  {
    label: "Other",
    items:
      "Next.js, React, Git/GitHub, Microsoft Office; English (fluent), Mandarin (intermediate oral)",
  },
];

export const sections: ResumeSection[] = [
  {
    heading: "Design Projects",
    entries: [
      {
        title: "Ember",
        meta: "Stroke Rehabilitation Adherence Device · Independent Project, Ottawa, ON",
        dates: "May 2026 – Present",
        slug: "ember",
        bullets: [
          "Advancing a home-based device that improves adherence to prescribed hand-rehabilitation exercises for stroke survivors — the reminder disarms only when the user completes their exercise routine — from problem definition to pre-prototype in under 3 months.",
          "Built an evidence-based design brief from 46 peer-reviewed sources spanning stroke rehabilitation, exercise science, and behavioural psychology, halting primary data collection in the absence of institutional ethics approval and treating patient-forum accounts as screened qualitative signal.",
          "Reduced alarm-fatigue risk for a vulnerable population by replacing audible alerts with a white-to-red ambient light escalation, mapping urgency against documented post-stroke anxiety sensitivities.",
          "Cut concept-review turnaround with a design partner by generating Vizcom renders from sketches, validating form and CMF direction ahead of clay modelling and 3D-printed CAD prototypes.",
          "Scoping the electronics component package and structuring public build documentation for open-source release on GitHub.",
        ],
      },
      {
        title: "Helmet (1)",
        meta: "Brand-Language Study for Nothing · Carleton School of Industrial Design (Team of 5)",
        dates: "March 2026 – April 2026",
        slug: "helmet-1",
        bullets: [
          "Set the team's final design direction: personal concept selected over 5 refined candidates distilled from 100+ team-wide concepts as the strongest expression of Nothing's design language, applied to a half-helmet for urban e-scooter riders.",
          "Achieved embossing accuracy praised by faculty reviewers by reverse-engineering the brand's proprietary NDot typeface, modelling custom embossing dies in SolidWorks, and converging on a working tool in 3 FDM print iterations.",
          "Delivered a fully sculpted half-section model (mirror-displayed) in 2 weeks on roughly $10 of purchased material, combining industrial design clay, thermoformed acrylic, and denim over a head bust with salvaged stock.",
          "Presented design rationale to 5 review groups and a 50+ person gallery audience, and produced the team's final product photography in Lightroom and Photoshop.",
        ],
      },
      {
        title: "L1 Lamp",
        meta: "Sheet-Metal and Acrylic Lighting Product · Independent Project",
        dates: "May 2025 – August 2025",
        slug: "l1-lamp",
        bullets: [
          "Delivered a functional aluminum-and-acrylic luminaire in 1 month against a 4-month window and within a $100 CAD budget, executing concept sketching, CAD, fabrication, branding, and documentation as sole contributor.",
          "Solved repeatable tight-radius bending of 1/4-inch sheet aluminum without a hydraulic press through 5 documented jig iterations, revising the fixture with 3D-printed dies, custom angle inserts, plate-steel reinforcement, and lubrication after each failure analysis.",
          "Eliminated cracking at small bend radii by torch-annealing stock before forming, validated through temperature and timing trials on scrap material.",
          "Produced manufacturing-ready documentation — complete BOM, Onshape sheet-metal technical drawings, and 3D-printed wall-mount and spacer hardware — with concept visualization in Blender.",
          "Generated ~9,000 views and 160 engagements across 3 posts from an account with under 50 followers through self-directed product photography and an original brand identity built in Illustrator.",
        ],
      },
      {
        title: "OVIS",
        meta: "Custom Keyboard Concept · Carleton School of Industrial Design",
        dates: "October 2025 – November 2025",
        slug: "ovis",
        bullets: [
          "Identified an unaddressed segment of the custom mechanical keyboard market through documented competitive analysis and translated findings into final product requirements.",
          "Validated ergonomics, usability, and use cases by building 19 cardboard, plasticine, and foam sketch models and running 3 peer user-testing sessions.",
          "Produced 30+ 2D and 3D exploratory sketches to accelerate concept generation and constraint analysis.",
        ],
      },
      {
        title: "iSoap 1",
        meta: "Product and Packaging Design · Carleton School of Industrial Design",
        dates: "March 2025 – April 2025",
        slug: "isoap",
        bullets: [
          "Delivered a shelf-ready soap bar and packaging system meeting brand, volume, and manufacturing constraints by iterating sketch and physical prototypes until feasibility and brand alignment were satisfied.",
          "Resolved fitted-mould and embossing manufacturability challenges by testing draft, undercut, and detail-depth limits across prototype iterations, documenting outcomes on Illustrator presentation boards.",
        ],
      },
      {
        title: "FUKUGOH",
        meta: "Skateboard Brand Identity System · Carleton School of Industrial Design",
        dates: "November 2025 – December 2025",
        slug: "goh",
        bullets: [
          "Built a complete skateboard brand identity — logo system, colour, typography, and deck graphics — in 2 weeks on a $0 budget in Illustrator, InDesign, and Photoshop, earning faculty commendation for execution quality at final review.",
          "Validated design direction against the target subculture through market research across skate and adjacent lifestyle brands and iterative feedback from skateboarding peers.",
        ],
      },
      {
        title: "Personal Portfolio Website",
        meta: "In Progress",
        dates: "2026",
        bullets: [
          "Developing a custom portfolio site in Next.js and React to replace template-based hosting, enabling full control over case-study presentation and project documentation.",
        ],
      },
    ],
  },
  {
    heading: "Experience",
    entries: [
      {
        title: "All Missions Well Done Ltd.",
        meta: "Uxbridge, ON",
        role: "Landscape Designer, Visualizer, and Operations Support (seasonal)",
        dates: "September 2020 – Present",
        highlight:
          "Landscape designs for 30 client projects — AutoCAD plans, SketchUp models, and photorealistic renders in Raylectron.",
        bullets: [
          "Produced residential and commercial landscape designs for 30 client projects, converting site photos, sketches, and satellite data into AutoCAD plans, SketchUp models, material calculations, and AI-assisted concept renderings.",
          "Improved client and contractor alignment — reducing revision cycles during approval — by producing photorealistic 3D renders in SketchUp and Raylectron.",
          "Kept job sites on schedule for a 3–4 person crew by handling procurement runs, urgent same-day repair visits, worker transport, and skid-steer (Bobcat) operation.",
        ],
      },
      {
        title: "Claw Me Baby",
        meta: "Toronto, ON",
        role: "Floor Associate and Cashier",
        dates: "June 2024 – August 2024",
        bullets: [
          "Contributed to consistent 5-star customer reviews by assisting customers directly, resolving issues, and de-escalating conflicts calmly.",
          "Managed inventory counts and processed cash, credit, debit, and point-based transactions with zero reconciliation discrepancies.",
        ],
      },
    ],
  },
  {
    heading: "Leadership and Involvement",
    entries: [
      {
        title: "Carleton Powerlifting Club (CUPL)",
        meta: "Ottawa, ON · Media Executive",
        dates: "May 2025 – Present",
        highlight:
          "~13,000 Instagram views across 5 posts; media assets for 4 club fairs and 10+ events.",
        bullets: [
          "Generated ~13,000 Instagram views across 5 posts and supported recruitment at 4 club fairs and 10+ club events by producing the club's marketing and media assets.",
        ],
      },
      {
        title: "Autonomous Robotics Carleton (ARC)",
        meta: "Ottawa, ON · Media Executive",
        dates: "September 2025 – Present",
        highlight:
          "Promotional graphics and event videography; photographed a 100+ attendee joint event.",
        bullets: [
          "Illustrated promotional graphics and captured event videography supporting team branding; photographed a joint ARC and Systems and Computer Engineering Society event with 100+ attendees, delivering edited Lightroom photo sets.",
        ],
      },
      {
        title: "OUTLINES Magazine",
        meta: "Ottawa, ON · Graphic Designer",
        dates: "September 2025 – Present",
        highlight: "Editorial layouts for published issues, on deadline.",
        bullets: [
          "Produced editorial graphics to publication standards, translating prewritten content into layouts for published issues on deadline.",
        ],
      },
      {
        title: "INDES Canada",
        meta: "Ottawa, ON · Event Photographer",
        dates: "2026",
        highlight:
          "Photographed Canada's first national industrial design conference (100+ attendees).",
        bullets: [
          "Photographed Canada's first national industrial design conference and its student design competition (100+ attendees) at the organization's inaugural event, delivering edited photo sets for promotional use.",
        ],
      },
      {
        title: "Vizcom Corkway Challenge",
        meta: "Entrant",
        dates: "2026",
        highlight:
          "Full competition entry; AI-assisted rendering now part of my concept and CMF workflow.",
        bullets: [
          "Completed and submitted a full competition entry on a first-time platform; since integrated AI-assisted rendering into standing concept and CMF workflow.",
        ],
      },
      {
        title: "Carleton Industrial Design Students' Association (CIDSA)",
        meta: "Photographer (Incoming)",
        dates: "September 2026",
      },
      {
        title: "BioCARE",
        meta: "Carleton University · General Member (Incoming)",
        dates: "September 2026",
      },
    ],
  },
];
