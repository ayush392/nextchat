import connect from "@/config/db";
import userModel from "@/models/user.model";
import Link from "next/link";
import { redirect } from "next/navigation";

const registerUser = async (formData: any) => {
  "use server";
  try {
    await connect();
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!fullName || !email || !password)
      throw new Error("please enter all fields");

    const res = await userModel.create({ fullName, email, password });
    if (!res) throw new Error("something went wrong");
    else redirect("/login");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default function Register() {
  return (
    <div className="container min-h-dvh flex justify-center items-center">
      <div className=" border max-w-md w-full rounded-md p-6">
        <h1 className="text-3xl font-bold mb-5 text-center">Register</h1>
        <form
          className=" flex flex-col justify-center w-[94%] mx-auto text-black"
          action={registerUser}
        >
          <div className=" mb-3">
            <label htmlFor="" className=" block text-gray-50">
              Full Name{" "}
            </label>
            <input
              className=" border p-1 block rounded w-[100%]"
              type="text"
              name="fullName"
              required
            />
          </div>
          <div className=" mb-3">
            <label htmlFor="" className=" block text-gray-50">
              Email{" "}
            </label>
            <input
              className=" border p-1 block rounded w-[100%]"
              type="email"
              name="email"
              required
            />
          </div>
          <div className=" mb-3">
            <label htmlFor="password" className=" block text-gray-50">
              Password{" "}
            </label>
            <input
              className=" border p-1 block rounded w-[100%]"
              type="password"
              name="password"
              required
            />
          </div>
          <button
            className=" bg-green-700 py-2 my-2 rounded font-semibold text-gray-50"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className=" text-center mt-3 text-gray-600">
          Already have an account?
          <Link href={"/login"} className=" text-green-600 ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
