import Layout from "@/components/Layout";
import NGOImage from "@/components/NGOImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Heart,
  Eye,
  Target,
  Users,
  Globe,
  Award,
  Calendar,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Building,
  Network,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Network,
      title: "Networking",
      description:
        "We believe in the power of connections. Building meaningful relationships between entrepreneurs, mentors, and industry leaders.",
    },
    {
      icon: CheckCircle,
      title: "Innovation",
      description:
        "Fostering creative thinking and innovative solutions to modern challenges through collaborative entrepreneurship.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description:
        "Supporting sustainable business growth and personal development through mentorship, resources, and strategic guidance.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Creating an inclusive community where young entrepreneurs can learn, collaborate, and succeed together.",
    },
  ];

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Serial entrepreneur with 3 successful exits. Alex founded YEN to bridge the gap between ambitious young entrepreneurs and the networks they need to succeed.",
      image: "community",
      email: "alex@yen.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Maya Patel",
      role: "Co-Founder & Head of Mentorship",
      bio: "Former venture capitalist turned entrepreneur advocate. Maya oversees our mentorship programs and connects entrepreneurs with industry experts.",
      image: "community",
      email: "maya@yen.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Jordan Williams",
      role: "Head of Community & Events",
      bio: "Community builder passionate about creating meaningful connections. Jordan leads our networking events and digital community platform.",
      image: "community",
      email: "jordan@yen.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Dr. Sarah Kim",
      role: "Head of Innovation Programs",
      bio: "Former startup accelerator director with a PhD in Business Innovation. Sarah develops our educational content and innovation challenges.",
      image: "community",
      email: "sarah@yen.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Marcus Johnson",
      role: "Head of Strategic Partnerships",
      bio: "Former corporate strategist who builds bridges between YEN members and established businesses, investors, and industry leaders.",
      image: "community",
      email: "marcus@yen.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Technology & Platform",
      bio: "Tech entrepreneur and software architect who leads the development of our digital platform and community tools.",
      image: "community",
      email: "lisa@yen.org",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "YEN Foundation",
      description:
        "Young Entrepreneur Network was founded by Alex Chen and Maya Patel with a vision to connect young entrepreneurs globally.",
      impact: "Initial community of 50 entrepreneurs",
      icon: Building,
    },
    {
      year: "2020",
      title: "First Virtual Summit",
      description:
        "Launched our flagship annual summit during the pandemic, connecting 500+ young entrepreneurs virtually.",
      impact: "500+ entrepreneurs, 50 mentors connected",
      icon: Network,
    },
    {
      year: "2021",
      title: "Mentorship Program Launch",
      description:
        "Introduced our structured mentorship program matching experienced entrepreneurs with emerging ones.",
      impact: "100 mentor-mentee pairs, 85% success rate",
      icon: Users,
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Expanded to 15 countries with local chapters and regional coordinators supporting local entrepreneur ecosystems.",
      impact: "15 countries, 2,000+ active members",
      icon: Globe,
    },
    {
      year: "2023",
      title: "Innovation Challenges",
      description:
        "Launched monthly innovation challenges and pitch competitions with real investment opportunities.",
      impact: "$500K in funding secured for members",
      icon: Lightbulb,
    },
    {
      year: "2024",
      title: "Digital Platform 2.0",
      description:
        "Launched our comprehensive digital platform with networking tools, resource library, and collaboration features.",
      impact: "5,000+ platform users, 1,000+ active daily",
      icon: TrendingUp,
    },
  ];

  const stats = [
    { label: "Years Active", value: "5+", icon: Calendar },
    { label: "Countries", value: "15", icon: Globe },
    { label: "Active Members", value: "5,000+", icon: Users },
    { label: "Success Stories", value: "500+", icon: Heart },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              About YEN
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empowering Young Entrepreneurs Through{" "}
              <span className="text-primary">Strategic Networking</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Since 2019, we've been dedicated to connecting ambitious young entrepreneurs 
              with the networks, mentorship, and resources they need to transform innovative 
              ideas into successful ventures.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To empower young entrepreneurs worldwide by providing comprehensive 
                    networking opportunities, mentorship programs, and collaborative 
                    platforms that foster innovation, sustainable business growth, and 
                    economic impact in the digital age.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    A world where young entrepreneurs have access to the networks, 
                    resources, and opportunities they need to transform ideas into 
                    successful ventures that create positive change and drive economic 
                    growth globally.
                  </p>
                </div>
              </div>

              <Button size="lg" asChild>
                <Link to="/projects">
                  Explore Our Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <NGOImage
                type="about"
                alt="YEN community networking event"
                className="w-full aspect-square object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide every connection we facilitate and every 
              program we develop for young entrepreneurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet the Leaders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team of entrepreneurs, business leaders, and innovation 
              experts brings together diverse expertise to support the next generation 
              of business leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <NGOImage
                    type={member.image as any}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 pt-2 border-t">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    <a
                      href={member.linkedin}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={member.twitter}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Our Journey</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Milestones & Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From our founding to becoming a global network for young entrepreneurs, 
              here's our journey of building connections and fostering innovation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={index} className="relative">
                    {/* Timeline line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-8 top-16 w-px h-20 bg-border" />
                    )}

                    <div className="flex items-start space-x-6">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-bold"
                        >
                          {milestone.year}
                        </Badge>
                      </div>

                      <Card className="flex-1 p-6">
                        <CardContent className="p-0 space-y-3">
                          <h3 className="text-xl font-semibold">
                            {milestone.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {milestone.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              {milestone.impact}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join Our Network</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Become part of our global community of young entrepreneurs. Together, 
              we can build the connections that will drive innovation and create 
              the next generation of successful businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/membership">
                  Become a Member
                  <Heart className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
