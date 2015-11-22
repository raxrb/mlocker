/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//var qrcode = new QRCode("qrcode");
//
//function makeCode (a) {      
//    
//    if (!a) {
//        alert("Input a text");
//        elText.focus();
//        return;
//    }
//    qrcode.makeCode(a);
//}

function loaded() {
    
  sjcl.random.startCollectors();
  console.log("Random Collector Started ...");
  console.log("Cipher elements being generated ...");
  generateCipher();
  
}

function parseJsonData(jsonData){
    var json = JSON.parse(jsonData);
    for(i=0;i<json.credentails.length;i++){
        var logins=json.credentails[i];
        console.log( logins.site +" " + logins.user+" "+logins.pass  );
    }
}

 function fromBites(arr) {
    var out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
    for (i=0; i<bl/8; i++) {
      if ((i&3) === 0) {
        tmp = arr[i/4];
      }
      out.push(tmp >>> 24);
      tmp <<= 8;
    }
    return out;
  }

//  Convert the 32bit long to bye array
longToByteArray = function(/*long*/long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0];
//    console.log( size byteArray);
    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
//        long = (long - byte) / 256 ;
        long =long/256;
    }
    
    return byteArray;
};


//  Method for converting bytes array to bit array
 byteToBits= function (bytes) {
    var out = [], i, tmp=0;
    for (i=0; i<bytes.length; i++) {
      tmp = tmp << 8 | bytes[i];
      if ((i&3) === 3) {
        out.push(tmp);
        tmp = 0;
      }
    }
    if (i&3) {
      out.push(sjcl.bitArray.partial(8*(i&3), tmp));
    }
    return out;
  }
  
var cipher = {}


function longToBits(longArray){
     var byteArray=[];
     
     for(var long in longArray){
         var tempByteArray=longToByteArray(longArray[long]);
         for(var tempElement in tempByteArray ){
             byteArray.push(tempByteArray[tempElement]);
         }
     }
     return byteToBits(byteArray);
}
//
//function decrypt(cipheredText){
//    sjcl.
//}

function generateCipher(){
    
    cipher={};
    
//  adata is for additional data for Authentication and the other stuff

    var f={v: 1, iter: 1E3, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes"};
    var e = sjcl.json, f = e.d({iv: sjcl.random.randomWords(4, 0)}, e.defaults);
    
    e.d(f,f.adata);
    cipher.iv=f.iv;
    
    var g = sjcl.misc.cachedPbkdf2(sjcl.random.randomWords(2, 0).toString(), f);
    cipher.key = g.key.slice(0, f.ks / 32);
    cipher.salt = g.salt;
    allFieldBase64(cipher);
    
    
    

    
//    console.log("The value of the key is "+ cipher.key);
//    var bits=longToBits(cipher.key);
//    console.log(" This is the bits " +bits);
//    
//    
//    console.log("Now we got a bits array");
//    console.log(sjcl.bitArray.bitLength(bits));
//    console.log(bits);
//    
//    var base64=sjcl.codec.base64.fromBits(bits);
//    
//    console.log( " This is the utf8 string " + base64 );


      allFieldBase64(cipher);
//    contentForQr(allFieldAggregator(cipher));
}

function allFieldBase64(cipher){
    var bits=longToBits(cipher.key);
    console.log("Key :" +sjcl.codec.base64.fromBits(bits));
    bits=longToBits(cipher.iv);
    console.log("Iv :"+sjcl.codec.base64.fromBits(bits));
    bits=longToBits(cipher.salt);
    console.log("Salt :"+sjcl.codec.base64.fromBits(bits));
}

function allFieldAggregator(cipher){
    var temp="";
    temp += contentForQr(cipher.key);
    temp += contentForQr(cipher.salt);
    temp += contentForQr(cipher.iv);
    return temp;
}

function contentForQr(key){
    var temp="";
    for ( x in key ){
        temp=temp+toHex(key[x]);
    }
    return temp;
}

function qrCodeGenerator(temp){
    console.log(temp);
    document.getElementById("key").innerHTML=temp;
    new QRCode(document.getElementById("qrcode"),temp);
}

//function setElement(a,b){
//    var temp="";
//    console.log("In the setElement Function "+a+" "+b);
//    for (x in cipher.a){
//        temp=temp+" "+cipher.a[x];
//        console.log(cipher.a[x]);
//    }
//    document.getElementById(b).innerHTML=temp;
//}

function toHex( a ){
// if the 
    var b;
    if( a < 0)
       b=(a>>>0).toString(16);
    else  
        b=a.toString(16);
    
        return  b;
}

function encrypt(){
    
       console.log("Encrypt being called on the cipher ...");
       var b="This is going to be Encrypted";
       var a=cipher.key;
       
       b = sjcl.codec.utf8String.toBits(b);
       var g = new sjcl.cipher["aes"](cipher.key);
       var ct = sjcl.mode["ccm"].encrypt(g, b,cipher.iv,"",cipher.ts);
//     The encrypted value is in bits 
       
       console.log("The Encrypted value is ...");
       console.log( sjcl.codec.utf8String.hex.fromBits( ct ) );
//     The console will have the hex value, now I can convert the hex value to the bits
       
}

function decrypt(ciphertext ,cipher){
    
   var  ciphertext = sjcl.codec.base64.toBits(ciphertext);
//    key is a 4 word array
//    word is 32 bits   
    var key=cipher.key;
    var iv=cipher.iv;
    var aes = new sjcl.cipher.aes(key);
//    try {
      console.log("In the decrypt Function. Let's see What happens");
      var plainBits = sjcl.mode.gcm.decrypt(aes,ciphertext,iv,"AAD",128);
      var plainText = sjcl.codec.utf8String.fromBits(plainBits);
      console.log("The PlainText is ");
      console.log(plainText);
      
//    } catch (e) {
//      error("Can't decrypt: " + e);
//    }
    
}

function testDecrypt(){
    
    var cp=document.getElementsByName("cipheredText").innerHTML;
    console.log(cp);
    var plainText = decrypt(cp,cipher);
    console.log("This is the plain Text");
    console.log(plainText);
    
    
}




//makeCode();
//
//$("#text").
//    on("blur", function () {
//        makeCode();
//    }).
//    on("keydown", function (e) {
//        if (e.keyCode == 13) {
//            makeCode();
//        }
//    });