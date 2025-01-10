import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import { resetPassword } from "@/hooks/auth/useAuth";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");
  const role = searchParams.get("role");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRestPassword = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (password) => resetPassword(password, resetToken, role),
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Password reset successfully",
        type: "success",
      });
      navigate("/auth/sign-in");
    },
    onError: (message) => {
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      });
    },
  });

  const initiatePasswordReset = () => {
    const missingFields = Object.entries(formData)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      const errorMessages = missingFields.map((field) => {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return `${formattedField} is required`;
      });

      const formattedErrors = errorMessages.map((msg) => `• ${msg}`).join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Password mis-match",
        type: "error",
      });
      return;
    }

    handleRestPassword.mutate(formData.password);
  };

  return (
    <section className="flex w-screen font-poppins h-screen md:flex justify-center items-center">
      <figure className="h-full w-full hidden md:block md:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FLoginImage.svg?alt=media&token=c7452bf9-0b3a-4358-bef0-cd1bfa57e80f"
        />
      </figure>
      <div className=" flex justify-center h-full w-1/2 items-center m-4">
        <div className="min-w-screen bg-white h-auto w-[400px] rounded-2xl border-2 border-teal-700 p-10">
          <div className="text-center mt-5 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2FGroup%20427320755.svg?alt=media&token=02f2a096-b50a-4618-b9fb-a333f0c2aac0"
              alt="Logo"
              className="mx-auto flex h-20 w-20"
            />
            <h2 className="mt-8 text-[18px] font-medium text-black ">
              Reset Password
            </h2>
            <p className="text-zinc-500 mt-5 font-poppins">
              Enter your new password
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="p-4 py-6">
              <div className="grid gap-6 mb-8">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new Password"
                  className="border border-gray-300 bg-slate-200 outline-none focus:outline-none rounded-xl p-3"
                />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleInputChange}
                  placeholder="Confirm new Password"
                  className="border border-gray-300 bg-slate-200 outline-none focus:outline-none rounded-xl p-3"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <Button
                  className="bg-teal-700 hover:bg-teal-900 rounded-2xl text-white font-bold p-3 mb-12 w-full focus:outline-none focus:shadow-outline"
                  onClick={initiatePasswordReset}
                >
                  {handleRestPassword.isPending
                    ? `Resetting password...`
                    : `Reset Password`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
