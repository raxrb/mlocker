/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Database;

import java.util.Hashtable;

/**
 *
 * @author rax
 */
public class Database {
//    This class is responsible for storing the data mapped with the Database
    static Database db=null;
    Hashtable<String,byte[]> table;
    
    private Database() {
    }
    
    public static Database getInstance(){
        if( db==null ){
            db=new Database();
        }
        return db;
    }
    
   public void addData(String key,byte[] value){
        table.put(key, value);
    }
    
    public byte[] getData(String key){
        return table.get(key);
    }
}
