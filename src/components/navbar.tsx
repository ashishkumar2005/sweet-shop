"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#fff7f2]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mithai-icon.png"
              alt="Mithai Mahal"
              width={32}
              height={32}
            />
            <span className="font-display text-xl font-bold text-primary">
              Mithai Mahal
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            {/* CART */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user.name}
                      </div>
                      <div className="px-2 py-1 text-xs text-muted-foreground">
                        {user.email}
                      </div>

                      {user.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    {/* LOGIN (TEXT) */}
                    <Link
                      href="/login"
                      className="text-sm font-medium hover:text-primary transition"
                    >
                      Login
                    </Link>

                    {/* SIGN UP (RED CTA) */}
                    <Link href="/register">
                      <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* MENU ICON */}
            <button
              className="p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/#sweets" onClick={() => setMobileMenuOpen(false)}>
                Sweets
              </Link>

              {user && (
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                  Orders
                </Link>
              )}

              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}

              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}