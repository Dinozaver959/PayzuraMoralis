import React from 'react'
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";

export const MessagesUsersList = (props) => {
  const { currentAccount } = props;

  const { data } = useMoralisQuery(
    "UserParticipationData",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );

  const lowerCaseCurrentAccount = currentAccount.toLowerCase();

  const users = data?.filter((user) => {
    const lowerCaseUser = user.attributes.userAddress.toLowerCase();
    return lowerCaseUser !== lowerCaseCurrentAccount;
  });

  const { data: messages} = useMoralisQuery(
    "Messages",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );

  const usersWithMessages = users?.map((user) => {
    const lowerCaseUser = user.attributes.userAddress.toLowerCase();
    const userMessages = messages?.filter((message) => {
      const lowerCaseSender = message.attributes.sender.toLowerCase();
      const lowerCaseReceiver = message.attributes.receiver.toLowerCase();
      return lowerCaseSender === lowerCaseUser || lowerCaseReceiver === lowerCaseUser;
    });
    return {
      ...user,
      messages: userMessages,
    };
  });

  // future features to add:
  // - sort users' list by last message sent/received
  // - show last message's content of each user
  // - show last message's timestamp of each user
  // - show unread messages
  
  return (
    <div>
      <div className="inbox__users__mobile">
      <h2>All Conversations</h2>
        <div className="inbox__users__list">
          {users.map((user) => (
            <Link href={`/messages/${user.get("userAddress")}`}>
              <div className="inbox__users__list__item">
                <div className="inbox__users__list__item__header">
                  <div>
                    <span className="inbox__users__list__item__username">{user.get("userAddress").slice(0, 5) + "..." + user.get("userAddress").slice(-5)}</span>
                  </div>
                  <span>2 hours ago</span>
                </div>
                <div className="inbox__users__list__item__message">
                  <span>Hey, how are you?</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}