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
  Network,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function Index() {
  const stats = [
    { label: "Entrepreneurs Connected", value: "5,000+", icon: Users },
    { label: "Programs Delivered", value: "50+", icon: Target },
    { label: "Countries Reached", value: "15", icon: Globe },
    { label: "Success Stories", value: "500+", icon: Heart },
  ];

  const projects = [
    {
      title: "Networking Meetups",
      description: "Monthly in-person and virtual networking events for young entrepreneurs",
      impact: "500+ connections made",
      image: "/placeholder.svg",
      category: "Networking",
      icon: Network,
    },
    {
      title: "Mentorship Program",
      description: "One-on-one mentoring with successful entrepreneurs and industry experts",
      impact: "200+ mentorships active",
      image: "/placeholder.svg",
      category: "Mentorship",
      icon: Users,
    },
    {
      title: "Innovation Challenges",
      description: "Monthly pitch competitions and innovation challenges with real prizes",
      impact: "$500K in funding secured",
      image: "/placeholder.svg",
      category: "Innovation",
      icon: Lightbulb,
    },
  ];

  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Startup Founder",
      content:
        "YEN connected me with my co-founder and our first investor. The network is incredibly valuable for any young entrepreneur.",
      rating: 5,
      image: "/placeholder.svg",
    },
    {
      name: "Sarah Kim",
      role: "Tech Entrepreneur",
      content:
        "The mentorship program at YEN has been game-changing. My mentor helped me scale my business from idea to $1M revenue.",
      rating: 5,
      image: "/placeholder.svg",
    },
    {
      name: "Marcus Chen",
      role: "E-commerce Founder",
      content:
        "YEN's innovation challenges pushed me to think bigger. I won funding and gained invaluable feedback from industry experts.",
      rating: 5,
      image: "/placeholder.svg",
    },
  ];

  const howToJoin = [
    {
      step: "1",
      title: "Submit Application",
      description:
        "Fill out our membership form with your entrepreneurial background and goals",
      icon: BookOpen,
    },
    {
      step: "2",
      title: "Community Review",
      description:
        "Our team reviews your application and invites you to a brief interview",
      icon: CheckCircle,
    },
    {
      step: "3",
      title: "Welcome to YEN",
      description:
        "Access our platform, attend events, connect with mentors, and start building your network",
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
                  Empowering Young Entrepreneurs
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Network is the new{" "}
                  <span className="text-primary">Networth</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join YEN (Young Entrepreneur Network) to connect with like-minded 
                  entrepreneurs, access world-class mentorship, and build the 
                  relationships that will transform your business ideas into reality.
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
                  <Link to="/projects">View Our Programs</Link>
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
                  alt="YEN young entrepreneurs networking"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Network className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">5,000+</div>
                    <div className="text-sm text-muted-foreground">
                      Entrepreneurs Connected
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
                alt="About YEN - Young Entrepreneur Network"
                className="w-full aspect-video object-cover rounded-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="outline">Our Mission</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Building Networks, Creating Success
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in 2019, YEN (Young Entrepreneur Network) is dedicated to 
                  empowering the next generation of business leaders through strategic 
                  networking, mentorship, and collaborative opportunities.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Global Network Access</h3>
                    <p className="text-muted-foreground">
                      Connect with 5,000+ young entrepreneurs across 15 countries 
                      and build valuable business relationships.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Expert Mentorship</h3>
                    <p className="text-muted-foreground">
                      Get paired with successful entrepreneurs and industry leaders 
                      who provide personalized guidance and support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Real Investment Opportunities</h3>
                    <p className="text-muted-foreground">
                      Participate in pitch competitions and innovation challenges 
                      with access to real funding opportunities.
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
            <h2 className="text-3xl md:text-4xl font-bold">Current Programs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how we're empowering young entrepreneurs through our 
              innovative programs and networking opportunities.
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
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
              <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Your Network?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of entrepreneurs who are building valuable connections 
                and scaling their businesses through our network.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Become a Member
                </Button>
                <Button size="lg" variant="outline">
                  Explore Our Programs
                </Button>
              </div>
            </div>
          </div>
        </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">What People Say</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Entrepreneur Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about how YEN has accelerated 
              their entrepreneurial journey.
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
