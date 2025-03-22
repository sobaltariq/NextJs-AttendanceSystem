"use client";
import MyApi from "@/api/MyApi";
import ChatBox from "@/components/interaction/ChatBox";
import UsersList from "@/components/interaction/UsersList";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import { UsersListInterface } from "@/types/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// get - all - user;
function TeamInteractionCenter() {
  const [users, setUsers] = useState<UsersListInterface[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const fetchUsers = async (signal: AbortSignal) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const response = await MyApi.get(`/users/get-all-user`);
      const { success, totalUsers, users } = response.data;
      // console.log("0000", response.data.users);

      if (success) {
        setUsers(users);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      showMessageModal("error", errorMessage, 5000);
      console.log("errorMessage", err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchUsers(signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const chatIdFromUrl = searchParams.get("chatId");
    if (chatIdFromUrl) {
      setCurrentChatId(chatIdFromUrl);
    }
  }, [searchParams]);

  const handleUserSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    // router.push(`/team-interaction-center?chatId=${chatId}`);

    console.log("chatId", currentChatId);
  };

  return (
    <div className="width-container">
      <section className="interaction-container">
        <h2>Team Interaction Center</h2>
        <div className="interaction-wrapper" data-chat={currentChatId == null}>
          <UsersList users={users} onUserSelect={handleUserSelect} />
          {currentChatId && <ChatBox currentChatId={currentChatId} />}
        </div>
      </section>
    </div>
  );
}

export default TeamInteractionCenter;
