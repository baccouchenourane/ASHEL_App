package com.example.demo;
import org.springframework.stereotype.Service;
@Service
public class TestService {

    public String getMessage() {
        return "Hello from service";
    }
}