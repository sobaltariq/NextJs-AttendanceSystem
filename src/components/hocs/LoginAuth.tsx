import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const loggedInToken = localStorage.getItem("loggedInToken");
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInToken && !loggedInUser && pathname !== "/register") {
        router.push("/login");
      }
    }, [router, pathname]);

    useEffect(() => {
      const loggedInToken = localStorage.getItem("loggedInToken");
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (
        loggedInToken &&
        loggedInUser &&
        (pathname === "/register" || pathname === "/login")
      ) {
        router.push("/profile");
      }
    }, [router, pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default LoginAuth;
