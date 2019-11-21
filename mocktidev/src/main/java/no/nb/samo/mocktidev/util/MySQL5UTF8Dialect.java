package no.nb.samo.mocktidev.util;

import org.hibernate.dialect.MySQL5Dialect;

public class MySQL5UTF8Dialect extends MySQL5Dialect {
    @Override
    public String getTableTypeString() {
        return " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    }
}
