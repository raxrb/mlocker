/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Database.Database;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.tomcat.util.http.Cookies;

/**
 *
 * @author rax
 */

public class main extends HttpServlet {

    /**
     * This will be the main servlet that will send the normal web page
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */

    private void clearCookie(String id){}

    
//  If page is Viewed First Time / Reloaded, I need to clear the data corresponding to the existing session
//  And I have to send the default data to it
    
    private void serveDefaultPage(HttpServletRequest request, HttpServletResponse response){
        
        System.out.print("The Server Default Page is going to be loaded");
        HttpSession session = request.getSession();
        System.out.print(session.getAttribute("status")+"  This is the session attribute");
       
        if( session.isNew() == false) {
           session.invalidate();
           session=request.getSession(true);
        }
        
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
        response.setHeader("Expires", "0"); // Proxies.
        
//      I got a new session, I need to send the default page to them        
        
        request.setAttribute("JSESSIONID",session.getId());
        ServletContext context= getServletContext();
        RequestDispatcher rd= context.getRequestDispatcher("/samplepage.jsp");
//      The default request is forwarded to them        
        
        System.out.println("serveDefaultPage is there");
        
        try {
            rd.forward(request, response);
        } catch (ServletException ex) {
            Logger.getLogger(main.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(main.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }

//    if status == 1
    private void serveForMobile(HttpServletRequest request, HttpServletResponse response){
        
//        Mobile will have a session header already store in them
//         Therefore they will act as a session by default
        System.out.println(" Serve For Mobile is called ");
        HttpSession session = request.getSession();
        if( session.isNew() ){
            log("Error : Session Not available from the request of mobile");
        }
        
        String body=null;
        try {
            body=getBody(request);
        } catch (IOException ex) {
            Logger.getLogger(main.class.getName()).log(Level.SEVERE, null, ex);
        }
        
//        assert body==null;
        session.setAttribute("data", body);
        System.out.println(" Content sent by the mobile is ");
        System.out.println(body);
        
//      Now Taks Ends here, I have read the data and it is done !!!        
        
    }
    
    
    private  String getBody(HttpServletRequest request) throws IOException {
        String body = null;
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;

        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }

        body = stringBuilder.toString();
        return body;
    }
    
    private void serveForWeb(HttpServletRequest request, HttpServletResponse response){
//        
        
       System.out.println("serveForWeb is there");
//       Read data from the data attribute in the Cookie
//       Send the response back as the response in the Body, and this will do the job
       HttpSession session = request.getSession(); 
       String data = (String)session.getAttribute("data");
//       data="This is for Testing ";
       session.setAttribute("data", "");
       request.setAttribute("JSESSIONID",session.getId());
//     Once the Data is read, it is set to "" for retransmission
//     Data has been acquired, Now need to convert the data into the body response
       PrintWriter out=null;
        try {       
             out = response.getWriter();
        } catch (IOException ex) {
            Logger.getLogger(main.class.getName()).log(Level.SEVERE, null, ex);
        } 
        System.out.print(data);
        assert out==null;
        out.write(data);
        out.flush();
        
    }
    
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        System.out.println("Main servlet Hit");
     
        System.out.print("Cookie is going to be printed");
        Cookie[] cookies = request.getCookies();
        
    if(cookies != null) {
          for (int i = 0; i < cookies.length; i++) {
              Cookie cookie = cookies[i];
            String cookieName = cookie.getName();
            String cookieValue = cookie.getValue();
            System.out.println(cookieName);
       }
         
    }
    else
        System.out.println("Oops ! No cookie ");
        
//       Request from the Web Client for the first page
        
        if(request.getIntHeader("status")==-1){
            System.out.println("Request do not have status Header");
            serveDefaultPage(request, response);
        }

//       Request by Web Client for Data
        else if(request.getIntHeader("status") == 0){
            System.out.println("Status value is 0");
            serveForWeb(request, response);
        }
        
//        Response by Mobile for data
        else if(request.getIntHeader("status") == 1){
        
            // Response of data from Mobile
            System.out.println("Status value is 1");
            serveForMobile(request, response);
            
        }
                    
        
//        response.setContentType("text/html;charset=UTF-8");
//        
//        try (PrintWriter out = response.getWriter()) {
//            /* TODO output your page here. You may use following sample code. */
//            out.println("<!DOCTYPE html>");
//            out.println("<html>");
//            out.println("<head>");
//            out.println("<title>Servlet main</title>");            
//            out.println("</head>");
//            out.println("<body>");
//            out.println("<h1>Servlet main at " + request.getParameter("webclientid") + "</h1>");
//            out.println("</body>");
//            out.println("</html>");
//            
//        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private Byte[] getDataFromSession(HttpSession session) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
