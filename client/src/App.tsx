import { useState } from "react";
import { useProfile } from "./lib/stores/useProfile";
import SudokuGame from "./components/sudoku/SudokuGame";
import Statistics from "./components/sudoku/Statistics";
import Profile from "./components/profile/Profile";
import ProfileSetup from "./components/profile/ProfileSetup";
import InstallPrompt from "./components/pwa/InstallPrompt";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Calculator, BarChart3, User } from "lucide-react";
import "@fontsource/inter";

function App() {
  const { profile, isProfileSetup } = useProfile();
  const [activeTab, setActiveTab] = useState("game");

  // Show profile setup if not set up yet
  if (!isProfileSetup || !profile) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              Sudoku
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Game puzzle angka yang menantang untuk mengasah kemampuan logika Anda
            </p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger 
              value="game" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Permainan
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Statistik
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-0">
            <SudokuGame />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-0">
            <Statistics />
          </TabsContent>

          <TabsContent value="profile" className="space-y-0">
            <Profile />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;
