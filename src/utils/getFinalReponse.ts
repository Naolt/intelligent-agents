const getFinalResponse = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return lastMessage.tool_calls[0].args;
  }
  return lastMessage.content;
};

export default getFinalResponse;
