/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loaded() {
    
  sjcl.random.startCollectors();
  console.log("Random Collector Started ...");
  console.log("Cipher elements being generated ...");
  generateCipher();
  
}

function openWebSocket(){
    var ws = new WebSocket('ws://localhost:8080/Mlocker/endpoint',
                       ['appProtocol', 'appProtocol-v2']);
                       
    ws.onopen = function () { 
        console.log("Ws Connection Established");
        console.log("Sending JSESSIONID : ");
        console.log(cipher.JSESSIONID);
        ws.send(cipher.JSESSIONID);
    }

    ws.onmessage = function(msg) { 
        console.log("Message recieved by the Web Client");
        if(msg.data instanceof Blob) { 
            console.log("Data is received as the Text");
        } else {
            console.log("Decryption is going to be processed + message is :");
            console.log(msg.data);
            decrypt(msg.data,cipher);
        }
    }
    
}

function parseJsonData(jsonData){
    var json = JSON.parse(jsonData);
    for(i=0;i<json.credentails.length;i++){
        var logins=json.credentails[i];
        console.log( logins.site +" " + logins.user+" "+logins.pass  );
//       on  code for opening the new tab
    }
}

var cipher = {}

function sendingDataFormat(cipher,JsessionId){
    var g=sjcl.bitArray;
    var temp=g.concat(cipher.key,cipher.iv);
    if(g.bitLength(temp)!= 256){
        console.log("Error key not of 256 bit");
    }
    var base64=sjcl.codec.base64.fromBits(temp);
    console.log(base64);
    var finalString = base64 + JsessionId;
    console.log(finalString);
    return finalString;
}

function openTab(jsonCredintials){
    parseJsonData(jsonCredintials);
}
function generateCipher(){
   
    cipher={};
    //  adata is for additional data for Authentication and the other stuff
    var f={v: 1, iter: 1E3, ks: 128, ts: 128, mode: "gcm", adata: "AAD", cipher: "aes"};
    var e = sjcl.json, f = e.d({iv: sjcl.random.randomWords(4, 0)}, e.defaults);
    e.d(f,f.adata);
    cipher.iv=f.iv;
    cipher.JSESSIONID=document.getElementById("JSESSIONID").value;
     var g = sjcl.misc.cachedPbkdf2(sjcl.random.randomWords(2, 0).toString(), f);
    cipher.key = g.key.slice(0, f.ks / 32);
    var qrData= sendingDataFormat(cipher,cipher.JSESSIONID);
    qrCodeGenerator(qrData);
    openWebSocket();
}

function qrCodeGenerator(temp){
    console.log(temp);
    new QRCode(document.getElementById("qrcode"),temp);
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
    var key=cipher.key;
    var iv=cipher.iv;
    var aes = new sjcl.cipher.aes(key);
//    try {
      console.log("In the decrypt Function. Let's see What happens");
      var plainBits = sjcl.mode.gcm.decrypt(aes,ciphertext,iv,sjcl.codec.utf8String.toBits("AAD"),128);
      var plainText = sjcl.codec.utf8String.fromBits(plainBits);
      openTab(plainText);
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
