"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import { FormType } from "@/types";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px] animate-scaleIn">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl p-2">
            <Image 
              src="/logo.png" 
              alt="SkillSync Logo" 
              width={52} 
              height={52}
              className="object-contain rounded-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-primary-100 font-bold text-2xl">SkillSync</h2>
            <p className="text-primary-200/80 text-sm">AI Interview Platform</p>
          </div>
        </div>

        <div className="text-center animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-2">
            {isSignIn ? "Welcome back to SkillSync" : "Join SkillSync today"}
          </h3>
          <p className="text-light-100 leading-relaxed">
            Practice job interviews with AI-powered feedback and improve your skills
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form animate-slideUp"
            style={{ animationDelay: '0.1s' }}
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In to SkillSync" : "Create SkillSync Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {isSignIn ? "New to SkillSync?" : "Already have a SkillSync account?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary-100 ml-2 hover:text-primary-200 transition-colors duration-300"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;