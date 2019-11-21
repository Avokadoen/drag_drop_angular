package no.nb.samo.mocktidev.exception;

import org.springframework.web.util.UriUtils;

public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }

    public String getUrlEncodedMessage() {
        return UriUtils.encodePath(getMessage(), "UTF-8");
    }
}
