import DevLogin from "@/components/dev-login";
import Integrate from "@/components/integrate";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSession } from "@/lib";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px] mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === "development" ? (
            <DevLogin />
          ) : (
            <Integrate
              name="login"
              provider="spotify"
              className={cn(buttonVariants(), "w-full")}
            >
              Login with Spotify
            </Integrate>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
