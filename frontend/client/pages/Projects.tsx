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
  Droplets,
  GraduationCap,
  Home,
  Heart,
  Stethoscope,
  Zap,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Target,
  Plus,
  Eye,
} from "lucide-react";

type ProjectStatus = "completed" | "ongoing" | "planned";
type ProjectCategory =
  | "water"
  | "education"
  | "housing"
  | "healthcare"
  | "energy"
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
    category: "water",
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
      value: "water",
      label: "Clean Water",
      icon: Droplets,
      color: "bg-blue-500",
    },
    {
      value: "education",
      label: "Education",
      icon: GraduationCap,
      color: "bg-purple-500",
    },
    { value: "housing", label: "Housing", icon: Home, color: "bg-orange-500" },
    {
      value: "healthcare",
      label: "Healthcare",
      icon: Stethoscope,
      color: "bg-red-500",
    },
    { value: "energy", label: "Energy", icon: Zap, color: "bg-yellow-500" },
    {
      value: "community",
      label: "Community Dev",
      icon: Heart,
      color: "bg-pink-500",
    },
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Clean Water Wells Initiative",
      description:
        "Installing sustainable water wells in rural communities across Kenya and Tanzania.",
      longDescription:
        "This comprehensive water project involves drilling deep wells, installing solar-powered pumps, and training local communities in maintenance. Each well serves approximately 500 people and includes water quality testing and purification systems.",
      category: "water",
      status: "completed",
      year: 2023,
      location: "Kenya & Tanzania",
      beneficiaries: 12500,
      budget: "$150,000",
      impact: [
        "25 wells installed with solar pumps",
        "12,500 people gained clean water access",
        "80% reduction in waterborne diseases",
        "50 local technicians trained in maintenance",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Water for Life Foundation",
      duration: "18 months",
      fundingGoal: 1500000,
      fundsRaised: 1500000,
    },
    {
      id: "2",
      title: "Rural School Construction Program",
      description:
        "Building modern schools with digital learning centers in underserved communities.",
      longDescription:
        "Complete school infrastructure development including classrooms, laboratories, libraries, and computer centers. Each school is designed to accommodate 300-500 students and includes teacher training programs.",
      category: "education",
      status: "ongoing",
      year: 2024,
      location: "Uganda & Ghana",
      beneficiaries: 2800,
      budget: "$300,000",
      impact: [
        "8 schools under construction",
        "2,800 children will benefit",
        "40 teachers receiving training",
        "Digital learning centers in each school",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Education First Alliance",
      duration: "24 months",
      completion: 65,
      fundingGoal: 3000000,
      fundsRaised: 1950000,
    },
    {
      id: "3",
      title: "Affordable Housing Village",
      description:
        "Constructing sustainable homes for displaced families with community centers.",
      longDescription:
        "Eco-friendly housing project using local materials and sustainable building practices. Includes family homes, community center, playground, and shared facilities with rainwater harvesting systems.",
      category: "housing",
      status: "completed",
      year: 2022,
      location: "Philippines",
      beneficiaries: 800,
      budget: "$200,000",
      impact: [
        "120 homes built for families",
        "800 people housed safely",
        "Community center with multipurpose halls",
        "Rainwater harvesting for all homes",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Habitat International",
      duration: "12 months",
      fundingGoal: 2000000,
      fundsRaised: 2000000,
    },
    {
      id: "4",
      title: "Mobile Health Clinics Network",
      description:
        "Deploying mobile medical units to reach remote communities with healthcare services.",
      longDescription:
        "State-of-the-art mobile health units equipped with medical equipment, telemedicine capabilities, and staffed by qualified healthcare professionals providing primary care, vaccinations, and health education.",
      category: "healthcare",
      status: "ongoing",
      year: 2024,
      location: "India & Bangladesh",
      beneficiaries: 15000,
      budget: "$400,000",
      impact: [
        "5 mobile clinics operational",
        "15,000 patients treated monthly",
        "Vaccination campaigns reaching 3,000 children",
        "Telemedicine consultations available",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Global Health Initiative",
      duration: "36 months",
      completion: 40,
      fundingGoal: 4000000,
      fundsRaised: 1600000,
    },
    {
      id: "5",
      title: "Solar Power for Schools",
      description:
        "Installing solar energy systems in rural schools to enable digital learning.",
      longDescription:
        "Complete solar electrification project including solar panels, battery storage, LED lighting, and charging stations for electronic devices. Enables extended school hours and digital learning opportunities.",
      category: "energy",
      status: "completed",
      year: 2023,
      location: "Madagascar",
      beneficiaries: 1200,
      budget: "$75,000",
      impact: [
        "15 schools now have electricity",
        "1,200 students can study after dark",
        "Computer labs operational",
        "LED lighting in all classrooms",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Solar Education Network",
      duration: "8 months",
      fundingGoal: 750000,
      fundsRaised: 750000,
    },
    {
      id: "6",
      title: "Women's Empowerment Centers",
      description:
        "Establishing training centers for women's economic empowerment and skills development.",
      longDescription:
        "Comprehensive program creating training centers where women learn vocational skills, business management, financial literacy, and leadership. Includes microfinance support and market linkage programs.",
      category: "community",
      status: "planned",
      year: 2025,
      location: "Ethiopia & Rwanda",
      beneficiaries: 2000,
      budget: "$180,000",
      impact: [
        "4 training centers planned",
        "2,000 women to receive training",
        "Microfinance program for 500 women",
        "Local market cooperatives establishment",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Women's Development Coalition",
      duration: "18 months",
      fundingGoal: 1800000,
      fundsRaised: 450000,
    },
    {
      id: "7",
      title: "Emergency Food Distribution",
      description:
        "Providing immediate food relief and nutrition support during crisis situations.",
      longDescription:
        "Rapid response program providing nutritious meals, emergency food packages, and nutrition education in crisis-affected areas. Includes partnerships with local food producers and sustainable supply chains.",
      category: "community",
      status: "ongoing",
      year: 2024,
      location: "Somalia & South Sudan",
      beneficiaries: 8000,
      budget: "$250,000",
      impact: [
        "8,000 people receiving food aid",
        "Nutrition programs for 1,500 children",
        "Local farmer partnerships established",
        "Emergency response network created",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "World Food Network",
      duration: "12 months",
      completion: 70,
      fundingGoal: 2500000,
      fundsRaised: 1750000,
    },
    {
      id: "8",
      title: "Digital Learning Initiative",
      description:
        "Implementing technology-based education solutions in remote schools.",
      longDescription:
        "Comprehensive digital education program including tablets, educational software, internet connectivity, and teacher training. Focus on STEM education and digital literacy for rural students.",
      category: "education",
      status: "completed",
      year: 2022,
      location: "Vietnam & Cambodia",
      beneficiaries: 3500,
      budget: "$120,000",
      impact: [
        "20 schools equipped with digital tools",
        "3,500 students accessing online learning",
        "100 teachers trained in digital pedagogy",
        "Satellite internet connectivity established",
      ],
      image: "water",
      gallery: ["water", "water", "water"],
      partner: "Tech for Education",
      duration: "15 months",
      fundingGoal: 1200000,
      fundsRaised: 1200000,
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
        category: (newProject.category as ProjectCategory) || "water",
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
        category: "water",
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
        return "bg-green-500";
      case "ongoing":
        return "bg-blue-500";
      case "planned":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
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
              Our Projects
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Creating Impact Through{" "}
              <span className="text-primary">Meaningful Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover how we're transforming communities worldwide through
              sustainable development projects that create lasting positive
              change.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {filteredProjects.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Projects
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
                  Lives Impacted
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
              <h2 className="text-xl font-semibold">Filter Projects</h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
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
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Project Title</Label>
                          <Input
                            id="title"
                            value={newProject.title}
                            onChange={(e) =>
                              setNewProject((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Enter project title"
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
                          placeholder="Brief project description"
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
                          placeholder="Detailed project description"
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
                            placeholder="Project location"
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
                        Add Project
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
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more projects.
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
              Want to Support Our Projects?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join our mission to create lasting positive change. Your
              membership helps fund these life-changing projects and empowers
              communities worldwide.
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
