import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Gift, 
  Download, 
  Calendar, 
  CreditCard, 
  User, 
  Phone, 
  MapPin,
  Receipt,
  Eye,
  X
} from "lucide-react";
import { donationService, type DonationData } from "@/lib/donationService";
import { generateDonationCertificateForData } from "@/lib/donationCertificateGenerator";

interface DonationHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

export default function DonationHistoryDialog({ open, onOpenChange, userEmail }: DonationHistoryDialogProps) {
  const userDonations = donationService.getAllDonations().filter(donation => 
    donation.email === userEmail
  );

  const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const certificatesAvailable = userDonations.filter(d => d.certificateGenerated).length;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const handleDownloadCertificate = async (donation: DonationData) => {
    try {
      await generateDonationCertificateForData(donation);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  const handleDownloadAllCertificates = async () => {
    const availableCertificates = userDonations.filter(d => d.certificateGenerated);
    
    if (availableCertificates.length === 0) {
      alert('No certificates available for download.');
      return;
    }

    try {
      for (const donation of availableCertificates) {
        await generateDonationCertificateForData(donation);
        // Add a small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Error generating some certificates. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>My Complete Donation History</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{formatAmount(totalDonated)}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Donated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{userDonations.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Donations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{certificatesAvailable}</div>
                <p className="text-sm text-muted-foreground mt-1">Certificates Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userDonations.length > 0 ? formatAmount(totalDonated / userDonations.length) : '₹0'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Average Donation</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownloadAllCertificates} disabled={certificatesAvailable === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download All Certificates ({certificatesAvailable})
            </Button>
            <Button variant="outline" asChild>
              <a href="/donate">
                <Gift className="mr-2 h-4 w-4" />
                Make New Donation
              </a>
            </Button>
          </div>

          <Separator />

          {/* Donations List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Donation History ({userDonations.length})</h3>
            
            {userDonations.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journey of giving by making your first donation.
                </p>
                <Button asChild>
                  <a href="/donate">
                    <Gift className="mr-2 h-4 w-4" />
                    Make Your First Donation
                  </a>
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                  {userDonations.map((donation, index) => {
                    const { date, time } = formatDateTime(donation.donationDate);
                    
                    return (
                      <Card key={donation.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <Gift className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-primary">
                                    {formatAmount(donation.amount)}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Donation #{index + 1} • ID: {donation.id}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={donation.certificateGenerated ? "secondary" : "destructive"}
                                  className="text-xs"
                                >
                                  {donation.certificateGenerated ? "Certificate Ready" : "Processing"}
                                </Badge>
                                {donation.certificateGenerated && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleDownloadCertificate(donation)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Receipt className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Purpose:</span>
                                  <span className="text-muted-foreground">{donation.purpose}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Date:</span>
                                  <span className="text-muted-foreground">{date}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Time:</span>
                                  <span className="text-muted-foreground">{time}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Payment:</span>
                                  <span className="text-muted-foreground capitalize">{donation.paymentMethod}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Donor:</span>
                                  <span className="text-muted-foreground">
                                    {donation.isAnonymous ? "Anonymous" : donation.donorName}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Phone:</span>
                                  <span className="text-muted-foreground">{donation.phone}</span>
                                </div>
                                
                                <div className="flex items-start space-x-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <span className="font-medium">Address:</span>
                                  <span className="text-muted-foreground">{donation.address}</span>
                                </div>
                                
                                {donation.panNumber && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Receipt className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">PAN:</span>
                                    <span className="text-muted-foreground">{donation.panNumber}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                  Member Account: {donation.memberAccountCreated ? "✓ Created" : "Not created"}
                                </span>
                                <span>
                                  Receipt: HOPE-{donation.id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
