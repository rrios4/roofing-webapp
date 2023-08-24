import React from 'react';
import DefaultPageHeader from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type Props = {};

export default function LoginPage({}: Props) {
  const navigate = useNavigate()
  const auth = useAuth();
  const { toast } = useToast();

  const handleGoogleSignin = async (e: any) => {
    e.preventDefault();
    // @ts-ignore
    const loginWithGoogle = await auth.googleLogin();

    if (loginWithGoogle.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: `${loginWithGoogle.error.message}`,
      })
    } else {
      navigate('/')
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* <DefaultPageHeader title='Customers' subheading='Manage all customers for you company' addItemTextButton='Add login item'/> */}
      <div className="flex justify-center w-screen-xl mx-auto mt-[100px] sm:mt-[180px]">
        <div className="text-center">
          <div className="flex">
            <div className="w-[60px] shadow-md bg-blue-600 rounded-2xl mx-auto mb-4">
              <img src="/assets/LogoRR.png" className="shadow-xs p-[2px]" />
            </div>
          </div>
          <p className="font-[600] text-[30px] mb-2">Log in to your account</p>
          <p className="text-muted-foreground text-[16px] mb-6 font-[400]">
            Welcome to "The Roofing App" to empower your business. 🚀
          </p>
          <form onSubmit={handleGoogleSignin}>
            <Button variant={'outline'} className="w-full" type="submit">
              <img
                src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
                className="mr-2 h-4 w-4"
              />{' '}
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
