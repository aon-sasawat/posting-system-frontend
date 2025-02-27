import { FC } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, useUserSignInMutation } from "@/redux/slice/user";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const SignInPageComponent: FC = () => {
  const [signIn] = useUserSignInMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (formValue: z.infer<typeof signInSchema>) => {
    const result = await signIn(formValue.username);
    if (result.data?.data?.id && result.data?.data?.username) {
      dispatch(setUser({ id: result.data.data.id, username: result.data.data.username }));
      router.push("/");
    }
  };

  return (
    <div className="fixed flex justify-between bg-green-500 min-h-screen w-full">
      <div className="flex items-center justify-center w-full">
        <div className="w-[384px]">
          <p className="text-[28px] text-white font-semibold">Sing in</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input className="bg-white w-[384px] mt-10 mb-2" placeholder="Username" {...register("username")} />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            <Button className="w-[384px] h-10 mt-4" type="submit">
              Sign In
            </Button>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-[42px] items-center justify-center bg-green-300 min-w-[632px] rounded-tl-[36px] rounded-bl-[36px]">
        <Image src="/assets/images/a-board-logo.png" alt="logo" width={300} height={230} />
        <p className="text-white font-castoro italic text-[28px]">a Board</p>
      </div>
    </div>
  );
};

export default SignInPageComponent;
