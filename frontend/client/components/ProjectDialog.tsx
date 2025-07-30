import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NGOImage from "@/components/NGOImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  CheckCircle,
  Clock,
  Gift,
  IndianRupee,
  User,
  CreditCard,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { donationService, type DonationData } from "@/lib/donationService";
import { generateDonationCertificateForData } from "@/lib/donationCertificateGenerator";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  status: "completed" | "ongoing" | "planned";
  year: number;
  location: string;
  beneficiaries: number;
  budget: string;
  impact: string[];
  image: string;
  gallery: string[];
  partner?: string;
  duration: string;
  completion?: number;
  fundingGoal?: number;
  fundsRaised?: number;
}

interface ProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [projectDonations, setProjectDonations] = useState<DonationData[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserEmail(email);

    if (project) {
      // Filter donations for this project (if it was donated for this project)
      const allDonations = donationService.getAllDonations();
      const filtered = allDonations.filter(
        (donation) =>
          donation.purpose
            .toLowerCase()
            .includes(project.title.toLowerCase()) ||
          donation.purpose === "General Support",
      );
      setProjectDonations(filtered);
    }
  }, [project]);

  if (!project) return null;

  const isAdmin = userRole === "admin";
  const isLoggedIn = !!userRole;

  // Calculate project funding progress
  const fundingGoal = project.fundingGoal || 500000; // Default ₹5L goal
  const fundsRaised = projectDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );
  const fundingProgress = Math.min((fundsRaised / fundingGoal) * 100, 100);

  // User's own donations to this project
  const userDonations = projectDonations.filter(
    (donation) => donation.email === userEmail && !donation.isAnonymous,
  );
  const userTotalDonation = userDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );

  const getStatusColor = (status: string) => {
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{project.title}</span>
            <Badge className={`${getStatusColor(project.status)} text-white`}>
              {project.status === "ongoing"
                ? "In Progress"
                : project.status === "completed"
                  ? "Completed"
                  : "Planned"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh]">
            <TabsContent value="overview" className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <NGOImage
                  type={project.category as any}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.completion && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 rounded-full p-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Project Progress</span>
                        <span className="font-semibold">
                          {project.completion}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.beneficiaries.toLocaleString()} people</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{project.duration}</span>
                  </div>
                </div>

                {project.partner && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-1">Partner Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.partner}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Impact</h3>
                <div className="space-y-3">
                  {project.impact.map((impact, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {project.beneficiaries.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      People Impacted
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{project.budget}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Budget
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="funding" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Funding</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Funding Progress</span>
                    <span className="font-semibold">
                      {formatAmount(fundsRaised)} / {formatAmount(fundingGoal)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-primary h-4 rounded-full transition-all duration-300"
                      style={{ width: `${fundingProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {fundingProgress.toFixed(1)}% of funding goal reached
                  </p>
                </div>

                {/* User's donation summary (for members and logged users) */}
                {isLoggedIn && !isAdmin && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Your Contributions</h4>
                      {userTotalDonation > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            Total donated:{" "}
                            <span className="font-semibold text-primary">
                              {formatAmount(userTotalDonation)}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userDonations.length} donation
                            {userDonations.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          You haven't donated to this project yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Admin view - All donations */}
                {isAdmin && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      All Donations ({projectDonations.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {projectDonations.map((donation) => (
                        <Card key={donation.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                  <Gift className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {donation.isAnonymous
                                      ? "Anonymous"
                                      : donation.donorName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {donation.email} • {donation.donationDate}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <CreditCard className="h-3 w-3" />
                                    <span>{donation.paymentMethod}</span>
                                    {donation.panNumber && (
                                      <>
                                        <span>•</span>
                                        <span>PAN: {donation.panNumber}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  {formatAmount(donation.amount)}
                                </p>
                                <div className="flex space-x-1">
                                  {donation.certificateGenerated && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        generateDonationCertificateForData(
                                          donation,
                                        )
                                      }
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${project.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
