import Layout from "@/components/Layout";
import ProjectDialog from "@/components/ProjectDialog";
import NGOImage from "@/components/NGOImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Network,
  Lightbulb,
  TrendingUp,
  Heart,
  Users,
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Target,
  Plus,
  Eye,
} from "lucide-react";

type ProjectStatus = "completed" | "ongoing" | "planned";
type ProjectCategory =
  | "networking"
  | "mentorship"
  | "business"
  | "startup"
  | "funding"
  | "community";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  location: string;
  beneficiaries: number;
  budget: string;
  impact: string[];
  image: string;
  gallery: string[];
  partner?: string;
  duration: string;
  completion?: number; // percentage for ongoing projects
  fundingGoal?: number;
  fundsRaised?: number;
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    longDescription: "",
    category: "networking",
    status: "planned",
    year: new Date().getFullYear(),
    location: "",
    beneficiaries: 0,
    budget: "",
    impact: [],
    image: "default",
    gallery: ["default"],
    partner: "",
    duration: "",
    fundingGoal: 500000,
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const categories = [
    {
      value: "networking",
      label: "Networking",
      icon: Network,
      color: "bg-ngo-purple",
    },
    {
      value: "mentorship",
      label: "Mentorship",
      icon: Users,
      color: "bg-ngo-purple-light",
    },
    { 
      value: "business", 
      label: "Business Development", 
      icon: Briefcase, 
      color: "bg-ngo-pink" 
    },
    {
      value: "startup",
      label: "Startup Support",
      icon: Lightbulb,
      color: "bg-destructive",
    },
    { 
      value: "funding", 
      label: "Funding Support", 
      icon: TrendingUp, 
      color: "bg-ngo-pink-light" 
    },
    {
      value: "community",
      label: "Community Building",
      icon: Heart,
      color: "bg-ngo-pink",
    },
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Global Entrepreneur Network",
      description:
        "Connecting entrepreneurs worldwide through our flagship networking platform and events.",
      longDescription:
        "Our comprehensive networking program connects entrepreneurs across continents through virtual meetups, annual conferences, and region-specific networking events. Members gain access to our exclusive platform with industry insights, partnership opportunities, and collaborative projects.",
      category: "networking",
      status: "completed",
      year: 2023,
      location: "Global (25+ Countries)",
      beneficiaries: 5000,
      budget: "₹75,00,000",
      impact: [
        "5,000+ entrepreneurs connected globally",
        "500+ business partnerships formed",
        "95% member satisfaction rate",
        "200+ networking events hosted",
      ],
      image: "networking",
      gallery: ["networking", "networking", "networking"],
      partner: "Global Business Alliance",
      duration: "18 months",
      fundingGoal: 7500000,
      fundsRaised: 7500000,
    },
    {
      id: "2",
      title: "Startup Mentorship Program",
      description:
        "Pairing early-stage entrepreneurs with experienced business leaders for guided growth.",
      longDescription:
        "Comprehensive mentorship program matching startup founders with industry veterans. Includes structured curriculum, monthly one-on-one sessions, group workshops, and access to exclusive resources for scaling businesses.",
      category: "mentorship",
      status: "ongoing",
      year: 2024,
      location: "India & Southeast Asia",
      beneficiaries: 800,
      budget: "₹45,00,000",
      impact: [
        "800+ startups receiving mentorship",
        "300+ experienced mentors onboarded",
        "65% startup survival rate improvement",
        "50+ successful funding rounds facilitated",
      ],
      image: "mentorship",
      gallery: ["mentorship", "mentorship", "mentorship"],
      partner: "Startup India Initiative",
      duration: "24 months",
      completion: 65,
      fundingGoal: 4500000,
      fundsRaised: 2925000,
    },
    {
      id: "3",
      title: "Business Accelerator Hub",
      description:
        "Intensive 6-month program providing resources, workspace, and funding opportunities.",
      longDescription:
        "State-of-the-art accelerator providing startups with co-working space, expert guidance, investor connections, and seed funding opportunities. Includes workshops on business strategy, market validation, and scaling operations.",
      category: "business",
      status: "completed",
      year: 2022,
      location: "Mumbai & Bangalore",
      beneficiaries: 120,
      budget: "₹1,20,00,000",
      impact: [
        "120 startups accelerated",
        "80% graduation rate achieved",
        "₹50 crores in follow-up funding raised",
        "300+ jobs created by graduated startups",
      ],
      image: "business",
      gallery: ["business", "business", "business"],
      partner: "TechHub India",
      duration: "12 months",
      fundingGoal: 12000000,
      fundsRaised: 12000000,
    },
    {
      id: "4",
      title: "Tech Startup Incubator",
      description:
        "Supporting early-stage tech startups with resources, mentorship, and market access.",
      longDescription:
        "Specialized incubator for technology startups providing technical infrastructure, cloud credits, expert mentorship, and connections to global markets. Focus on AI, blockchain, and sustainable technology solutions.",
      category: "startup",
      status: "ongoing",
      year: 2024,
      location: "Hyderabad & Pune",
      beneficiaries: 60,
      budget: "₹80,00,000",
      impact: [
        "60 tech startups supported",
        "40+ expert mentors engaged",
        "20+ patents filed by startups",
        "₹25 crores in startup valuations",
      ],
      image: "startup",
      gallery: ["startup", "startup", "startup"],
      partner: "National Innovation Foundation",
      duration: "36 months",
      completion: 40,
      fundingGoal: 8000000,
      fundsRaised: 3200000,
    },
    {
      id: "5",
      title: "Angel Investor Network",
      description:
        "Connecting promising startups with angel investors and venture capitalists.",
      longDescription:
        "Curated platform facilitating connections between validated startups and verified angel investors. Includes pitch events, due diligence support, and structured investment processes with legal framework assistance.",
      category: "funding",
      status: "completed",
      year: 2023,
      location: "National (India)",
      beneficiaries: 200,
      budget: "₹30,00,000",
      impact: [
        "200+ startups connected with investors",
        "₹100 crores in funding facilitated",
        "150+ angel investors onboarded",
        "85% funding success rate",
      ],
      image: "funding",
      gallery: ["funding", "funding", "funding"],
      partner: "Indian Angel Network",
      duration: "8 months",
      fundingGoal: 3000000,
      fundsRaised: 3000000,
    },
    {
      id: "6",
      title: "Young Entrepreneur Community",
      description:
        "Building local entrepreneur communities through events, workshops, and collaboration spaces.",
      longDescription:
        "Comprehensive community building program establishing local YEN chapters, organizing regular meetups, workshops, and collaborative workspaces. Focus on peer learning, knowledge sharing, and local business ecosystem development.",
      category: "community",
      status: "planned",
      year: 2025,
      location: "Tier-2 & Tier-3 Cities",
      beneficiaries: 2000,
      budget: "₹60,00,000",
      impact: [
        "20 local YEN chapters established",
        "2,000+ young entrepreneurs engaged",
        "100+ community events planned",
        "Local business ecosystem strengthening",
      ],
      image: "community",
      gallery: ["community", "community", "community"],
      partner: "Youth Development Council",
      duration: "18 months",
      fundingGoal: 6000000,
      fundsRaised: 1500000,
    },
    {
      id: "7",
      title: "Digital Marketing Bootcamp",
      description:
        "Intensive training program helping entrepreneurs master digital marketing and online business.",
      longDescription:
        "Comprehensive digital marketing education program covering social media marketing, content strategy, SEO, paid advertising, and e-commerce. Includes hands-on projects, real business case studies, and certification.",
      category: "business",
      status: "ongoing",
      year: 2024,
      location: "Online & Hybrid",
      beneficiaries: 1500,
      budget: "₹25,00,000",
      impact: [
        "1,500+ entrepreneurs trained",
        "300+ businesses scaled online",
        "80% revenue increase for participants",
        "Digital transformation success stories",
      ],
      image: "business",
      gallery: ["business", "business", "business"],
      partner: "Digital India Initiative",
      duration: "12 months",
      completion: 70,
      fundingGoal: 2500000,
      fundsRaised: 1750000,
    },
    {
      id: "8",
      title: "Women Entrepreneurs Initiative",
      description:
        "Specialized program supporting women-led startups with funding, mentorship, and market access.",
      longDescription:
        "Dedicated initiative supporting women entrepreneurs through specialized mentorship, funding opportunities, networking events, and market access programs. Focus on addressing unique challenges faced by women in business.",
      category: "mentorship",
      status: "completed",
      year: 2022,
      location: "Delhi & Kolkata",
      beneficiaries: 500,
      budget: "₹40,00,000",
      impact: [
        "500+ women entrepreneurs supported",
        "200+ businesses launched",
        "₹20 crores in funding raised",
        "60% business survival rate",
      ],
      image: "mentorship",
      gallery: ["mentorship", "mentorship", "mentorship"],
      partner: "Women Business Association",
      duration: "15 months",
      fundingGoal: 4000000,
      fundsRaised: 4000000,
    },
  ]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title || "",
        description: newProject.description || "",
        longDescription:
          newProject.longDescription || newProject.description || "",
        category: (newProject.category as ProjectCategory) || "networking",
        status: (newProject.status as ProjectStatus) || "planned",
        year: newProject.year || new Date().getFullYear(),
        location: newProject.location || "",
        beneficiaries: newProject.beneficiaries || 0,
        budget: newProject.budget || "",
        impact: newProject.impact || [],
        image: "water",
        gallery: ["water", "water", "water"],
        partner: newProject.partner,
        duration: newProject.duration || "",
        completion: newProject.status === "ongoing" ? 0 : undefined,
        fundingGoal: newProject.fundingGoal || 500000,
        fundsRaised: 0,
      };

      setProjects((prev) => [project, ...prev]);
      setNewProject({
        title: "",
        description: "",
        longDescription: "",
        category: "networking",
        status: "planned",
        year: new Date().getFullYear(),
        location: "",
        beneficiaries: 0,
        budget: "",
        impact: [],
        image: "water",
        gallery: ["default"],
        partner: "",
        duration: "",
        fundingGoal: 500000,
      });
      setShowAddProject(false);
    }
  };

  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;
      const matchesYear =
        selectedYear === "all" || project.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });
  }, [searchTerm, selectedCategory, selectedStatus, selectedYear, projects]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "bg-ngo-purple";
      case "ongoing":
        return "bg-ngo-purple";
      case "planned":
        return "bg-ngo-pink";
      default:
        return "bg-muted-foreground";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "ongoing":
        return "In Progress";
      case "planned":
        return "Planned";
      default:
        return "Unknown";
    }
  };

  const getCategoryConfig = (category: ProjectCategory) => {
    return categories.find((c) => c.value === category) || categories[0];
  };

  const totalBeneficiaries = filteredProjects.reduce(
    (sum, project) => sum + project.beneficiaries,
    0,
  );
  const completedProjects = filteredProjects.filter(
    (p) => p.status === "completed",
  ).length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Our Programs
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empowering Entrepreneurs Through{" "}
              <span className="text-primary">Strategic Programs</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover how we're building the next generation of successful entrepreneurs 
              through our comprehensive networking, mentorship, and business development programs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {filteredProjects.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Programs
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{completedProjects}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Entrepreneurs Impacted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-2 text-center justify-center">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Filter Programs</h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="ongoing">In Progress</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>

                {/* Year Filter */}
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Add Project Button */}
              {userRole === "admin" && (
                <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
                  <DialogTrigger asChild>
                    <Button className="ml-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Program
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Program</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Program Title</Label>
                          <Input
                            id="title"
                            value={newProject.title}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Enter program title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newProject.category}
                            onValueChange={(value) =>
                              setNewProject((prev) => ({
                                ...prev,
                                category: value as ProjectCategory,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Input
                          id="description"
                          value={newProject.description}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Brief program description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longDescription">
                          Detailed Description
                        </Label>
                        <Textarea
                          id="longDescription"
                          value={newProject.longDescription}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              longDescription: e.target.value,
                            }))
                          }
                          placeholder="Detailed program description"
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newProject.location}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="Program location"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            value={newProject.duration}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                duration: e.target.value,
                              }))
                            }
                            placeholder="e.g., 12 months"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="beneficiaries">Beneficiaries</Label>
                          <Input
                            id="beneficiaries"
                            type="number"
                            value={newProject.beneficiaries}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                beneficiaries: parseInt(e.target.value) || 0,
                              }))
                            }
                            placeholder="Number of beneficiaries"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget</Label>
                          <Input
                            id="budget"
                            value={newProject.budget}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                budget: e.target.value,
                              }))
                            }
                            placeholder="e.g., ₹5,00,000"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fundingGoal">Funding Goal (₹)</Label>
                          <Input
                            id="fundingGoal"
                            type="number"
                            value={newProject.fundingGoal}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                fundingGoal: parseInt(e.target.value) || 500000,
                              }))
                            }
                            placeholder="500000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newProject.status}
                            onValueChange={(value) =>
                              setNewProject((prev) => ({
                                ...prev,
                                status: value as ProjectStatus,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner">
                          Partner Organization (Optional)
                        </Label>
                        <Input
                          id="partner"
                          value={newProject.partner}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              partner: e.target.value,
                            }))
                          }
                          placeholder="Partner organization name"
                        />
                      </div>

                        <Button onClick={handleAddProject} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Program
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No programs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more programs.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const categoryConfig = getCategoryConfig(project.category);
                const Icon = categoryConfig.icon;

                return (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="aspect-video relative">
                      <NGOImage
                        type={project.category as any}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <Badge
                          variant="secondary"
                          className={`${categoryConfig.color} text-white`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {categoryConfig.label}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(project.status)} text-white`}
                        >
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                      {project.completion && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-background/90 rounded-full p-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{project.completion}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.completion}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.year}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.beneficiaries.toLocaleString()} people
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {project.budget}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Impact:</h4>
                        <ul className="space-y-1">
                          {project.impact.slice(0, 2).map((impact, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {impact}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        {project.partner && (
                          <span className="text-xs text-muted-foreground">
                            Partner: {project.partner}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectClick(project);
                          }}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Dialog */}
      <ProjectDialog
        project={selectedProject}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Want to Join Our Programs?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join our community of ambitious entrepreneurs. Your membership unlocks 
              access to our exclusive programs, networking events, and business growth opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/membership">
                  Become a Member
                  <Heart className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
