
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import sun.misc.BASE64Decoder;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author rax
 */
public class test {
    
    public static void main(String []args) throws Exception {
        
       String key="YDh2qTSYg38A0mB5JojsNQ==";
       String iv="e4FuHFqGV6DalKq+3xYNUA==";
       String salt="NBY8VlqvgwQ=";
       
       
       AesEncrypt encrypter = new AesEncrypt();
       System.out.print("This is going to be Encrypted");
       System.out.println(encrypter.encrypt(key, iv, salt,"Sample Text","AAD"));
       byte b[] = new byte[2];
       System.out.print("This will print the String from the bytes "+ encrypter.bytesToBase64(b)) ;
       
       
       String test="3drcTFV7EY3mjaXnx9+Msu4W/0JLD3viti69UauemhQ=";
       
      b=encrypter.base64ToBytes(test);
      System.out.println( " This is the string  " + encrypter.bytesToBase64(  Arrays.copyOf(b,16)   ) );
        String data="rlTJ0SNKTF8OUR3uq/10YUMES41mGBnpVwxRaQEnZ7Q=7C0E76748AA7CF928A917169F8A9CF39";
        String key_iv = data.substring(0,44);
        System.out.println(key_iv);
       
    }
    
    void parseString(){
        String data="rlTJ0SNKTF8OUR3uq/10YUMES41mGBnpVwxRaQEnZ7Q=7C0E76748AA7CF928A917169F8A9CF39";
        String key_iv = data.substring(0,43);
        System.out.println(key_iv);
    }
    
    
}
