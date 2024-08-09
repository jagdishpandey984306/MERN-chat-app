import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { CREATE_CHANNEL_ROUTE } from "../../../../../../utils/constants";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAllContacts(response.data.contacts);
      } else {
        toast.error(response.data.message);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    if (channelName.length <= 0) {
      toast.error("Channelname is required");
    }

    if (selectedContacts.length < 0) {
      toast.error("Members is required");
    }

    if (channelName.length > 0 && selectedContacts.length > 0) {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setChannelName("");
        setSelectedContacts([]);
        setNewChannelModal(false);
        addChannel(response.data.channel);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg p-6 bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
