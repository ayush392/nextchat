import connect from "@/config/db";
import userModel from "@/models/user.model";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const loginUser = async (formData: any) => {
  "use server";
  try {
    await connect();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) throw new Error("please enter all fields");

    const res = await userModel.findOne({ email: formData.get("email") });
    if (!res) {
      throw new Error("User does not exist");
    }

    cookies().set({
      name: "nextChat",
      value: res._id,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 36000,
      path: "/",
    });
    redirect("/");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default function Login() {
  return (
    <div className="container min-h-dvh flex justify-center items-center">
      <div className=" border max-w-md w-full rounded-md p-6">
        <h1 className="text-3xl font-bold mb-5 text-center">Login</h1>
        <form
          className=" flex flex-col justify-center w-[94%] mx-auto text-black"
          action={loginUser}
        >
          <div className=" mb-3">
            <label htmlFor="" className=" block">
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
            <label htmlFor="password" className=" block">
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
            Login
          </button>
        </form>
        <p className=" text-center mt-3 text-gray-600">
          Do not have an account?{" "}
          <Link href={"/register"} className=" text-green-600 ml-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
