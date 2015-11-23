/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.util.Hashtable;
import org.bouncycastle.jcajce.provider.symmetric.HC128;

/**
 *
 * @author rax
 */
public class Database {
//    This class is responsible for storing the data mapped with the Database
    static Database db=null;
  private  Hashtable<String,String> table=new Hashtable<String,String>();
    
    private Database() {
    }
    
    public static Database getInstance(){
        if( db==null ){
            db=new Database();
        }
        return db;
    }
    
   public void addData(String key,String value){
        table.put(key, value);
    }
    
    public String getData(String key){
        return table.get(key);
    }
    
    public void clearKey(String key){
        table.remove(key);
    }
}
