package no.nb.samo.mocktidev.exception;

public class UnreachableException extends RuntimeException {
    public UnreachableException() {
        super("Internal error: Entered unreachable code");
    }
}
