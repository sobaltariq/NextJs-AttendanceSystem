import MyApi from "@/api/MyApi";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import {
  initialImageToggleCall,
  setAppMainLoader,
  toggleProfilePic,
} from "@/redux/features/globalSlicer";
import { MyProfileInterface } from "@/types/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useProfile = () => {
  const [profile, setProfile] = useState<MyProfileInterface | null>(null);

  // to show any message popup
  const { showMessageModal } = useMessageModal();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    dispatch(setAppMainLoader(true));
    const isProfilePicVisible = localStorage.getItem("profilePicStatus");
    if (isProfilePicVisible == "false") {
      toggleProfilePic(false);
    }

    const getMyProfile = async () => {
      try {
        const response = await MyApi.get("users/profile");
        if (isMounted) {
          console.log(response.data.user);
          setProfile(response.data.user);
        }
      } catch (err: any) {
        if (isMounted) {
          const errorMessage =
            err.response?.data?.error?.msg ||
            err.response?.data?.error ||
            "Register Error";
          showMessageModal("error", errorMessage, 5000);
          console.log("Error Response:", errorMessage);
        }
      } finally {
        if (isMounted) {
          dispatch(initialImageToggleCall());
          dispatch(setAppMainLoader(false));
        }
      }
    };

    getMyProfile();

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, []);

  return { profile };
};
