<<<<<<< HEAD
import { AuthProvider } from '@/src/contexts/AuthContext';

=======
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
export const dynamic = 'force-dynamic';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
=======
  return <>{children}</>;
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
}
