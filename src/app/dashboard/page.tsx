import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { QrCode, BarChart2, ScanLine } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="grid gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>Welcome to QRify Pro</CardTitle>
                    <CardDescription>Your central hub for managing digital engagement tools.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Select a feature from the sidebar to get started.</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">QR Code Generator</CardTitle>
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Create secure, single-use QR codes.
                        </p>
                        <Button asChild size="sm" className="mt-4">
                           <Link href="/dashboard/qr-generator">Generate Code</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                        <BarChart2 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            (Coming Soon) Track scans and user engagement.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Dynamic Links</CardTitle>
                        <ScanLine className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <p className="text-xs text-muted-foreground">
                           (Coming Soon) Change QR destinations on the fly.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
