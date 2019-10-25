package no.nb.samo.controllers;

//import org.springframework.boot.web.servlet.error.ErrorController;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.time.format.DateTimeFormatter;
//
//@Controller
//public class SamoErrorController implements ErrorController {
//
//    @RequestMapping(value = "/error")
//    public String handleError() {
//        return "forward:/index.html";
//    }
//
//    @RequestMapping(value = "**/api/**")
//    public ResponseEntity<String> handleApiError() {
//        // todo: use hateoas?
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("invalid api request");
//    }
//
//    @Override
//    public String getErrorPath() {
//        return "/error";
//    }
//}
