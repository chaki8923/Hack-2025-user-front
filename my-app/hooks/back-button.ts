import { useRouter } from "next/navigation";

export const useBackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return handleBack;
};