using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebSocketServer;
using System.Web.Script.Serialization;
using Web_Sockets_Test___Server.MessageType;

namespace Web_Sockets_Test___Server
{
     public  class ChatServerCore
     {
        
         public static string GetUserList(List<SocketConnection> connectionSocketList)
         {
              UserListMessage userListMessage = new UserListMessage();
              userListMessage.UserName = connectionSocketList.Select(item => item.Name).Where(item=>item!=null).ToList();
              var serializer = new JavaScriptSerializer();
              return serializer.Serialize(userListMessage);
         }
    }
}
