import React, { useEffect } from 'react'

const DirectMessage = ({ messages }: { messages: string[] }) => {
  const Scroolmessage = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const domNode = Scroolmessage.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  })
  return (
    <div className='directmessage' ref={Scroolmessage}>

    </div>

  )
}
export default DirectMessage;