import React from 'react'
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";

export const MessagesUsersList = (props) => {
  const { userAddress } = props;

  const { data } = useMoralisQuery(
    "UserParticipationData",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );

  const user = data.find((user) => user.get("userAddress") === userAddress);

  // console.log("user", user);
  console.log("current /userAddress/", userAddress);

  return (
    <div>
      <div className="inbox__users__mobile">
      <h2>All Conversations</h2>
        <div className="inbox__users__list">
          {data.map((user) => (
            <Link href={`/messages/${user.get("userAddress")}`}>
              <div className="inbox__users__list__item">
                <div className="inbox__users__list__item__header">
                  <div>
                    <span className="inbox__users__list__item__username">{user.get("userAddress").slice(0, 5) + "..." + user.get("userAddress").slice(-5)}</span>
                  </div>
                  <span>2 hours ago</span>
                </div>
                <div className="inbox__users__list__item__message">
                  <p>Here will be displayed the last message</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}