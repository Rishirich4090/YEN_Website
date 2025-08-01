import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Heart,
  CheckCircle,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  AlertCircle
} from "lucide-react";

// Redux imports
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { 
  sendContactMessage,
  clearError,
  selectContactLoading,
  selectContactError 
} from "../../src/redux/slices/contactSlice";
import { useToastHelpers } from "../../src/components/providers/ToastProvider";

export default function Contact() {
  const dispatch = useAppDispatch();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  
  // Redux state
  const isSubmitting = useAppSelector((state) => state.contact?.isLoading || false);
  const contactError = useAppSelector((state) => state.contact?.error || null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle contact errors
  useEffect(() => {
    if (contactError) {
      showErrorToast(contactError);
      dispatch(clearError());
    }
  }, [contactError, showErrorToast, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      })).unwrap();

      setIsSubmitted(true);
      showSuccessToast("Message sent successfully! We'll get back to you within 24 hours.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          subject: "General Inquiry",
          message: ""
        });
      }, 3000);
    } catch (error) {
      // Error is handled in useEffect above
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "YEN Headquarters",
        "Tech Hub, 4th Floor, Cyber City",
        "Gurgaon, Haryana 122002",
        "India"
      ]
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "Main: +91 11 4567-8900",
        "Support: +91 11 4567-8901", 
        "WhatsApp: +91 98765-43210"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "General: hello@yen.org.in",
        "Partnerships: partners@yen.org.in",
        "Media: press@yen.org.in"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours", 
      details: [
        "Monday - Friday: 9:00 AM - 7:00 PM",
        "Saturday: 10:00 AM - 5:00 PM",
        "Sunday: Closed",
        "Online Support: 24/7"
      ]
    }
  ];

  const socialMedia = [
    { icon: Facebook, name: "Facebook", url: "#", handle: "@YENIndia" },
    { icon: Twitter, name: "Twitter", url: "#", handle: "@YEN_India" },
    { icon: Instagram, name: "Instagram", url: "#", handle: "@yen_official" },
    { icon: Linkedin, name: "LinkedIn", url: "#", handle: "Young Entrepreneur Network" }
  ];

  const offices = [
    {
      region: "North India",
      location: "Delhi NCR",
      address: "Tech Hub, Cyber City, Gurgaon",
      phone: "+91 11 4567-8900",
      email: "delhi@yen.org.in"
    },
    {
      region: "West India",
      location: "Mumbai, Maharashtra", 
      address: "Business Center, Andheri East",
      phone: "+91 22 4567-8900",
      email: "mumbai@yen.org.in"
    },
    {
      region: "South India",
      location: "Bangalore, Karnataka",
      address: "Innovation Hub, Electronic City",
      phone: "+91 80 4567-8900",
      email: "bangalore@yen.org.in"
    },
    {
      region: "East India",
      location: "Kolkata, West Bengal",
      address: "Tech Park, Salt Lake City",
      phone: "+91 33 4567-8900", 
      email: "kolkata@yen.org.in"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">Get in Touch</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Let's Build Your Network{" "}
              <span className="text-primary">Together</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Have questions about entrepreneurship? Want to join our network? Looking for business partnerships? We'd love to connect with you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold">Send Us a Message</h2>
                </div>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  {isSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ngo-purple-light">
                          <CheckCircle className="h-6 w-6 text-ngo-purple" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold">Message Sent Successfully!</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        A confirmation email has been sent to our team.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Membership">Membership</option>
                          <option value="Partnership">Partnership Opportunity</option>
                          <option value="Mentorship">Mentorship Program</option>
                          <option value="Funding">Funding Support</option>
                          <option value="Events">Events & Networking</option>
                          <option value="Media">Media & Press</option>
                          <option value="Technical Support">Technical Support</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your entrepreneurial journey or how we can help you..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels. We're here to help!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-muted-foreground text-sm">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Follow Us</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {socialMedia.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium text-sm">{social.name}</div>
                            <div className="text-xs text-muted-foreground">{social.handle}</div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Visit Our Headquarters</h2>
            <p className="text-lg text-muted-foreground">
              Located in the heart of Global City, our headquarters welcomes visitors and partners.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <div
                className="aspect-video cursor-pointer hover:opacity-90 transition-opacity relative group"
                onClick={() => window.open('https://maps.google.com/?q=123+Hope+Street,+Suite+400,+Global+City,+State+12345', '_blank')}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.309!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Click to open in Google Maps
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-6 text-center">
              <Card className="inline-block">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">HopeHands NGO Headquarters</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">123 Hope Street, Suite 400, Global City, State 12345</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Global Presence</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Our Offices Worldwide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              With presence across major business hubs in India, we're always close to the entrepreneurial communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <Badge variant="secondary">{office.region}</Badge>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{office.location}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{office.address}</p>
                      <p className="flex items-center justify-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{office.phone}</span>
                      </p>
                      <p className="flex items-center justify-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{office.email}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Expand Your Network?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Whether you want to join our community, partner with us, or access mentorship, we're here to help you grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <a href="/membership">
                  Join Our Network
                  <Heart className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href="/projects">View Our Programs</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
