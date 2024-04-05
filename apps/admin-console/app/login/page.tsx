import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NextPage } from "next"
import { cookies } from "next/headers"
import { createHash } from "crypto"
import { redirect } from "next/navigation"

const setPwdCookie = async (formData: FormData) => {
  'use server'

  const inputPassword = formData.get("password")
  if (typeof inputPassword !== "string") {
    return;
  }

  const inputPasswordHash = createHash("sha256").update("saltyPwd" + inputPassword).digest("hex")

  const cookieStore = cookies();
  cookieStore.set("rental-review-admin", inputPasswordHash)

  redirect("/");
};

const LoginPage: NextPage = () => (
  <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Rental Review Admin Console</h1>
          <p className="text-balance text-muted-foreground">
            Please enter the admin password below to continue
          </p>
        </div>
        <form className="grid gap-4" action={setPwdCookie}>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="sr-only">Password</Label>
            </div>
            <Input id="password" name="password" type="password" placeholder="Password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
    <div className="hidden bg-muted lg:block">
      <Image
        src="/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
)

export default LoginPage
