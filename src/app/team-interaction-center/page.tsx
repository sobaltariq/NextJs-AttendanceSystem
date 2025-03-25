"use client";
import MyApi from "@/api/MyApi";
import ChatBox from "@/components/interaction/ChatBox";
import UsersList from "@/components/interaction/UsersList";
import AppModal from "@/components/modal/AppModal";
import CreateGroupChatModal from "@/components/modal/CreateGroupChatModal";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import { RootState } from "@/redux/store";
import { UsersListInterface } from "@/types/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// get - all - user;
const TeamInteractionCenter: React.FC = () => {
  const [users, setUsers] = useState<UsersListInterface[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const [createGroupChatModel, setCreateGroupChat] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  const { userRole } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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
  const fetchGroups = async (signal: AbortSignal) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      if (!loggedInUser) {
        await showMessageModal("error", "Something Went Wrong");
        return;
      }
      const response = await MyApi.get(`/chats/get-groups`);
      const { success, totalUsers, users } = response.data;
      console.log("0000", response.data);

      if (success) {
        // setUsers(users);
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

    fetchGroups(signal);

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
    console.log("chatId", currentChatId);
  };

  return (
    <>
      <div className="width-container">
        <section className="interaction-container">
          <h2>Team Interaction Center</h2>
          {userRole == "admin" && (
            <button
              className="btn-primary"
              onClick={() => setCreateGroupChat(true)}
            >
              Create Group Chat
            </button>
          )}
          <div
            className="interaction-wrapper"
            data-chat={currentChatId == null}
          >
            <UsersList
              users={users}
              onUserSelect={handleUserSelect}
              setSelectedUserName={setSelectedUserName}
            />
            {currentChatId && selectedUserName && (
              <ChatBox
                currentChatId={currentChatId}
                selectedUserName={selectedUserName}
              />
            )}
          </div>
        </section>
      </div>

      <AppModal
        isOpen={createGroupChatModel}
        // isOpen={true}
        onClose={() => {
          setCreateGroupChat(false);
        }}
        title="Create Group Chat"
        children={
          <CreateGroupChatModal
            users={users}
            onClose={() => {
              setCreateGroupChat(false);
            }}
          />
        }
      />
    </>
  );
};

export default TeamInteractionCenter;
