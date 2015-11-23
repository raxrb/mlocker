<%-- 
    Document   : samplepage
    Created on : 18 Nov, 2015, 10:19:45 PM
    Author     : rax
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        
<html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
        
        <title>Basic Working</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="Mlocker/sjcl.js"></script>
        <script type="text/javascript" src="Mlocker/qrcode.js"></script>
        <script type="text/javascript" src="Mlocker/jquery.min.js"></script>
        <script type="text/javascript" src="Mlocker/qrcode.min.js"></script>
        <script type="text/javascript" src="Mlocker/myfile.js"></script>

    </head>
    
    <body onload="loaded()">
        <h1> This is the Sample Page</h1>
<!--        <input type="text" name="iv" id="iv" tabindex="1" />
        <input type="text" name="key" id="key" tabindex="1"/>
        <input type="text" name="salt" id="salt" tabindex="1"/>        
        <input type="text" name="plaintext" id="plaintext" tabindex="1"/>
        
        <input type="button" name="encrypt" id="encrypt" onclick=""/>
        <input type="button" name="decrypt" id="decrypt" onclick=""/>-->
        
        <form action="JavaScript:testDecrypt()">
          Enter the Ciphered Text:<br>
        <input type="text" name="cipheredText" id="cipheredText">
        </form> 

        <div id="qrcode"></div>
        <h1> <%= request.getAttribute("JSESSIONID") %></h1>
        <data  id="JSESSIONID" value=<%= request.getAttribute("JSESSIONID") %>>
    </body>
    
</html>