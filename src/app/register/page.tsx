// app/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/api/register", data);
      router.push("/products"); // রেজিস্ট্রেশন শেষে প্রোডাক্ট পেজে রিডাইরেক্ট
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        {/* অন্যান্য ফিল্ড যোগ করুন */}
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
        >
          Register
        </button>
      </form>
    </div>
  );
}
