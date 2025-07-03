
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FingerprintIcon, UserIcon, ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const tabValues = ['login', 'register']

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (tabValues.includes(hash)) {
      setTab(hash);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`);
  }, [tab]);

  useEffect(() => {
    if (user && !loading) {
      navigate("/elections");
    }
  }, [user, loading, navigate]);

  const handleTabs = () => {
    if(tab=='login') {
      setTab('register')
    }else {
      setTab('login')
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FingerprintIcon className="h-16 w-16 text-vote-blue animate-pulse mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-vote-blue">Secure Voter Authentication</h1>
          <p className="text-gray-600 mt-2">
            Access your personalized voting portal with multi-factor authentication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-2 order-2 md:order-1">
            <div className="bg-vote-light p-6 rounded-xl">
              <h2 className="text-xl font-bold text-vote-blue mb-4">Secure Multi-Factor Authentication</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <UserIcon className="h-5 w-5 text-vote-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vote-blue">Step 1: Account Verification</h3>
                    <p className="text-sm text-gray-600">
                      Sign in with your registered email and password
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <FingerprintIcon className="h-5 w-5 text-vote-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vote-blue">Step 2: Biometric Authentication</h3>
                    <p className="text-sm text-gray-600">
                      Verify your identity with your registered biometric data
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <ShieldCheckIcon className="h-5 w-5 text-vote-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-vote-blue">Step 3: Secure Access</h3>
                    <p className="text-sm text-gray-600">
                      Access your ballot and cast your vote securely
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 order-1 md:order-2">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onclick={handleTabs} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm onclick={handleTabs}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthPage;
