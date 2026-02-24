import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in with your identity to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated && adminLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Verifying admin access...</span>
            </div>
          )}

          {isAuthenticated && !adminLoading && !isAdmin && (
            <Alert variant="destructive">
              <AlertDescription>
                You do not have admin access. Please contact the site administrator.
              </AlertDescription>
            </Alert>
          )}

          {isLoginError && (
            <Alert variant="destructive">
              <AlertDescription>
                Login failed. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn || (isAuthenticated && adminLoading)}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure authentication via Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
