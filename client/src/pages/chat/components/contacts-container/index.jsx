import React, { useEffect } from "react";
import Logo from "@/components/ui/Logo";
import Title from "@/components/ui/Title";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";
import CreateChannel from "./components/create-channel";
import { GET_USER_CHANNELs_ROUTE } from "../../../../utils/constants";

const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });

      if (response.data.success) {
        setDirectMessagesContacts(response.data.contacts);
      } else {
        toast.error(response.data.message);
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELs_ROUTE, {
        withCredentials: true,
      });

      if (response.data.success) {
        setChannels(response.data.channels);
      } else {
        toast.error(response.data.message);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;
