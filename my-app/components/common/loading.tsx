import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <Image
              src="/images/loading-1.gif" 
              alt="Loading" 
              width={100}
              height={100}
            />
        <div>Loading...</div>
    </div>
    )}