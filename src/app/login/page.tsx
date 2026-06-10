// src/app/login/page.tsx
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement the sign-in form using Server Actions */}
          {/* Hint: Auth.js v5 recommends using Server Actions for sign in within App Router.
              You can wrap the Button in a <form> with an action that calls NextAuth's signIn. */}
          <form
            action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/" })
            }}
          >
            <Button className="w-full" type="submit">
              {/* TODO: Change this label depending on your chosen provider */}
              Sign in with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
