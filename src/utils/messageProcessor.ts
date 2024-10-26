const messageProcessor = (message: string) => {
  let msg = ``;
  if (message[0] == `"`) {
    msg += message;
  } else {
    msg += `"${message}`;
  }

  if (message[message.length - 1] != `"`) {
    msg += `"`;
  }

  return msg;
};

export default messageProcessor;
