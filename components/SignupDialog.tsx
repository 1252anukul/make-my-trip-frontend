"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signup, login } from "@/lib/api";
import { setUser } from "@/lib/userSlice";
import { useDispatch } from "react-redux";

const SignupDialog = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // SIGNUP
        const response = await signup({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
        });

        console.log("Signup success:", response);
        dispatch(setUser(response));
      } else {
        // LOGIN
        const response = await login(email, password);

console.log("Login success:", response);

// SAVE USER TO LOCAL STORAGE
localStorage.setItem("user", JSON.stringify(response));

dispatch(setUser(response));
      }

      setOpen(false);
      clearForm();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">
          Open Signup
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </DialogTitle>

          <DialogDescription>
            {isSignup
              ? "Join us to start booking your travels."
              : "Enter your credentials to access your account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 py-4">
          {isSignup && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-blue-600"
                onClick={() => setIsSignup(false)}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-blue-600"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;