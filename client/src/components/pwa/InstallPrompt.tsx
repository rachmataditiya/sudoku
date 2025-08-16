import { useState } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, X, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installPWA();
    if (!success) {
      setDismissed(true);
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-sm bg-blue-600 text-white border-0 shadow-xl z-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Smartphone className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Install Sudoku Indonesia</h4>
            <p className="text-blue-100 text-xs mt-1">
              Install aplikasi untuk pengalaman yang lebih baik dan akses offline
            </p>
            
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-white text-blue-600 hover:bg-blue-50 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
                className="text-blue-100 hover:bg-blue-500 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}