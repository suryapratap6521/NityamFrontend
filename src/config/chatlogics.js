export const getSender=(loggedUser,users)=>{
  console.log(users, "users");
  console.log(loggedUser, "loggedUser");
  if (!users || users.length === 0 ) {
    return null; // Handle the case when users array is empty
  }
  console.log(users[0]._id, "users[0]._id");
    return users[0]?._id === loggedUser?._id ? (users[1].firstName + " "+ users[1].lastName ) : (users[0].firstName +" "+ users[0].lastName);
}

export const getSenderFull = (loggedUser, users) => {
  console.log(users, "users");
  console.log(loggedUser, "loggedUser");

  if (!users || users.length === 0 || users=== undefined) {
    return null; // Handle the case when users array is empty
  }
   
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    
};

  
  
export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 50;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 10;
    else return "auto";
  };

  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };