import Chat from "../../../components/Chat";
import Ss from "../../../components/Ss";

type Props = {
  params: {
    id: string
  }
}

function ChatPage({ params: { id } }: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Ss />
      {/*Chat*/}
      <Chat chatId={id} />
    </div>
  );
}

export default ChatPage;
