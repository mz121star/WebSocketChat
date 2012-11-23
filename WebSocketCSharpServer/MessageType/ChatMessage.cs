using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Web_Sockets_Test___Server.MessageType
{
    public class ChatMessage:IMessageType
    {
         
        public int TypeId
        {
            get { return Convert.ToInt32(MTypeEnum.MessageContent); }
        }

        public string FromName { get; set; }
        public string MessageContent { get; set; }

    }
}
