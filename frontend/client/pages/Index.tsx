import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import NGOImage from "@/components/NGOImage";
import {
  Heart,
  Users,
  Globe,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  BookOpen,
  Droplets,
  Home,
  GraduationCap,
} from "lucide-react";

export default function Index() {
  const stats = [
    { label: "Lives Impacted", value: "25,000+", icon: Users },
    { label: "Projects Completed", value: "150+", icon: Target },
    { label: "Countries Reached", value: "12", icon: Globe },
    { label: "Active Members", value: "500+", icon: Heart },
  ];

  const projects = [
    {
      title: "Clean Water Initiative",
      description: "Providing clean drinking water to rural communities",
      impact: "5,000 families served",
      image: "/placeholder.svg",
      category: "Water",
      icon: Droplets,
    },
    {
      title: "Education for All",
      description: "Building schools and providing educational resources",
      impact: "15 schools built",
      image: "/placeholder.svg",
      category: "Education",
      icon: GraduationCap,
    },
    {
      title: "Housing Project",
      description: "Constructing affordable homes for displaced families",
      impact: "200 homes built",
      image: "/placeholder.svg",
      category: "Housing",
      icon: Home,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Leader",
      content:
        "HopeHands transformed our village with their clean water project. The impact has been life-changing for thousands of families.",
      rating: 5,
      image: "/placeholder.svg",
    },
    {
      name: "Michael Chen",
      role: "Volunteer Member",
      content:
        "Being part of HopeHands has been incredibly rewarding. Together, we're making a real difference in communities worldwide.",
      rating: 5,
      image: "/placeholder.svg",
    },
    {
      name: "Dr. Amara Okafor",
      role: "Project Coordinator",
      content:
        "The dedication and professionalism of HopeHands is outstanding. Every project is executed with care and transparency.",
      rating: 5,
      image: "/placeholder.svg",
    },
  ];

  const howToJoin = [
    {
      step: "1",
      title: "Apply for Membership",
      description:
        "Fill out our membership form with your details and motivation",
      icon: BookOpen,
    },
    {
      step: "2",
      title: "Approval Process",
      description:
        "Our admin team reviews your application within 3-5 business days",
      icon: CheckCircle,
    },
    {
      step: "3",
      title: "Welcome to the Team",
      description:
        "Access your dashboard, get your certificate, and start making an impact",
      icon: Heart,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Making a Global Impact
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Empowering Communities Through{" "}
                  <span className="text-primary">Compassionate Action</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join HopeHands in creating sustainable change across the
                  globe. Together, we build better futures through education,
                  clean water, housing, and community development.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/membership">
                    Become a Member
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/projects">View Our Projects</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <NGOImage
                  type="hero"
                  alt="HopeHands community impact"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Heart className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">25,000+</div>
                    <div className="text-sm text-muted-foreground">
                      Lives Changed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NGO Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <NGOImage
                type="about"
                alt="About HopeHands"
                className="w-full aspect-video object-cover rounded-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="outline">Our Mission</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Building Hope, One Community at a Time
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in 2015, HopeHands is dedicated to creating lasting
                  positive change in underserved communities worldwide. We
                  believe in the power of collective action and sustainable
                  development.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Transparent Operations</h3>
                    <p className="text-muted-foreground">
                      Every donation and project is tracked with full
                      transparency and regular reporting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Community-Driven Approach</h3>
                    <p className="text-muted-foreground">
                      We work directly with local communities to identify and
                      address their most pressing needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Sustainable Impact</h3>
                    <p className="text-muted-foreground">
                      Our projects are designed for long-term sustainability and
                      community ownership.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Projects Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Our Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Current Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how we're making a difference in communities around the
              world through our ongoing initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <NGOImage
                      type={project.image as any}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/90">
                        <Icon className="h-3 w-3 mr-1" />
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {project.impact}
                      </span>
                      <Button size="sm" variant="ghost">
                        Learn More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Join Our Mission</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              How to Become a Member
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Joining HopeHands is simple. Follow these steps to become part of
              our global community of changemakers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howToJoin.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/membership">
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">What People Say</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Member Testimonials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about the impact we're creating
              together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="h-8 w-8 text-muted-foreground/20 absolute -top-2 -left-2" />
                    <p className="text-muted-foreground italic leading-relaxed pl-6">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <NGOImage
                      type={testimonial.image as any}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join thousands of passionate individuals who are changing lives
              and building stronger communities around the world. Together, we
              can create lasting impact.
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
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
