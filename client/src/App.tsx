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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm rounded-none border-t border-gray-200 mt-auto order-last sticky bottom-0 h-16">
            <TabsTrigger 
              value="game" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium"
            >
              <Calculator className="h-5 w-5" />
              Game
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium"
            >
              <BarChart3 className="h-5 w-5" />
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium"
            >
              <User className="h-5 w-5" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="flex-1 overflow-auto p-2 pb-20">
            <SudokuGame />
          </TabsContent>

          <TabsContent value="statistics" className="flex-1 overflow-auto p-2 pb-20">
            <Statistics />
          </TabsContent>

          <TabsContent value="profile" className="flex-1 overflow-auto p-2 pb-20">
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
