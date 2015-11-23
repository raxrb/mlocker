/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webSocket;

import Database.Database;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.bouncycastle.asn1.dvcs.Data;

/**
 *
 * @author rax
 */
@ServerEndpoint("/endpoint")
public class mlockerEndPoint {
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    
    @OnMessage
    public String onMessage(Session session,String message) {
        System.out.println("Received a message from the WebClient");
        if( message.length() != 32){
            System.out.println("Error in Socket ");
            System.out.println("Received the string"+message);
            return null;
        }
        final String  msg=message;
        final Session  sn=session;
        Database.getInstance().addData(message,null);
        Thread t;
        
        t = new Thread(){
            
            @Override
            public void run() {
                super.run(); //To change body of generated methods, choose Tools | Templates.
//                Add support for Mutex and other stuff
                while( Database.getInstance().getData(msg) == null ){
                    try {
                        wait(1000L);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(mlockerEndPoint.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if( Database.getInstance().getData(msg)!=null){
                    
                    try {
                        sn.getBasicRemote().sendText(Database.getInstance().getData(msg), true);
                    } catch (IOException ex) {
                        System.out.println("Error waiting and replying the data");
                        Logger.getLogger(mlockerEndPoint.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                }
            }
        };
        
                return null;
    }
    
    @OnOpen
    public void onOpen (Session peer) {
        peers.add(peer);
    }

    @OnClose
    public void onClose (Session peer) {
        peers.remove(peer);
    }
}
