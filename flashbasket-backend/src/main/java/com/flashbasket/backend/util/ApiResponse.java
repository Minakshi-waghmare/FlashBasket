package com.flashbasket.backend.util;

public class ApiResponse<T> {


private boolean success;
private String message;
private T data;

public ApiResponse() {}

public ApiResponse(boolean success, String message, T data) {
    this.success = success;
    this.message = message;
    this.data = data;
}

// GETTERS
public boolean isSuccess() {
    return success;
}

public String getMessage() {
    return message;
}

public T getData() {
    return data;
}

// SETTERS
public void setSuccess(boolean success) {
    this.success = success;
}

public void setMessage(String message) {
    this.message = message;
}

public void setData(T data) {
    this.data = data;
}


}
