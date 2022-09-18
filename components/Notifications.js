import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import NotificationIc from "./icons/Notification";

import { GetWallet_NonMoralis } from "../JS/local_web3_Moralis";
import React, { useState, useEffect, Fragment } from "react";

// import StarIcon from '@mui/icons-material/Star';


function Notifications() {
  const [dataNotifications, setDataNotifications] = useState([]);

  async function apis() {
    const connectedAddress = await GetWallet_NonMoralis();
    const dataNotifications = await fetch(
      `./api/api-getMyNotifications` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => {
        setDataNotifications(json)
      });
  }

  useEffect(() => {
    apis()
  }, [])

  /* const exampleData = [
    {
      Description: "hello hellohello hello hellohello hello hellohello hello hellohello",
      createdAt: "24.4.1996, 12:35 pm"
    },
    {
      Description: "world",
      createdAt: "24.4.1996, 12:35 pm"
    },
  ] */
  return (
    <List
      sx={{ width: '100%' }}
      aria-label="Notifications"
    >
      {dataNotifications.map((item) => (
        <ListItem disablePadding key={item.objectId}>
          <ListItemButton>
            <ListItemAvatar>
            { item.Read ? (
              <div className='notificationReadIc'>
                <NotificationIc />
              </div>
                
              ) : (
                <div className='notificationUnreadIc'>
                <NotificationIc />
              </div>
              )
            }
            </ListItemAvatar>
            <ListItemText 
            primary={item.Description} 
            secondary={
              <React.Fragment>
                {/*<Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  text
                </Typography>-->*/}
                {(new Date(item.createdAt)).toLocaleDateString() + ', ' + (new Date(item.createdAt)).toLocaleTimeString()}
              </React.Fragment> 
            }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default Notifications;
