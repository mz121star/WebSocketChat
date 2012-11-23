using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Web_Sockets_Test___Server.MessageType
{
   public class UserListMessage:IMessageType
    {
        public int TypeId
        {
            get { return Convert.ToInt32(MTypeEnum.UserListMessage); }
        }

        public IList<string> UserName { get; set; }
    }
}
