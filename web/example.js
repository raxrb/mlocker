/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* keep track of which salts have been used. */
var form, usedIvs = {'':1}, usedSalts = {'':1};
var cipher={};


/* enter actions */
var enterActions = {
    
  password: doPbkdf2,
  salt: doPbkdf2,
  iter: doPbkdf2
  
};

var data={
    
}


function loaded() {
    
  form = new formHandler('theForm', enterActions);
  form._extendedKey = [];
  sjcl.random.startCollectors();
  document.getElementById("password").focus();
  generateCipher();
  
}
 
function conversionCheck(){
    
    var x=10;
    x=x.toString();
    
    var temp=sjcl.codec.hex.toBits(x);
//    var temp=sjcl.codec.utf8string.toBits(x);
//    console.log("Conversion Check is called");
//    console.log(temp);
    // this is of utf8 and it will be called from the side
    
//    console.log(sjcl.codec.);

    console.log("This is the value of the x in Bits "+ temp);
    console.log("This is the value of x in Hex ");
    
    console.log( sjcl.codec.hex.fromBits(temp) );
//    var theHex = sjcl.codec.hex.fromBits(temp);
    console.log("This the value in the utf8string value");
    console.log(sjcl.codec.utf8String.fromBits(temp));
    
     
//    console.log( sjcl.codec.hec.fromB ); 
    console.log("Conversion Check is Ended");
    
}

function generateCipher(){
    
//    conversionCheck();
    cipher={};
    var f={v: 1, iter: 1E3, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes"};
    var e = sjcl.json, f = e.d({iv: sjcl.random.randomWords(4, 0)}, e.defaults);
    
//    console.log("Checking for the value ");
//    console.log(f.iv);

    e.d(f,f.adata);
    cipher.iv=f.iv;
    var g = sjcl.misc.cachedPbkdf2(sjcl.random.randomWords(2, 0).toString(), f);
    cipher.key = g.key.slice(0, f.ks / 32);
    console.log( "The type of key is " + typeof cipher.key);
    cipher.salt = g.salt;
    
    console.log("Cipher salt is going to be printed");
    for ( x in cipher.salt)
        console.log(x+"  :  " + cipher.salt[x]);
    console.log("Cipher key is going to be printed");
    for (x in cipher.key)
        console.log(x+" : "+cipher.key[x]);
    console.log("cipher iv is ");
    for (x in cipher.iv){
        console.log(x+" : "+cipher.iv[x]);
//        console.log(sizeof(cipher.iv[x]));
        console.log(x+"  :  "+cipher.iv[x].toString(16));
        console.log(x+"  :  "+cipher.iv[x].toString(2));
    }
}

function simpleEncrypt(){

       // password || key , plaintext , p ( tells about various modes and the other things ) ,
    
       var b="This is going to be Encrypted";
       var a=cipher.key;
       
       "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
       var g = new sjcl.cipher["aes"](cipher.key);

       var ct = sjcl.mode["ccm"].encrypt(g, b,cipher.iv,"",cipher.ts);
       

       console.log("This going to be the encrypted value ");
       var e = sjcl.json;
       
       console.log( sjcl.codec.hex.fromBits( ct ) );
//       var temp = sjcl.codec.base64.toBits(ct);
//       console.log("The value of the temp is  "+ temp);
//       console.log( sjcl.codec.hex.fromBits( ct  )  );
//       console.log(e.encode(ct));

   
}

function simpleDecrypt(){
//    This is the decrypt function and I have to make sure 
}

/* there's probaby a better way to tell the user something, but oh well */
function error(x) {
 alert(x);
}

/* compute PBKDF2 on the password. */

function doPbkdf2(decrypting) {
    
    console.log("In the method doPbkdf2 ");
//  var v = form.get(), salt=v.salt, key, hex = sjcl.codec.hex.fromBits, p={},
//      password = v.password;
//  
//  p.iter = v.iter;
//  password=sjcl.random.randomWords(2, 0);
//  console.log("This is the random password for protection of the key");
//  console.log(password);
//  if (password.length == 0) {
//    if (decrypting) { error("Can't decrypt: need a password!"); }
//    return;
//  }
//  
//  if (salt.length === 0 && decrypting) {
//    error("Can't decrypt: need a salt for PBKDF2!");
//    return;
//  }
//  
//  if (decrypting || !v.freshsalt || !usedSalts[v.salt]) {
//    p.salt = v.salt;
//  }
//  
//  p = sjcl.misc.cachedPbkdf2(password, p);
//  form._extendedKey = p.key;
//  
////  keysize is divided by 32, to perform some useful task, I don't know what is that
//  v.key = p.key.slice(0, v.keysize/32);
//  v.salt = p.salt;
//   
//  form.set(v);
////  form.plaintext.el.select();
}

///* Encrypt a message */



function doEncrypt() {
    
  var v = form.get(), iv = v.iv, password = v.password, key = v.key, adata = v.adata, aes, plaintext=v.plaintext, rp = {}, ct, p;
  
//    generateCipher();
//    simpleEncrypt();
  
  console.log("In the Encryption ");
  password=sjcl.random.randomWords(2, 0);
  if (plaintext === '' && v.ciphertext.length) { return; }
  if (key.length == 0 && password.length == 0) {
    error("need a password or key!");
    return;
  }
  p = { adata:v.adata,
        iter:v.iter,
        mode:v.mode,
        ts:parseInt(v.tag),
        ks:parseInt(v.keysize) };
    
  password=password.toString();
  
  if (!v.freshiv || !usedIvs[v.iv]) { p.iv = v.iv; }
  if (!v.freshsalt || !usedSalts[v.salt]) { p.salt = v.salt; }
  ct = sjcl.encrypt(password || key, plaintext, p, rp).replace(/,/g,",\n");
  v.iv = rp.iv;
  usedIvs[rp.iv] = 1;
  if (rp.salt) {
    v.salt = rp.salt;
    usedSalts[rp.salt] = 1;
  }
  console.log("We are going to check if the rp exists");
  console.log(rp.key);
  v.key = rp.key;
  if (v.json) {
    v.ciphertext = ct;
    v.adata = '';
  } else {
    v.ciphertext = ct.match(/"ct":"(jj[^"]*)"/)[1]; //"
  }
  
  console.log("Key created is " + rp.key);
  for (x in rp.key){
        if( rp.key[x] >=0)
            console.log(x + " is the x "+rp.key[x].toString(16));
        else 
            console.log(x + " is the x "+(rp.key[x]>>>0).toString(16));
  }
  
  console.log("The salt is "+v.salt);
  console.log("The Iv is + "+v.iv);
  
  
  v.plaintext = 'This will be the plain text';
//  console.log(v);
  form.set(v);
  
//  This is responsible for setting the key and other things
//  but why the hex value are set

  form.ciphertext.el.select();
}

/* Decrypt a message */
//function doDecrypt() {
//  var v = form.get(), iv = v.iv, key = v.key, adata = v.adata, aes, ciphertext=v.ciphertext, rp = {};
//  
//  if (ciphertext.length === 0) { return; }
//  if (!v.password && !v.key.length) {
//    error("Can't decrypt: need a password or key!"); return;
//  }
//  
//  if (ciphertext.match("{")) {
//    /* it's jsonized */
//    try {
//      v.plaintext = sjcl.decrypt(v.password || v.key, ciphertext, {}, rp);
//    } catch(e) {
//      error("Can't decrypt: "+e);
//      return;
//    }
//    v.mode = rp.mode;
//    v.iv = rp.iv;
//    v.adata = rp.adata;
//    if (v.password) {
//      v.salt = rp.salt;
//      v.iter = rp.iter;
//      v.keysize = rp.ks;
//      v.tag = rp.ts;
//    }
//    v.key = rp.key;
//    v.ciphertext = "";
//    document.getElementById('plaintext').select();
//  } else {
//    /* it's raw */
//    ciphertext = sjcl.codec.base64.toBits(ciphertext);
//    if (iv.length === 0) {
//      error("Can't decrypt: need an IV!"); return;
//    }
//    if (key.length === 0) {
//      if (v.password.length) {
//        doPbkdf2(true);
//        key = v.key;
//      }
//    }
//    aes = new sjcl.cipher.aes(key);
//    
//    try {
//      v.plaintext = sjcl.codec.utf8String.fromBits(sjcl.mode[v.mode].decrypt(aes, ciphertext, iv, v.adata, v.tag));
//      v.ciphertext = "";
//      document.getElementById('plaintext').select();
//    } catch (e) {
//      error("Can't decrypt: " + e);
//    }
//  }
//  console.log("Set will be called fromt the Decrypt method");
//  form.set(v);
//}
//
//function extendKey(size) {
////   console.log("Extended key is called ");
////   console.log(size);
//   
//  form.key.set(form._extendedKey.slice(0,size));
////  form.key.set("This will be set after extended key");
//}

function randomize(field, words, paranoia) {
//    console.log(form[field]);
  form[field].set(sjcl.random.randomWords(words, paranoia));
  if (field == 'salt') { form.key.set([]); }
  
}
