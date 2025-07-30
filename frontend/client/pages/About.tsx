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
  Droplets,
  GraduationCap,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every community with empathy and understanding, putting human dignity at the center of everything we do.",
    },
    {
      icon: CheckCircle,
      title: "Transparency",
      description:
        "Open communication and accountability in all our operations, ensuring donors and communities can track our impact.",
    },
    {
      icon: TrendingUp,
      title: "Sustainability",
      description:
        "Creating long-term solutions that empower communities to become self-sufficient and thrive independently.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Working hand-in-hand with local communities, partners, and stakeholders to maximize our collective impact.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Founder & Executive Director",
      bio: "With over 15 years in international development, Sarah founded HopeHands to create sustainable change in underserved communities.",
      image: "community",
      email: "sarah@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "James Rodriguez",
      role: "Co-Founder & Operations Director",
      bio: "Former engineer turned humanitarian, James oversees our project implementation and ensures technical excellence in all initiatives.",
      image: "community",
      email: "james@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Dr. Amara Okafor",
      role: "Programs Director",
      bio: "With a PhD in Public Health, Amara leads our health and education programs across 12 countries with remarkable results.",
      image: "community",
      email: "amara@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Michael Chen",
      role: "Technology & Innovation Director",
      bio: "Michael brings Silicon Valley expertise to humanitarian work, developing innovative solutions for community development.",
      image: "community",
      email: "michael@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Elena Vasquez",
      role: "Community Partnerships Manager",
      bio: "Elena builds strong relationships with local communities and ensures our projects align with actual community needs.",
      image: "community",
      email: "elena@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Dr. Ahmed Hassan",
      role: "Research & Impact Assessment Lead",
      bio: "Ahmed measures and evaluates the long-term impact of our programs using data-driven methodologies.",
      image: "community",
      email: "ahmed@hopehands.org",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Foundation Established",
      description:
        "HopeHands NGO was founded by Dr. Sarah Mitchell and James Rodriguez with a mission to create sustainable change.",
      impact: "Initial team of 5 members",
      icon: Building,
    },
    {
      year: "2016",
      title: "First Water Project",
      description:
        "Successfully implemented our first clean water initiative in rural Kenya, serving 500 families.",
      impact: "500 families gained clean water access",
      icon: Droplets,
    },
    {
      year: "2017",
      title: "Education Program Launch",
      description:
        "Launched our education initiative, building the first school in Tanzania.",
      impact: "1 school built, 200 children enrolled",
      icon: GraduationCap,
    },
    {
      year: "2018",
      title: "Multi-Country Expansion",
      description:
        "Expanded operations to 5 countries across Africa and Southeast Asia.",
      impact: "5 countries, 2,000 families served",
      icon: Globe,
    },
    {
      year: "2019",
      title: "Housing Initiative",
      description:
        "Launched affordable housing program for displaced families.",
      impact: "50 homes built, 250 people housed",
      icon: Building,
    },
    {
      year: "2020",
      title: "COVID-19 Response",
      description:
        "Pivoted to provide emergency relief and healthcare support during the pandemic.",
      impact: "10,000 families received aid",
      icon: Heart,
    },
    {
      year: "2021",
      title: "Technology Integration",
      description:
        "Introduced mobile health clinics and digital learning platforms.",
      impact: "5 mobile clinics, 1,000 students online",
      icon: Target,
    },
    {
      year: "2022",
      title: "Major Recognition",
      description:
        "Received the International Humanitarian Excellence Award for sustainable development.",
      impact: "Global recognition, $2M in new funding",
      icon: Award,
    },
    {
      year: "2023",
      title: "Membership Program",
      description:
        "Launched global membership program to engage supporters worldwide.",
      impact: "500 active members globally",
      icon: Users,
    },
    {
      year: "2024",
      title: "25,000 Lives Impact",
      description:
        "Reached our milestone of positively impacting 25,000 lives across 12 countries.",
      impact: "25,000 lives impacted, 150+ projects completed",
      icon: CheckCircle,
    },
  ];

  const stats = [
    { label: "Years of Service", value: "9+", icon: Calendar },
    { label: "Countries", value: "12", icon: Globe },
    { label: "Team Members", value: "50+", icon: Users },
    { label: "Volunteer Hours", value: "100K+", icon: Heart },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              About HopeHands
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transforming Lives Through{" "}
              <span className="text-primary">Sustainable Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Since 2015, we've been dedicated to creating lasting positive
              change in underserved communities worldwide through education,
              clean water, housing, and healthcare initiatives.
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
                    To empower underserved communities worldwide by providing
                    sustainable solutions in education, clean water, housing,
                    and healthcare, while fostering local leadership and
                    long-term self-sufficiency.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    A world where every community has access to basic human
                    needs and the tools necessary to create thriving,
                    sustainable futures for generations to come.
                  </p>
                </div>
              </div>

              <Button size="lg" asChild>
                <Link to="/projects">
                  See Our Impact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <NGOImage
                type="about"
                alt="HopeHands mission in action"
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
              Our core values guide every decision we make and every project we
              undertake.
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
              Our dedicated team of professionals brings together expertise from
              diverse fields to drive meaningful change.
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
              From our humble beginnings to becoming a global force for good,
              here's our journey of impact.
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
            <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Become part of our global community of changemakers. Together, we
              can create an even greater impact in the years to come.
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
