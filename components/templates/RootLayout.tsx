import { ReactNode } from "react";


const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 overflow-y-auto">
      {children}
    </div>
  );
};

export default RootLayout;