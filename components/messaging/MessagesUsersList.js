import React from 'react'
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import Moment from "react-moment";

export const MessagesUsersList = (props) => {
  const { currentAccount, userAddress } = props;

  const { data } = useMoralisQuery(
    "UserParticipationData",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );

  const { data: messages} = useMoralisQuery(
    "Messages",
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

    
  const getUsersList = (users) => {
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
        currentUser: lowerCaseCurrentAccount,
      };
    });
    
    const usersWithMessagesSorted = usersWithMessages?.sort((a, b) => {
      return b.messages.length - a.messages.length;
    });
    
    const usersWithMessagesSortedFiltered  = usersWithMessagesSorted?.filter((user) => {
      return user.messages.length > 0;
    });
    
    return usersWithMessagesSortedFiltered;
  };

  const usersList = getUsersList(users);

  const filteredUsersList = usersList?.filter((user) => {
    const lowerCaseUser = user.currentUser;
    const lowerCaseReceiver = user.messages[0].attributes.receiver;
    const lowerCaseSender = user.messages[0].attributes.sender;

    return lowerCaseUser === lowerCaseReceiver || lowerCaseUser === lowerCaseSender;
  });

  const messagesReceiver = filteredUsersList?.map((user) => {
    const lowerCaseUser = user.currentUser;
    const lowerCaseReceiver = user.messages[0].attributes.receiver;
    const lowerCaseSender = user.messages[0].attributes.sender;

    if (lowerCaseUser === lowerCaseReceiver) {
      return user.messages[0].attributes.sender;
    } else if (lowerCaseUser === lowerCaseSender) {
      return user.messages[0].attributes.receiver;
    }
  });
  
  const lastMessageContent = filteredUsersList?.map((user) => {
    return user.messages[user.messages.length - 1].attributes.message;
  });
  
  const lastMessageContentWithYou = lastMessageContent?.map((message, index) => {
    const lowerCaseUser = filteredUsersList[index].currentUser;
    const lowerCaseSender = filteredUsersList[index].messages[filteredUsersList[index].messages.length - 1].attributes.sender;
    if (lowerCaseUser === lowerCaseSender) {
      return "You : " + message;
    } else {
      return message;
    }
  });

  const lastMessageTimestamp = filteredUsersList?.map((user) => {
    return user.messages[user.messages.length - 1].attributes.createdAt;
  });

  return (
    <div className="inbox__users__mobile">
      <h2>All Conversations</h2>
      <div className="inbox__users__list">
        {filteredUsersList.map((user, index) => (
          <Link
            href={`/messages/${messagesReceiver[index]}`}
          >
            <div className="inbox__users__list__item">
              <div className="inbox__users__list__item__header">
                <div>
                  <span className="inbox__users__list__item__username">
                    {messagesReceiver[index].slice(0, 6) + "..." + messagesReceiver[index].slice(-6)}
                  </span>
                </div>
                <Moment 
                  fromNow 
                >
                  {lastMessageTimestamp[index]}
                </Moment>
              </div>
              <div className="inbox__users__list__item__message">
                <span>
                  <b>last message</b> : {' '}
                  <em>
                    {lastMessageContentWithYou[index]}
                  </em>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}