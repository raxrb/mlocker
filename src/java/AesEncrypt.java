/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author rax
 */
import com.sun.xml.internal.messaging.saaj.util.Base64;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.security.spec.AlgorithmParameterSpec;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;

import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

//import android.util.Base64;



public class AesEncrypt {
    
        SecretKey myKey ;
	byte[] myAAD  ;
	byte[] plainText ;
        int myTLen ; 
        Cipher c ;
        byte[] myIv ;

//    public SecretKey wrapKey(byte [] key){
//        c.init(Cipher.UNWRAP_MODE,key);
//    }
//        
//    public byte[] unWrapKey( SecretKey key){
//        return null;
//    }
//    
    
    private SecretKey getkey(byte key[]){
            return new SecretKeySpec(key, 0,key.length, "AES");
    }
    
    private byte[] getByte(SecretKey key){
        return key.getEncoded();
    }
        
    public AesEncrypt() throws Exception {
        
        Security.addProvider(new BouncyCastleProvider());
              if (Security.getProvider("BC") == null){
            System.out.println("Bouncy Castle provider is NOT available");
        }
        else{
            System.out.println("Bouncy Castle provider is available");
        }
//        Security.addProvider(new BouncyCastleProvider());
//        myTLen=8;
//	GCMParameterSpec myParams = new GCMParameterSpec(myTLen, myIv);
//        
//	c = Cipher.getInstance("AES/GCM/NoPadding");
//	c.init(Cipher.ENCRYPT_MODE, myKey, myParams);
////
////	// AAD is optional, if present, it must be supplied before any update/doFinal calls.
////	c.updateAAD(myAAD);  // if AAD is non-null
////	byte[] cipherText = new byte[c.getOutputSize(plainText.length)];
////	c.doFinal(plainText, 0, plainText.length, cipherText);    // conclusion of encryption operation
//
//	// To decrypt, same AAD and GCM parameters must be supplied
////  I think the best, Idea will be to use the crypto js library        
//        
//        byte[] cipherText="dsd".getBytes();
//	c.init(Cipher.DECRYPT_MODE, myKey, myParams);
//	c.updateAAD(myAAD);
//	byte[] recoveredText = c.doFinal(cipherText);
//        System.err.println("This is the recovered Text");
//        System.out.print(recoveredText.toString());

	// MUST CHANGE IV VALUE if the same key were to be used again for encryption
//     	byte[] newIv = null ;
//	myParams = new GCMParameterSpec(myTLen, newIv);
        
    }

    public  String encrypt(String key,String iv,String salt,String data ,String myAAD) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException{
        
//        AES GCM MODE
        SecretKey secretKey=getkey( base64ToBytes(key) );
        int myTLen=64; 
//        System.out.print("SecretKey is "+secretKey.getAlgorithm());
        byte ivByte[]=base64ToBytes(iv);
        GCMParameterSpec myParams = new GCMParameterSpec(myTLen,ivByte );
        Cipher c= Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, secretKey, myParams);
        c.updateAAD(myAAD.getBytes());

       
        byte[] cipheredByte=c.doFinal(data.getBytes());
        return bytesToBase64(cipheredByte);
        
    }
    
    
    public byte[] base64ToBytes(String base64){
       BASE64Decoder decoder = new BASE64Decoder();
        try {
            return decoder.decodeBuffer(base64);
            
        } catch (IOException ex) {
            Logger.getLogger(test.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }
    public String bytesToBase64(byte[] base64){
       BASE64Encoder encoder = new BASE64Encoder();
            return encoder.encode(base64);
    }
}