import React from 'react'
import Link from "next/link";

export const MessagesUsersList = () => {
  return (
    <div>
      <div className="inbox__users__mobile">
      <h2>All Conversations</h2>
      <div className="inbox__users__list">
        <Link href={`/messages/1`} >
          <div className="inbox__users__list__item">
            <div className="inbox__users__list__item__header">
              <div>
                <span className="inbox__users__list__item__username">test</span>
                <span>(0xd...04e)</span>
              </div>
              <span>2 hours ago</span>
            </div>
            <div className="inbox__users__list__item__message">
              <p>Here will be displayed the last message</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
  )
}
